<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(Request $request): Response
    {
        $cart = Cart::where('user_id', auth()->id())
            ->with('items.product.primaryImage')
            ->firstOrFail();

        if ($cart->items->isEmpty()) {
            return redirect()->route('cart.index');
        }

        return Inertia::render('Checkout', [
            'cartItems' => $cart->items->map(fn ($item) => [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'subtotal' => $item->subtotal,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'image' => $item->product->primaryImage?->path,
                ],
            ]),
            'subtotal' => $cart->total,
            'user' => auth()->user(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'shipping_name' => 'required|string|max:255',
            'shipping_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string|max:255',
            'shipping_province' => 'required|string|max:255',
            'shipping_postal_code' => 'required|string|max:10',
            'payment_method' => 'required|in:cod,bank_transfer',
            'notes' => 'nullable|string',
        ]);

        $cart = Cart::where('user_id', auth()->id())
            ->with('items.product')
            ->firstOrFail();

        if ($cart->items->isEmpty()) {
            return redirect()->route('cart.index')
                ->withErrors(['cart' => 'Your cart is empty.']);
        }

        foreach ($cart->items as $item) {
            if ($item->quantity > $item->product->stock) {
                return back()->withErrors([
                    'stock' => "Not enough stock for {$item->product->name}.",
                ]);
            }
        }

        $order = DB::transaction(function () use ($validated, $cart) {
            $subtotal = $cart->total;
            $shippingCost = $subtotal >= 500000 ? 0 : 15000;
            $tax = $subtotal * 0.11;
            $total = $subtotal + $shippingCost + $tax;

            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => auth()->id(),
                'status' => 'pending',
                'payment_status' => $validated['payment_method'] === 'cod' ? 'pending' : 'pending',
                'payment_method' => $validated['payment_method'],
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'tax' => $tax,
                'total' => $total,
                'shipping_name' => $validated['shipping_name'],
                'shipping_phone' => $validated['shipping_phone'],
                'shipping_address' => $validated['shipping_address'],
                'shipping_city' => $validated['shipping_city'],
                'shipping_province' => $validated['shipping_province'],
                'shipping_postal_code' => $validated['shipping_postal_code'],
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->subtotal,
                ]);

                $item->product->decrement('stock', $item->quantity);
            }

            $cart->items()->delete();
            $cart->delete();

            return $order;
        });

        return redirect()->route('orders.show', $order)
            ->with('success', 'Order placed successfully!');
    }
}
