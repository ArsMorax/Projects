//go:build ignore

package main

import (
	"context"
	"database/sql"
	"fmt"
	"sync"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	db, err := sql.Open("mysql", "root:@tcp(127.0.0.1:3306)/storehub?parseTime=true")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)

	fmt.Println("=== StoreHub Concurrency Stress Test ===")
	fmt.Println()

	benchConcurrentReads(db, 100)
	benchConcurrentWrites(db, 50)
	benchMixedWorkload(db, 100)
}

func benchConcurrentReads(db *sql.DB, workers int) {
	fmt.Printf("Benchmark: %d concurrent SELECT queries\n", workers)

	var wg sync.WaitGroup
	start := time.Now()
	errCount := 0
	var mu sync.Mutex

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()

			rows, err := db.QueryContext(ctx, "SELECT product_id, name, price FROM products")
			if err != nil {
				mu.Lock()
				errCount++
				mu.Unlock()
				return
			}
			defer rows.Close()
			for rows.Next() {
				var id int
				var name string
				var price float64
				rows.Scan(&id, &name, &price)
			}
		}()
	}

	wg.Wait()
	elapsed := time.Since(start)
	fmt.Printf("  Completed in %v | Errors: %d | Throughput: %.0f queries/sec\n\n",
		elapsed, errCount, float64(workers)/elapsed.Seconds())
}

func benchConcurrentWrites(db *sql.DB, workers int) {
	fmt.Printf("Benchmark: %d concurrent INSERT+DELETE cycles\n", workers)

	var wg sync.WaitGroup
	start := time.Now()
	errCount := 0
	var mu sync.Mutex

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()

			name := fmt.Sprintf("bench_product_%d", idx)
			result, err := db.ExecContext(ctx,
				"INSERT INTO products (name, description, price, stock_quantity) VALUES (?, ?, ?, ?)",
				name, "benchmark item", 9.99, 1)
			if err != nil {
				mu.Lock()
				errCount++
				mu.Unlock()
				return
			}

			id, _ := result.LastInsertId()
			_, err = db.ExecContext(ctx, "DELETE FROM products WHERE product_id = ?", id)
			if err != nil {
				mu.Lock()
				errCount++
				mu.Unlock()
			}
		}(i)
	}

	wg.Wait()
	elapsed := time.Since(start)
	fmt.Printf("  Completed in %v | Errors: %d | Throughput: %.0f ops/sec\n\n",
		elapsed, errCount, float64(workers*2)/elapsed.Seconds())
}

func benchMixedWorkload(db *sql.DB, workers int) {
	fmt.Printf("Benchmark: %d mixed read/write goroutines\n", workers)

	var wg sync.WaitGroup
	start := time.Now()
	reads, writes := 0, 0
	errCount := 0
	var mu sync.Mutex

	for i := 0; i < workers; i++ {
		wg.Add(1)
		go func(idx int) {
			defer wg.Done()
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()

			if idx%3 == 0 {
				name := fmt.Sprintf("mixed_bench_%d", idx)
				res, err := db.ExecContext(ctx,
					"INSERT INTO products (name, description, price, stock_quantity) VALUES (?, ?, ?, ?)",
					name, "mixed workload", 1.00, 1)
				if err != nil {
					mu.Lock()
					errCount++
					mu.Unlock()
					return
				}
				id, _ := res.LastInsertId()
				db.ExecContext(ctx, "DELETE FROM products WHERE product_id = ?", id)
				mu.Lock()
				writes++
				mu.Unlock()
			} else {
				var total int
				err := db.QueryRowContext(ctx,
					"SELECT COUNT(*) FROM products").Scan(&total)
				if err != nil {
					mu.Lock()
					errCount++
					mu.Unlock()
					return
				}
				mu.Lock()
				reads++
				mu.Unlock()
			}
		}(i)
	}

	wg.Wait()
	elapsed := time.Since(start)
	fmt.Printf("  Completed in %v | Reads: %d | Writes: %d | Errors: %d | Total throughput: %.0f ops/sec\n",
		elapsed, reads, writes, errCount, float64(reads+writes)/elapsed.Seconds())
	fmt.Println()
	fmt.Println("=== Benchmark Complete ===")
}
