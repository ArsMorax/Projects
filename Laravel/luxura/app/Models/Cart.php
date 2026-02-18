<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function getTotalAttribute(): float
    {
        return $this->items->sum(fn (CartItem $item) => $item->price * $item->quantity);
    }

    public function getItemsCountAttribute(): int
    {
        return $this->items->sum('quantity');
    }

    public static function getOrCreate(?int $userId = null, ?string $sessionId = null): self
    {
        if ($userId) {
            $cart = self::where('user_id', $userId)->first();
            if ($cart) {
                return $cart;
            }
        }

        if ($sessionId) {
            $cart = self::where('session_id', $sessionId)->first();
            if ($cart && $userId) {
                $cart->update(['user_id' => $userId, 'session_id' => null]);
                return $cart;
            }
            if ($cart) {
                return $cart;
            }
        }

        return self::create([
            'user_id' => $userId,
            'session_id' => $userId ? null : $sessionId,
        ]);
    }
}
