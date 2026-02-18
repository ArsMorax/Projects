-- StoreHub Database Schema
-- Run this manually if you prefer not to use the auto-migration in Go.

CREATE DATABASE IF NOT EXISTS storehub
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE storehub;

CREATE TABLE IF NOT EXISTS products (
    product_id     INT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    description    VARCHAR(255) DEFAULT '',
    price          DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Indexes for common query patterns
    INDEX idx_name (name),              -- supports LIKE 'prefix%' searches
    INDEX idx_created_at (created_at),  -- supports ORDER BY created_at DESC
    INDEX idx_stock (stock_quantity)    -- supports low-stock filtering
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample seed data
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
    ('Steam Deck OLED', '1TB model, 7.4-inch HDR OLED display', 649.99, 0);
