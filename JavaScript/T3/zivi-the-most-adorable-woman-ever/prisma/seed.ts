import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Seeding database...");

	await prisma.orderItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.cartItem.deleteMany();
	await prisma.product.deleteMany();
	await prisma.category.deleteMany();

	const categories = await Promise.all([
		prisma.category.create({
			data: {
				name: "Clothing",
				slug: "clothing",
				description:
					"Premium apparel for every occasion. From casual everyday wear to sophisticated evening attire.",
				image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600",
			},
		}),
		prisma.category.create({
			data: {
				name: "Electronics",
				slug: "electronics",
				description:
					"Cutting-edge technology and gadgets. Stay connected with the latest devices.",
				image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600",
			},
		}),
		prisma.category.create({
			data: {
				name: "Accessories",
				slug: "accessories",
				description:
					"Complete your look with our curated collection of accessories and jewelry.",
				image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600",
			},
		}),
		prisma.category.create({
			data: {
				name: "Home & Living",
				slug: "home-living",
				description:
					"Transform your space with modern home decor and lifestyle essentials.",
				image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
			},
		}),
	]);

	const [clothing, electronics, accessories, homeLiving] = categories;

	const products = [
		{
			name: "Classic Cotton T-Shirt",
			slug: "classic-cotton-tshirt",
			description:
				"A timeless essential crafted from 100% organic cotton. This relaxed-fit tee features a reinforced crew neck, double-stitched hems, and a buttery-soft hand feel. Perfect for layering or wearing on its own.",
			price: 29.99,
			compareAt: 39.99,
			image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
				"https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600",
			]),
			categoryId: clothing!.id,
			stock: 150,
			featured: true,
			rating: 4.8,
			reviewCount: 234,
		},
		{
			name: "Slim Fit Denim Jeans",
			slug: "slim-fit-denim-jeans",
			description:
				"Modern slim-fit jeans made from premium stretch denim. Features a comfortable mid-rise waist, tapered leg, and classic five-pocket design. Washed for a lived-in look from day one.",
			price: 79.99,
			compareAt: null,
			image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
				"https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600",
			]),
			categoryId: clothing!.id,
			stock: 80,
			featured: false,
			rating: 4.6,
			reviewCount: 189,
		},
		{
			name: "Wool Blend Overcoat",
			slug: "wool-blend-overcoat",
			description:
				"Elevate your winter wardrobe with this luxurious wool blend overcoat. Tailored with a notch lapel, single-breasted button closure, and a classic knee-length silhouette.",
			price: 199.99,
			compareAt: 249.99,
			image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600",
				"https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=600",
			]),
			categoryId: clothing!.id,
			stock: 30,
			featured: true,
			rating: 4.9,
			reviewCount: 67,
		},
		{
			name: "Linen Summer Shirt",
			slug: "linen-summer-shirt",
			description:
				"Stay cool in style with this breathable linen shirt. Features a relaxed fit, mother-of-pearl buttons, and a versatile design that transitions from beach to bar.",
			price: 49.99,
			compareAt: null,
			image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600",
			]),
			categoryId: clothing!.id,
			stock: 95,
			featured: false,
			rating: 4.5,
			reviewCount: 112,
		},

		{
			name: "Wireless Noise-Cancelling Headphones",
			slug: "wireless-noise-cancelling-headphones",
			description:
				"Immerse yourself in pure sound with these premium wireless headphones. Features active noise cancellation, 30-hour battery life, Hi-Res Audio support, and ultra-comfortable memory foam ear cushions.",
			price: 249.99,
			compareAt: 299.99,
			image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
				"https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
			]),
			categoryId: electronics!.id,
			stock: 45,
			featured: true,
			rating: 4.7,
			reviewCount: 521,
		},
		{
			name: "Smart Watch Pro",
			slug: "smart-watch-pro",
			description:
				"Your ultimate fitness and lifestyle companion. Tracks heart rate, sleep, SpO2, and 100+ workout modes. Features an always-on AMOLED display, GPS, and 7-day battery life.",
			price: 349.99,
			compareAt: 399.99,
			image: "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600",
				"https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600",
			]),
			categoryId: electronics!.id,
			stock: 25,
			featured: true,
			rating: 4.8,
			reviewCount: 302,
		},
		{
			name: "Portable Bluetooth Speaker",
			slug: "portable-bluetooth-speaker",
			description:
				"Take the party anywhere with this waterproof Bluetooth speaker. Delivers 360° sound with deep bass, 20-hour playtime, and rugged IPX7 water resistance.",
			price: 89.99,
			compareAt: null,
			image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
			]),
			categoryId: electronics!.id,
			stock: 120,
			featured: false,
			rating: 4.4,
			reviewCount: 198,
		},
		{
			name: "4K Webcam Ultra",
			slug: "4k-webcam-ultra",
			description:
				"Look your best on every call with this 4K Ultra HD webcam. Features auto-framing, AI-powered low-light correction, noise-reducing dual microphones, and a built-in privacy shutter.",
			price: 129.99,
			compareAt: 159.99,
			image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600",
			]),
			categoryId: electronics!.id,
			stock: 60,
			featured: false,
			rating: 4.3,
			reviewCount: 87,
		},

		{
			name: "Minimalist Leather Wallet",
			slug: "minimalist-leather-wallet",
			description:
				"Crafted from full-grain Italian leather, this slim bifold wallet holds up to 8 cards and features RFID-blocking technology. Ages beautifully with a rich patina over time.",
			price: 59.99,
			compareAt: null,
			image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
			]),
			categoryId: accessories!.id,
			stock: 200,
			featured: false,
			rating: 4.6,
			reviewCount: 345,
		},
		{
			name: "Canvas Backpack",
			slug: "canvas-backpack",
			description:
				"A rugged yet refined everyday backpack made from waxed canvas and vegetable-tanned leather accents. Features a padded 15-inch laptop compartment and multiple organizer pockets.",
			price: 119.99,
			compareAt: 149.99,
			image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
				"https://images.unsplash.com/photo-1581605405669-fcdf81165571?w=600",
			]),
			categoryId: accessories!.id,
			stock: 55,
			featured: true,
			rating: 4.7,
			reviewCount: 156,
		},
		{
			name: "Aviator Sunglasses",
			slug: "aviator-sunglasses",
			description:
				"Classic aviator sunglasses with polarized lenses and a lightweight titanium frame. Provides 100% UV protection while looking effortlessly cool.",
			price: 89.99,
			compareAt: null,
			image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
			]),
			categoryId: accessories!.id,
			stock: 75,
			featured: false,
			rating: 4.5,
			reviewCount: 203,
		},

		{
			name: "Scandinavian Desk Lamp",
			slug: "scandinavian-desk-lamp",
			description:
				"Illuminate your workspace with this minimalist desk lamp inspired by Scandinavian design. Features adjustable brightness, warm/cool color temperature, and a solid oak wood base.",
			price: 69.99,
			compareAt: 89.99,
			image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600",
			]),
			categoryId: homeLiving!.id,
			stock: 40,
			featured: true,
			rating: 4.8,
			reviewCount: 94,
		},
		{
			name: "Ceramic Pour-Over Set",
			slug: "ceramic-pour-over-set",
			description:
				"Elevate your morning ritual with this handcrafted ceramic pour-over coffee set. Includes a dripper, carafe, and two mugs in a matte glaze finish.",
			price: 54.99,
			compareAt: null,
			image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600",
			]),
			categoryId: homeLiving!.id,
			stock: 35,
			featured: false,
			rating: 4.9,
			reviewCount: 78,
		},
		{
			name: "Woven Throw Blanket",
			slug: "woven-throw-blanket",
			description:
				"Cozy up with this luxuriously soft woven throw. Made from a blend of recycled cotton and merino wool in a herringbone pattern. Perfect for the couch or bedroom.",
			price: 79.99,
			compareAt: 99.99,
			image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600",
			]),
			categoryId: homeLiving!.id,
			stock: 50,
			featured: false,
			rating: 4.7,
			reviewCount: 132,
		},
		{
			name: "Aromatic Soy Candle Set",
			slug: "aromatic-soy-candle-set",
			description:
				"Set of three hand-poured soy candles in artisan glass vessels. Scents include Cedar & Sage, Jasmine & Vanilla, and Sea Salt & Driftwood. 50-hour burn time each.",
			price: 44.99,
			compareAt: null,
			image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600",
			images: JSON.stringify([
				"https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600",
			]),
			categoryId: homeLiving!.id,
			stock: 90,
			featured: true,
			rating: 4.6,
			reviewCount: 267,
		},
	];

	for (const product of products) {
		await prisma.product.create({ data: product });
	}

	console.log(`✅ Created ${categories.length} categories`);
	console.log(`✅ Created ${products.length} products`);
	console.log("🎉 Seeding complete!");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
