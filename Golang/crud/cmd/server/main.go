package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"golang-sql/internal/config"
	"golang-sql/internal/database"
	"golang-sql/internal/repository"
	"golang-sql/internal/server"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(logger)

	cfg := config.Load()

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	db, err := database.Connect(ctx, cfg.Database, logger)
	if err != nil {
		logger.Error("database_connect_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
	defer db.Close()

	if err := database.RunMigrations(ctx, db, logger); err != nil {
		logger.Error("migration_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}

	if err := database.SeedIfEmpty(ctx, db, logger); err != nil {
		logger.Error("seed_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}

	repo, err := repository.NewMySQLProductRepo(db)
	if err != nil {
		logger.Error("repository_init_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
	defer repo.Close()

	srv, err := server.New(cfg, repo, logger)
	if err != nil {
		logger.Error("server_init_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}

	errCh := make(chan error, 1)
	go func() {
		logger.Info("server_starting",
			slog.String("addr", srv.Addr),
			slog.String("url", "http://localhost:"+cfg.Server.Port),
		)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			errCh <- err
		}
		close(errCh)
	}()

	select {
	case err := <-errCh:
		logger.Error("server_error", slog.String("error", err.Error()))
		os.Exit(1)
	case <-ctx.Done():
		logger.Info("shutdown_signal_received")

		shutdownCtx, cancel := context.WithTimeout(context.Background(), cfg.Server.ShutdownTimeout)
		defer cancel()

		if err := srv.Shutdown(shutdownCtx); err != nil {
			logger.Error("shutdown_error", slog.String("error", err.Error()))
			os.Exit(1)
		}
		logger.Info("server_stopped_gracefully")
	}
}
