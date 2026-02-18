<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(Request $request): Response
    {
        $cart = $this->getCart($request);
        $cart->load('items.product.primaryImage');

        return Inertia::render('Cart', [
            'cart' => $cart,
            'cartItems' => $cart->items->map(fn (CartItem $item) => [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'subtotal' => $item->subtotal,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'slug' => $item->product->slug,
                    'price' => $item->product->price,
                    'stock' => $item->product->stock,
                    'image' => $item->product->primaryImage?->path,
                ],
            ]),
            'total' => $cart->total,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->input('product_id'));

        if ($product->stock < $request->input('quantity')) {
            return back()->withErrors(['quantity' => 'Not enough stock available.']);
        }

        $cart = $this->getCart($request);

        $cartItem = $cart->items()->where('product_id', $product->id)->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $request->input('quantity');
            if ($newQuantity > $product->stock) {
                return back()->withErrors(['quantity' => 'Not enough stock available.']);
            }
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $request->input('quantity'),
                'price' => $product->price,
            ]);
        }

        return back()->with('success', 'Product added to cart.');
    }

    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        if ($request->input('quantity') > $cartItem->product->stock) {
            return back()->withErrors(['quantity' => 'Not enough stock available.']);
        }

        $cartItem->update(['quantity' => $request->input('quantity')]);

        return back()->with('success', 'Cart updated.');
    }

    public function destroy(CartItem $cartItem): RedirectResponse
    {
        $cartItem->delete();

        return back()->with('success', 'Item removed from cart.');
    }

    private function getCart(Request $request): Cart
    {
        $userId = auth()->id();
        $sessionId = $request->session()->getId();

        return Cart::getOrCreate($userId, $sessionId);
    }
}
