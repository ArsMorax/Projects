package database

import (
	"context"
	"database/sql"
	"fmt"
	"log/slog"
	"time"

	_ "github.com/go-sql-driver/mysql"

	"golang-sql/internal/config"
)

func Connect(ctx context.Context, cfg config.DatabaseConfig, logger *slog.Logger) (*sql.DB, error) {
	db, err := sql.Open("mysql", cfg.DSN())
	if err != nil {
		return nil, fmt.Errorf("opening database: %w", err)
	}

	db.SetMaxOpenConns(cfg.MaxOpenConns)
	db.SetMaxIdleConns(cfg.MaxIdleConns)
	db.SetConnMaxLifetime(cfg.ConnMaxLifetime)
	db.SetConnMaxIdleTime(cfg.ConnMaxIdleTime)

	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if err := db.PingContext(pingCtx); err != nil {
		db.Close()
		return nil, fmt.Errorf("pinging database: %w", err)
	}

	logger.Info("database connected",
		slog.String("host", cfg.Host),
		slog.String("port", cfg.Port),
		slog.String("database", cfg.Name),
		slog.Int("max_open_conns", cfg.MaxOpenConns),
		slog.Int("max_idle_conns", cfg.MaxIdleConns),
		slog.String("conn_max_lifetime", cfg.ConnMaxLifetime.String()),
	)

	return db, nil
}

func RunMigrations(ctx context.Context, db *sql.DB, logger *slog.Logger) error {
	query := `
	CREATE TABLE IF NOT EXISTS products (
		product_id     INT AUTO_INCREMENT PRIMARY KEY,
		name           VARCHAR(100) NOT NULL,
		description    VARCHAR(255) DEFAULT '',
		price          DECIMAL(12,2) NOT NULL DEFAULT 0.00,
		stock_quantity INT NOT NULL DEFAULT 0,
		created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		INDEX idx_name (name),
		INDEX idx_created_at (created_at),
		INDEX idx_stock (stock_quantity)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

	if _, err := db.ExecContext(ctx, query); err != nil {
		return fmt.Errorf("running migration: %w", err)
	}

	logger.Info("database migration completed")
	return nil
}

func SeedIfEmpty(ctx context.Context, db *sql.DB, logger *slog.Logger) error {
	var count int
	if err := db.QueryRowContext(ctx, "SELECT COUNT(*) FROM products").Scan(&count); err != nil {
		return fmt.Errorf("counting products: %w", err)
	}

	if count > 0 {
		logger.Info("database already seeded", slog.Int("products", count))
		return nil
	}

	seed := `
	INSERT INTO products (name, description, price, stock_quantity) VALUES
		('MacBook Pro 16"', 'M4 Max chip, 48GB RAM, 1TB SSD', 3499.00, 12),
		('Sony WH-1000XM5', 'Industry-leading noise-cancelling headphones', 349.99, 45),
		('LG UltraFine 5K', '27-inch 5K IPS monitor with Thunderbolt 3', 1299.00, 8),
		('Keychron Q1 Pro', 'Wireless 75 percent layout, Gateron Jupiter Brown', 199.00, 63),
		('Samsung Galaxy S25 Ultra', 'Snapdragon 8 Elite, 200MP camera, 5000mAh', 1419.99, 30),
		('iPad Pro 13"', 'M4 chip, Ultra Retina XDR display, 256GB', 1299.00, 22),
		('Logitech MX Master 3S', 'Advanced wireless mouse with MagSpeed scroll', 99.99, 87),
		('AirPods Pro 2', 'Active noise cancellation, USB-C charging', 249.00, 150),
		('Dell XPS 15', 'Intel Core Ultra 9, 32GB RAM, OLED display', 2199.00, 5),
		('Raspberry Pi 5', '8GB ARM single-board computer for IoT projects', 79.99, 200),
		('Nintendo Switch 2', 'Next-gen hybrid gaming console', 449.99, 3),
		('Steam Deck OLED', '1TB model, 7.4-inch HDR OLED display', 649.99, 0);`

	if _, err := db.ExecContext(ctx, seed); err != nil {
		return fmt.Errorf("seeding products: %w", err)
	}

	logger.Info("database seeded with sample products")
	return nil
}
