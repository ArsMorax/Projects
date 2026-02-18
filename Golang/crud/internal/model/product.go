package model

import (
	"errors"
	"strings"
	"time"
)

type Product struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Price       float64   `json:"price"`
	StockQty    int       `json:"stock_quantity"`
	CreatedAt   time.Time `json:"created_at"`
}

func (p *Product) Validate() error {
	p.Name = strings.TrimSpace(p.Name)
	p.Description = strings.TrimSpace(p.Description)

	if p.Name == "" {
		return errors.New("product name is required")
	}
	if len(p.Name) > 100 {
		return errors.New("product name must be 100 characters or less")
	}
	if len(p.Description) > 255 {
		return errors.New("description must be 255 characters or less")
	}
	if p.Price < 0 {
		return errors.New("price must be non-negative")
	}
	if p.StockQty < 0 {
		return errors.New("stock quantity must be non-negative")
	}
	return nil
}

type Stats struct {
	TotalProducts int     `json:"total_products"`
	TotalStock    int     `json:"total_stock"`
	TotalValue    float64 `json:"total_value"`
	LowStockCount int    `json:"low_stock_count"`
}

type PaginatedResponse struct {
	Products   []Product `json:"products"`
	Total      int       `json:"total"`
	Page       int       `json:"page"`
	PageSize   int       `json:"page_size"`
	TotalPages int       `json:"total_pages"`
}

type APIResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}
