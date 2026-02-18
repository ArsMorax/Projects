<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin Luxura',
            'email' => 'admin@luxura.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        $customer = User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password'),
            'role' => 'customer',
            'email_verified_at' => now(),
        ]);

        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Latest gadgets and electronic devices', 'image' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', 'sort_order' => 1],
            ['name' => 'Fashion', 'slug' => 'fashion', 'description' => 'Trendy clothing and accessories', 'image' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', 'sort_order' => 2],
            ['name' => 'Home & Living', 'slug' => 'home-living', 'description' => 'Furniture and home decoration', 'image' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', 'sort_order' => 3],
            ['name' => 'Sports', 'slug' => 'sports', 'description' => 'Sports equipment and activewear', 'image' => 'https://images.unsplash.com/photo-1461896836934-bd45ba048091?w=400', 'sort_order' => 4],
            ['name' => 'Books', 'slug' => 'books', 'description' => 'Best-selling books and literature', 'image' => 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', 'sort_order' => 5],
            ['name' => 'Beauty', 'slug' => 'beauty', 'description' => 'Skincare, makeup, and beauty products', 'image' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', 'sort_order' => 6],
        ];

        foreach ($categories as $data) {
            Category::create($data);
        }

        $products = [
            [
                'name' => 'MacBook Pro 16" M3 Max',
                'slug' => 'macbook-pro-16-m3-max',
                'description' => 'The most powerful MacBook Pro ever. With the blazing-fast M3 Max chip, up to 128GB of unified memory, and a stunning 16-inch Liquid Retina XDR display.',
                'short_description' => 'Powerful laptop with M3 Max chip and stunning display.',
                'price' => 38999000, 'compare_price' => 42999000, 'sku' => 'MBP-16-M3MAX', 'stock' => 15,
                'category_id' => 1, 'brand' => 'Apple', 'weight' => 2.14, 'is_featured' => true,
                'specifications' => json_encode(['Chip' => 'M3 Max', 'RAM' => '36GB', 'Storage' => '1TB SSD', 'Display' => '16.2" Liquid Retina XDR']),
                'images' => ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600'],
            ],
            [
                'name' => 'Sony WH-1000XM5 Headphones',
                'slug' => 'sony-wh-1000xm5',
                'description' => 'Industry-leading noise cancellation with Auto NC Optimizer. Exceptional sound quality with 30mm driver unit. Up to 30 hours of battery life.',
                'short_description' => 'Premium noise-cancelling wireless headphones.',
                'price' => 4999000, 'compare_price' => 5499000, 'sku' => 'SONY-XM5', 'stock' => 30,
                'category_id' => 1, 'brand' => 'Sony', 'weight' => 0.25, 'is_featured' => true,
                'specifications' => json_encode(['Type' => 'Over-ear', 'ANC' => 'Yes', 'Battery' => '30 hours', 'Bluetooth' => '5.2']),
                'images' => ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600'],
            ],
            [
                'name' => 'iPhone 15 Pro Max 256GB',
                'slug' => 'iphone-15-pro-max',
                'description' => 'Forged in titanium with A17 Pro chip, customizable Action button, and the most powerful iPhone camera system ever.',
                'short_description' => 'Titanium design with A17 Pro chip.',
                'price' => 21999000, 'compare_price' => null, 'sku' => 'IPH-15PM-256', 'stock' => 25,
                'category_id' => 1, 'brand' => 'Apple', 'weight' => 0.22, 'is_featured' => true,
                'specifications' => json_encode(['Chip' => 'A17 Pro', 'Storage' => '256GB', 'Display' => '6.7" Super Retina XDR', 'Camera' => '48MP']),
                'images' => ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600'],
            ],
            [
                'name' => 'Samsung Galaxy Watch Ultra',
                'slug' => 'samsung-galaxy-watch-ultra',
                'description' => 'Built for extreme outdoor adventures with titanium Grade 4 case, sapphire crystal, and 3nm processor.',
                'short_description' => 'Titanium smartwatch built for adventure.',
                'price' => 9499000, 'compare_price' => 10999000, 'sku' => 'SGW-ULTRA', 'stock' => 20,
                'category_id' => 1, 'brand' => 'Samsung', 'weight' => 0.06, 'is_featured' => false,
                'specifications' => json_encode(['Case' => 'Titanium Grade 4', 'Display' => '1.47" AMOLED', 'Battery' => '590mAh']),
                'images' => ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', 'https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600'],
            ],
            [
                'name' => 'Premium Leather Jacket',
                'slug' => 'premium-leather-jacket',
                'description' => 'Handcrafted from genuine Italian lambskin leather with modern slim-fit cut. Features quilted lining and premium YKK zippers.',
                'short_description' => 'Genuine Italian lambskin leather jacket.',
                'price' => 3299000, 'compare_price' => 4500000, 'sku' => 'FAS-LJ-001', 'stock' => 12,
                'category_id' => 2, 'brand' => 'Luxura', 'weight' => 1.5, 'is_featured' => true,
                'specifications' => json_encode(['Material' => 'Italian Lambskin', 'Fit' => 'Slim Fit', 'Sizes' => 'S, M, L, XL']),
                'images' => ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600'],
            ],
            [
                'name' => 'Classic White Sneakers',
                'slug' => 'classic-white-sneakers',
                'description' => 'Minimalist handcrafted white sneakers with full-grain Italian leather upper, memory foam insole, and durable rubber outsole.',
                'short_description' => 'Handcrafted Italian leather sneakers.',
                'price' => 1899000, 'compare_price' => 2299000, 'sku' => 'FAS-WS-001', 'stock' => 40,
                'category_id' => 2, 'brand' => 'Luxura', 'weight' => 0.8, 'is_featured' => true,
                'specifications' => json_encode(['Material' => 'Full-grain Leather', 'Sole' => 'Rubber', 'Sizes' => '38-45']),
                'images' => ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600'],
            ],
            [
                'name' => 'Scandinavian Desk Lamp',
                'slug' => 'scandinavian-desk-lamp',
                'description' => 'Elegant desk lamp with adjustable arm and touch dimmer. Warm LED lighting with 3 color temperatures. Solid oak base and matte black aluminum shade.',
                'short_description' => 'Adjustable LED desk lamp with oak base.',
                'price' => 899000, 'compare_price' => null, 'sku' => 'HOM-DL-001', 'stock' => 50,
                'category_id' => 3, 'brand' => 'Nordic Home', 'weight' => 1.2, 'is_featured' => false,
                'specifications' => json_encode(['Material' => 'Oak & Aluminum', 'Light' => 'LED', 'Height' => '45cm']),
                'images' => ['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600'],
            ],
            [
                'name' => 'Ergonomic Office Chair',
                'slug' => 'ergonomic-office-chair',
                'description' => 'Premium ergonomic chair with breathable mesh back, adjustable lumbar support, 4D armrests, and 150kg weight capacity.',
                'short_description' => 'Premium mesh office chair with lumbar support.',
                'price' => 4599000, 'compare_price' => 5999000, 'sku' => 'HOM-OC-001', 'stock' => 18,
                'category_id' => 3, 'brand' => 'ErgoFlex', 'weight' => 15.0, 'is_featured' => true,
                'specifications' => json_encode(['Material' => 'Mesh & Aluminum', 'Lumbar' => 'Adjustable', 'Armrests' => '4D']),
                'images' => ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600'],
            ],
            [
                'name' => 'Yoga Mat Premium 6mm',
                'slug' => 'yoga-mat-premium-6mm',
                'description' => 'Professional-grade eco-friendly TPE yoga mat. Non-slip surface, alignment lines, and includes carrying strap.',
                'short_description' => 'Eco-friendly non-slip yoga mat.',
                'price' => 459000, 'compare_price' => 599000, 'sku' => 'SPT-YM-001', 'stock' => 60,
                'category_id' => 4, 'brand' => 'FlexFit', 'weight' => 0.9, 'is_featured' => false,
                'specifications' => json_encode(['Material' => 'TPE', 'Thickness' => '6mm', 'Size' => '183 x 61cm']),
                'images' => ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600'],
            ],
            [
                'name' => 'Running Shoes Ultra Boost',
                'slug' => 'running-shoes-ultra-boost',
                'description' => 'Engineered for runners with responsive Boost midsole, Primeknit+ upper, and Continental rubber outsole for ultimate grip.',
                'short_description' => 'High-performance running shoes with Boost.',
                'price' => 2799000, 'compare_price' => 3199000, 'sku' => 'SPT-RS-001', 'stock' => 35,
                'category_id' => 4, 'brand' => 'Adidas', 'weight' => 0.68, 'is_featured' => true,
                'specifications' => json_encode(['Upper' => 'Primeknit+', 'Midsole' => 'Boost', 'Outsole' => 'Continental Rubber']),
                'images' => ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600'],
            ],
            [
                'name' => 'The Art of Programming',
                'slug' => 'the-art-of-programming',
                'description' => 'Comprehensive guide to software engineering best practices covering design patterns, clean code, testing, and architecture.',
                'short_description' => 'Complete guide to software engineering.',
                'price' => 349000, 'compare_price' => null, 'sku' => 'BOK-AP-001', 'stock' => 100,
                'category_id' => 5, 'brand' => 'TechBooks', 'weight' => 0.5, 'is_featured' => false,
                'specifications' => json_encode(['Pages' => '480', 'Format' => 'Hardcover', 'Language' => 'English']),
                'images' => ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'],
            ],
            [
                'name' => 'Vitamin C Brightening Serum',
                'slug' => 'vitamin-c-brightening-serum',
                'description' => 'Advanced brightening serum with 20% Vitamin C, Hyaluronic Acid, and Vitamin E. Fades dark spots and evens skin tone.',
                'short_description' => '20% Vitamin C serum for glowing skin.',
                'price' => 289000, 'compare_price' => 399000, 'sku' => 'BTY-VC-001', 'stock' => 80,
                'category_id' => 6, 'brand' => 'GlowLab', 'weight' => 0.1, 'is_featured' => false,
                'specifications' => json_encode(['Volume' => '30ml', 'Key Ingredients' => 'Vitamin C 20%, Hyaluronic Acid', 'Skin Type' => 'All']),
                'images' => ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'],
            ],
        ];

        foreach ($products as $productData) {
            $images = $productData['images'];
            unset($productData['images']);

            $product = Product::create($productData);

            foreach ($images as $index => $imagePath) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'path' => $imagePath,
                    'alt' => $product->name,
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        }

        $reviewComments = [
            'Absolutely love this product! Exceeded my expectations.',
            'Great quality for the price. Would buy again.',
            'Fast shipping and the product is exactly as described.',
            'Very satisfied with this purchase. Highly recommended!',
            'Good product but packaging could be better.',
        ];

        $allProducts = Product::all();
        foreach ($allProducts as $product) {
            foreach ([$admin->id, $customer->id] as $userId) {
                Review::create([
                    'user_id' => $userId,
                    'product_id' => $product->id,
                    'rating' => rand(3, 5),
                    'comment' => $reviewComments[array_rand($reviewComments)],
                    'is_approved' => true,
                ]);
            }
        }
    }
}
