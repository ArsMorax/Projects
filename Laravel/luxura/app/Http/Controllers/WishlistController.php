<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function index(): Response
    {
        $wishlists = Wishlist::where('user_id', auth()->id())
            ->with('product.primaryImage', 'product.category')
            ->latest()
            ->get();

        return Inertia::render('Wishlist', [
            'wishlists' => $wishlists,
        ]);
    }

    public function toggle(Request $request): RedirectResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $existing = Wishlist::where('user_id', auth()->id())
            ->where('product_id', $request->input('product_id'))
            ->first();

        if ($existing) {
            $existing->delete();

            return back()->with('success', 'Product removed from wishlist.');
        }

        Wishlist::create([
            'user_id' => auth()->id(),
            'product_id' => $request->input('product_id'),
        ]);

        return back()->with('success', 'Product added to wishlist.');
    }
}
