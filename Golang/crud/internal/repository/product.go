package repository

import (
	"context"
	"database/sql"
	"fmt"
	"math"

	"golang-sql/internal/model"
)

type ProductRepository interface {
	List(ctx context.Context, search string, page, pageSize int) (*model.PaginatedResponse, error)
	GetByID(ctx context.Context, id int64) (*model.Product, error)
	Create(ctx context.Context, p *model.Product) error
	Update(ctx context.Context, p *model.Product) error
	Delete(ctx context.Context, id int64) error
	Stats(ctx context.Context) (*model.Stats, error)
	Close() error
}

type mysqlProductRepo struct {
	db          *sql.DB
	stmtGetByID *sql.Stmt
	stmtCreate  *sql.Stmt
	stmtUpdate  *sql.Stmt
	stmtDelete  *sql.Stmt
	stmtStats   *sql.Stmt
}

func NewMySQLProductRepo(db *sql.DB) (ProductRepository, error) {
	stmts := make(map[string]*sql.Stmt)
	queries := map[string]string{
		"getByID": `SELECT product_id, name, description, price, stock_quantity, created_at
		            FROM products WHERE product_id = ?`,
		"create": `INSERT INTO products (name, description, price, stock_quantity)
		           VALUES (?, ?, ?, ?)`,
		"update": `UPDATE products
		           SET name = ?, description = ?, price = ?, stock_quantity = ?
		           WHERE product_id = ?`,
		"delete": `DELETE FROM products WHERE product_id = ?`,
		"stats": `SELECT
		            COUNT(*) AS total_products,
		            COALESCE(SUM(stock_quantity), 0) AS total_stock,
		            COALESCE(SUM(price * stock_quantity), 0) AS total_value,
		            COALESCE(SUM(CASE WHEN stock_quantity > 0 AND stock_quantity <= 10 THEN 1 ELSE 0 END), 0) AS low_stock
		          FROM products`,
	}

	for name, q := range queries {
		stmt, err := db.Prepare(q)
		if err != nil {
			for _, s := range stmts {
				s.Close()
			}
			return nil, fmt.Errorf("preparing %s: %w", name, err)
		}
		stmts[name] = stmt
	}

	return &mysqlProductRepo{
		db:          db,
		stmtGetByID: stmts["getByID"],
		stmtCreate:  stmts["create"],
		stmtUpdate:  stmts["update"],
		stmtDelete:  stmts["delete"],
		stmtStats:   stmts["stats"],
	}, nil
}

func (r *mysqlProductRepo) Close() error {
	for _, s := range []*sql.Stmt{r.stmtGetByID, r.stmtCreate, r.stmtUpdate, r.stmtDelete, r.stmtStats} {
		if s != nil {
			s.Close()
		}
	}
	return nil
}

func (r *mysqlProductRepo) List(ctx context.Context, search string, page, pageSize int) (*model.PaginatedResponse, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	offset := (page - 1) * pageSize

	var (
		countQuery string
		listQuery  string
		args       []interface{}
	)

	if search != "" {
		like := "%" + search + "%"
		countQuery = "SELECT COUNT(*) FROM products WHERE name LIKE ? OR description LIKE ?"
		listQuery = `SELECT product_id, name, description, price, stock_quantity, created_at
		             FROM products WHERE name LIKE ? OR description LIKE ?
		             ORDER BY created_at DESC LIMIT ? OFFSET ?`
		args = []interface{}{like, like}
	} else {
		countQuery = "SELECT COUNT(*) FROM products"
		listQuery = `SELECT product_id, name, description, price, stock_quantity, created_at
		             FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?`
	}

	var total int
	if err := r.db.QueryRowContext(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, fmt.Errorf("counting products: %w", err)
	}

	listArgs := append(args, pageSize, offset)
	rows, err := r.db.QueryContext(ctx, listQuery, listArgs...)
	if err != nil {
		return nil, fmt.Errorf("listing products: %w", err)
	}
	defer rows.Close()

	products := make([]model.Product, 0, min(pageSize, total))
	for rows.Next() {
		var p model.Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Price, &p.StockQty, &p.CreatedAt); err != nil {
			return nil, fmt.Errorf("scanning product row: %w", err)
		}
		products = append(products, p)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterating product rows: %w", err)
	}

	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))

	return &model.PaginatedResponse{
		Products:   products,
		Total:      total,
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
	}, nil
}

func (r *mysqlProductRepo) GetByID(ctx context.Context, id int64) (*model.Product, error) {
	var p model.Product
	err := r.stmtGetByID.QueryRowContext(ctx, id).Scan(
		&p.ID, &p.Name, &p.Description, &p.Price, &p.StockQty, &p.CreatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("getting product %d: %w", id, err)
	}
	return &p, nil
}

func (r *mysqlProductRepo) Create(ctx context.Context, p *model.Product) error {
	result, err := r.stmtCreate.ExecContext(ctx, p.Name, p.Description, p.Price, p.StockQty)
	if err != nil {
		return fmt.Errorf("creating product: %w", err)
	}
	id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("getting last insert id: %w", err)
	}
	p.ID = id
	return nil
}

func (r *mysqlProductRepo) Update(ctx context.Context, p *model.Product) error {
	result, err := r.stmtUpdate.ExecContext(ctx, p.Name, p.Description, p.Price, p.StockQty, p.ID)
	if err != nil {
		return fmt.Errorf("updating product %d: %w", p.ID, err)
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("checking rows affected: %w", err)
	}
	if affected == 0 {
		return fmt.Errorf("product %d not found", p.ID)
	}
	return nil
}

func (r *mysqlProductRepo) Delete(ctx context.Context, id int64) error {
	result, err := r.stmtDelete.ExecContext(ctx, id)
	if err != nil {
		return fmt.Errorf("deleting product %d: %w", id, err)
	}
	affected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("checking rows affected: %w", err)
	}
	if affected == 0 {
		return fmt.Errorf("product %d not found", id)
	}
	return nil
}

func (r *mysqlProductRepo) Stats(ctx context.Context) (*model.Stats, error) {
	var s model.Stats
	err := r.stmtStats.QueryRowContext(ctx).Scan(
		&s.TotalProducts, &s.TotalStock, &s.TotalValue, &s.LowStockCount,
	)
	if err != nil {
		return nil, fmt.Errorf("computing stats: %w", err)
	}
	return &s, nil
}
