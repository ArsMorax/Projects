<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Order::where('user_id', auth()->id())
            ->with('items.product.primaryImage')
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        $order->load('items.product.primaryImage');

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
