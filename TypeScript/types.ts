type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<string>;
type B = IsString<number>;

type Optional<T> = { [K in keyof T]?: T[K] };
type ReadonlyDeep<T> = { readonly [K in keyof T]: T[K] extends object ? ReadonlyDeep<T[K]> : T[K] };

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiVersion = "v1" | "v2";
type Endpoint = `/${ApiVersion}/${string}`;

function apiCall(method: HttpMethod, endpoint: Endpoint): void {
    console.log(`  ${method} ${endpoint}`);
}

type Result<T, E = Error> =
    | { ok: true; value: T }
    | { ok: false; error: E };

function divide(a: number, b: number): Result<number, string> {
    if (b === 0) return { ok: false, error: "Division by zero" };
    return { ok: true, value: a / b };
}

function unwrap<T>(result: Result<T, string>): T {
    if (!result.ok) throw new Error(result.error);
    return result.value;
}

class QueryBuilder<T extends Record<string, unknown>> {
    private filters: Partial<T> = {};
    private sortKey?: keyof T;
    private sortDir: "asc" | "desc" = "asc";
    private limitVal?: number;

    where<K extends keyof T>(key: K, value: T[K]): this {
        this.filters[key] = value;
        return this;
    }

    orderBy(key: keyof T, dir: "asc" | "desc" = "asc"): this {
        this.sortKey = key;
        this.sortDir = dir;
        return this;
    }

    limit(n: number): this {
        this.limitVal = n;
        return this;
    }

    build(): string {
        const parts: string[] = ["SELECT *"];
        if (Object.keys(this.filters).length) {
            const conditions = Object.entries(this.filters)
                .map(([k, v]) => `${k} = '${v}'`)
                .join(" AND ");
            parts.push(`WHERE ${conditions}`);
        }
        if (this.sortKey) parts.push(`ORDER BY ${String(this.sortKey)} ${this.sortDir.toUpperCase()}`);
        if (this.limitVal) parts.push(`LIMIT ${this.limitVal}`);
        return parts.join(" ");
    }
}

type Brand<T, B extends string> = T & { __brand: B };
type USD = Brand<number, "USD">;
type EUR = Brand<number, "EUR">;

function usd(amount: number): USD { return amount as USD; }
function eur(amount: number): EUR { return amount as EUR; }
function addUsd(a: USD, b: USD): USD { return (a + b) as USD; }

type ColorMap = Record<string, [number, number, number] | string>;

const colors = {
    red: [255, 0, 0],
    green: "#00ff00",
    blue: [0, 0, 255],
} satisfies ColorMap;

console.log("=== Template Literal Types ===");
apiCall("GET", "/v1/users");
apiCall("POST", "/v2/orders");
apiCall("DELETE", "/v1/products/42");

console.log("\n=== Discriminated Unions (Result) ===");
const results = [divide(10, 3), divide(42, 0), divide(100, 4)];
for (const r of results) {
    if (r.ok) {
        console.log(`  ok: ${r.value.toFixed(2)}`);
    } else {
        console.log(`  err: ${r.error}`);
    }
}

console.log("\n=== Generic Query Builder ===");
interface User { id: number; name: string; role: string; age: number }
const query = new QueryBuilder<User>()
    .where("role", "admin")
    .where("age", 25)
    .orderBy("name", "desc")
    .limit(10)
    .build();
console.log(`  ${query}`);

console.log("\n=== Branded Types ===");
const price = addUsd(usd(29.99), usd(15.50));
console.log(`  Total: $${price.toFixed(2)}`);

console.log("\n=== Satisfies (Color Map) ===");
const doubled = colors.red.map((c) => Math.min(255, c * 2));
console.log(`  Red doubled: [${doubled}]`);
console.log(`  Green: ${colors.green.toUpperCase()}`);
