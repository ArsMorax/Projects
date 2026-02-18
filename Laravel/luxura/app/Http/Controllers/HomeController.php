<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $featuredProducts = Product::query()
            ->active()
            ->featured()
            ->with(['category', 'primaryImage'])
            ->take(8)
            ->get();

        $categories = Category::query()
            ->active()
            ->roots()
            ->withCount(['products' => fn ($q) => $q->active()])
            ->orderBy('sort_order')
            ->get();

        $newArrivals = Product::query()
            ->active()
            ->inStock()
            ->with(['category', 'primaryImage'])
            ->latest()
            ->take(8)
            ->get();

        $bestSellers = Product::query()
            ->active()
            ->inStock()
            ->with(['category', 'primaryImage'])
            ->orderByDesc('reviews_count')
            ->take(4)
            ->get();

        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'newArrivals' => $newArrivals,
            'bestSellers' => $bestSellers,
        ]);
    }
}
