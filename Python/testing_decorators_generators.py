from dataclasses import dataclass, field
from functools import wraps
from contextlib import contextmanager
import time


def retry(max_attempts: int = 3, delay: float = 0.5):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    print(f"  Attempt {attempt}/{max_attempts} failed: {e}")
                    if attempt == max_attempts:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator


def running_average():
    total = 0
    count = 0
    average = None
    while True:
        value = yield average
        total += value
        count += 1
        average = total / count


@contextmanager
def timer(label: str):
    start = time.perf_counter()
    print(f"[{label}] Starting...")
    try:
        yield
    finally:
        elapsed = (time.perf_counter() - start) * 1000
        print(f"[{label}] Done in {elapsed:.2f}ms")


@dataclass
class Inventory:
    items: dict[str, float] = field(default_factory=dict)
    tax_rate: float = 0.11

    def __post_init__(self):
        print(f"Inventory created with {len(self.items)} items (tax: {self.tax_rate:.0%})")

    @property
    def subtotal(self) -> float:
        return sum(self.items.values())

    @property
    def total(self) -> float:
        return self.subtotal * (1 + self.tax_rate)

    def __contains__(self, item: str) -> bool:
        return item in self.items

    def __repr__(self) -> str:
        return f"Inventory({len(self.items)} items, total={self.total:,.0f})"


def classify_scores(scores: list[int]) -> None:
    for score in scores:
        match grade := ("A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "F"):
            case "A": print(f"  {score} -> {grade} (Excellent)")
            case "B": print(f"  {score} -> {grade} (Good)")
            case "C": print(f"  {score} -> {grade} (Average)")
            case _:   print(f"  {score} -> {grade} (Needs Improvement)")


if __name__ == "__main__":
    print("=== Running Average Generator ===")
    avg = running_average()
    next(avg)
    for n in [10, 20, 30, 25, 15]:
        result = avg.send(n)
        print(f"  Sent {n}, average = {result:.1f}")

    print("\n=== Inventory with Timer ===")
    with timer("inventory"):
        shop = Inventory({"Laptop": 15_000_000, "Mouse": 250_000, "Keyboard": 750_000})
        print(f"  Subtotal: {shop.subtotal:,.0f}")
        print(f"  Total (with tax): {shop.total:,.0f}")
        print(f"  'Mouse' in shop? {'Mouse' in shop}")

    print("\n=== Score Classification ===")
    classify_scores([95, 82, 74, 61, 90])

    print("\n=== Retry Decorator ===")
    attempt_count = 0

    @retry(max_attempts=3, delay=0.1)
    def flaky_function():
        global attempt_count
        attempt_count += 1
        if attempt_count < 3:
            raise ConnectionError("Server unreachable")
        return "Success!"

    print(f"  Result: {flaky_function()}")
