package server

import (
	"fmt"
	"html/template"
	"log/slog"
	"net/http"
	"time"

	"golang-sql/internal/config"
	"golang-sql/internal/handler"
	"golang-sql/internal/middleware"
	"golang-sql/internal/repository"
)

func New(cfg *config.Config, repo repository.ProductRepository, logger *slog.Logger) (*http.Server, error) {
	tmpl, err := template.ParseFiles("web/templates/index.html")
	if err != nil {
		return nil, fmt.Errorf("parsing template: %w", err)
	}

	mux := http.NewServeMux()

	productHandler := handler.NewProductHandler(repo, logger, tmpl)
	productHandler.RegisterRoutes(mux)

	stack := middleware.Chain(mux,
		middleware.Recovery(logger),
		middleware.RequestID,
		middleware.Logger(logger),
		middleware.SecurityHeaders,
		middleware.CORS(),
		middleware.RateLimit(cfg.RateLimit.RequestsPerSecond, cfg.RateLimit.Burst),
		middleware.Timeout(10*time.Second),
	)

	srv := &http.Server{
		Addr:         fmt.Sprintf("%s:%s", cfg.Server.Host, cfg.Server.Port),
		Handler:      stack,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
		IdleTimeout:  cfg.Server.IdleTimeout,
	}

	return srv, nil
}
