package main

import (
	"database/sql"
	"html/template"
	"net/http"
	_ "github.com/go-sql-driver/mysql"
)

type Product struct {
	ID    int
	Name  string
	Stock int
}

func main() {
	db, err := sql.Open("mysql", "root:@/inventories")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT product_id, name, stock_quantity FROM products")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		var products []Product
		for rows.Next() {
			var p Product
			rows.Scan(&p.ID, &p.Name, &p.Stock)
			products = append(products, p)
		}

		tmpl := template.Must(template.ParseFiles("index.html"))

		tmpl.Execute(w, products)
	})

	printInfo := "Server started at http://localhost:8080"
	println(printInfo)
	http.ListenAndServe(":8080", nil)
}