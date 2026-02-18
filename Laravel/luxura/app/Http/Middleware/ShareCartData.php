<?php

namespace App\Http\Middleware;

use App\Models\Cart;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ShareCartData
{
    public function handle(Request $request, Closure $next): Response
    {
        $cartCount = 0;

        if (auth()->check()) {
            $cart = Cart::where('user_id', auth()->id())->with('items')->first();
        } else {
            $cart = Cart::where('session_id', session()->getId())->with('items')->first();
        }

        if ($cart) {
            $cartCount = $cart->items->sum('quantity');
        }

        Inertia::share('cartCount', $cartCount);

        return $next($request);
    }
}
