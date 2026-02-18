package handler

import (
	"encoding/json"
	"html/template"
	"log/slog"
	"net/http"
	"strconv"

	"golang-sql/internal/model"
	"golang-sql/internal/repository"
)

type ProductHandler struct {
	repo   repository.ProductRepository
	logger *slog.Logger
	tmpl   *template.Template
}

func NewProductHandler(repo repository.ProductRepository, logger *slog.Logger, tmpl *template.Template) *ProductHandler {
	return &ProductHandler{repo: repo, logger: logger, tmpl: tmpl}
}

func (h *ProductHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /{$}", h.ServeIndex)
	mux.HandleFunc("GET /api/products", h.ListProducts)
	mux.HandleFunc("GET /api/products/{id}", h.GetProduct)
	mux.HandleFunc("POST /api/products", h.CreateProduct)
	mux.HandleFunc("PUT /api/products/{id}", h.UpdateProduct)
	mux.HandleFunc("DELETE /api/products/{id}", h.DeleteProduct)
	mux.HandleFunc("GET /api/stats", h.GetStats)
	mux.HandleFunc("GET /health", h.HealthCheck)
}

func (h *ProductHandler) jsonOK(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(model.APIResponse{Success: true, Data: data})
}

func (h *ProductHandler) jsonErr(w http.ResponseWriter, status int, msg string) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(model.APIResponse{Success: false, Error: msg})
}

func (h *ProductHandler) ServeIndex(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := h.tmpl.Execute(w, nil); err != nil {
		h.logger.Error("template_render_failed", slog.String("error", err.Error()))
		http.Error(w, "internal server error", http.StatusInternalServerError)
	}
}

func (h *ProductHandler) ListProducts(w http.ResponseWriter, r *http.Request) {
	search := r.URL.Query().Get("search")
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	pageSize, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	result, err := h.repo.List(r.Context(), search, page, pageSize)
	if err != nil {
		h.logger.Error("list_products_failed", slog.String("error", err.Error()))
		h.jsonErr(w, http.StatusInternalServerError, "failed to retrieve products")
		return
	}

	h.jsonOK(w, http.StatusOK, result)
}

func (h *ProductHandler) GetProduct(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		h.jsonErr(w, http.StatusBadRequest, "invalid product ID")
		return
	}

	product, err := h.repo.GetByID(r.Context(), id)
	if err != nil {
		h.logger.Error("get_product_failed", slog.String("error", err.Error()))
		h.jsonErr(w, http.StatusInternalServerError, "failed to retrieve product")
		return
	}
	if product == nil {
		h.jsonErr(w, http.StatusNotFound, "product not found")
		return
	}

	h.jsonOK(w, http.StatusOK, product)
}

func (h *ProductHandler) CreateProduct(w http.ResponseWriter, r *http.Request) {
	var p model.Product
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		h.jsonErr(w, http.StatusBadRequest, "invalid JSON payload")
		return
	}

	if err := p.Validate(); err != nil {
		h.jsonErr(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	if err := h.repo.Create(r.Context(), &p); err != nil {
		h.logger.Error("create_product_failed", slog.String("error", err.Error()))
		h.jsonErr(w, http.StatusInternalServerError, "failed to create product")
		return
	}

	h.jsonOK(w, http.StatusCreated, p)
}

func (h *ProductHandler) UpdateProduct(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		h.jsonErr(w, http.StatusBadRequest, "invalid product ID")
		return
	}

	var p model.Product
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		h.jsonErr(w, http.StatusBadRequest, "invalid JSON payload")
		return
	}
	p.ID = id

	if err := p.Validate(); err != nil {
		h.jsonErr(w, http.StatusUnprocessableEntity, err.Error())
		return
	}

	if err := h.repo.Update(r.Context(), &p); err != nil {
		h.logger.Error("update_product_failed", slog.String("error", err.Error()))
		h.jsonErr(w, http.StatusInternalServerError, "failed to update product")
		return
	}

	updated, err := h.repo.GetByID(r.Context(), id)
	if err != nil || updated == nil {
		h.jsonOK(w, http.StatusOK, p)
		return
	}
	h.jsonOK(w, http.StatusOK, updated)
}

func (h *ProductHandler) DeleteProduct(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
	if err != nil {
		h.jsonErr(w, http.StatusBadRequest, "invalid product ID")
		return
	}

	if err := h.repo.Delete(r.Context(), id); err != nil {
		h.logger.Error("delete_product_failed", slog.String("error", err.Error()))
		h.jsonErr(w, http.StatusInternalServerError, "failed to delete product")
		return
	}

	h.jsonOK(w, http.StatusOK, map[string]string{"message": "product deleted"})
}

func (h *ProductHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	stats, err := h.repo.Stats(r.Context())
	if err != nil {
		h.logger.Error("get_stats_failed", slog.String("error", err.Error()))
		h.jsonErr(w, http.StatusInternalServerError, "failed to retrieve stats")
		return
	}
	h.jsonOK(w, http.StatusOK, stats)
}

func (h *ProductHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	h.jsonOK(w, http.StatusOK, map[string]string{
		"status":  "healthy",
		"service": "storehub",
	})
}
