<?php

declare(strict_types=1);

enum Status: string
{
    case Pending = 'pending';
    case Active = 'active';
    case Suspended = 'suspended';
    case Banned = 'banned';

    public function label(): string
    {
        return match ($this) {
            self::Pending   => 'Pending Review',
            self::Active    => 'Active',
            self::Suspended => 'Suspended',
            self::Banned    => 'Banned',
        };
    }

    public function canLogin(): bool
    {
        return match ($this) {
            self::Active => true,
            default      => false,
        };
    }
}

readonly class Money
{
    public function __construct(
        public float  $amount,
        public string $currency = 'IDR',
    ) {}

    public function add(Money $other): self
    {
        if ($this->currency !== $other->currency) {
            throw new InvalidArgumentException("Currency mismatch: {$this->currency} vs {$other->currency}");
        }
        return new self($this->amount + $other->amount, $this->currency);
    }

    public function format(): string
    {
        return $this->currency . ' ' . number_format($this->amount, 0, ',', '.');
    }

    public function __toString(): string
    {
        return $this->format();
    }
}

function createTask(string $name, int $steps): Fiber
{
    return new Fiber(function () use ($name, $steps): string {
        for ($i = 1; $i <= $steps; $i++) {
            echo "  [$name] Step $i/$steps\n";
            Fiber::suspend("$name:step-$i");
        }
        return "$name completed!";
    });
}

function pipeline(mixed $value, callable ...$fns): mixed
{
    return array_reduce($fns, fn($carry, $fn) => $fn($carry), $value);
}

function createUser(
    string $name,
    string $email,
    Status $status = Status::Pending,
    ?Money $balance = null,
): array {
    return [
        'name'    => $name,
        'email'   => $email,
        'status'  => $status->label(),
        'login'   => $status->canLogin() ? 'yes' : 'no',
        'balance' => $balance?->format() ?? 'N/A',
    ];
}


echo "=== Enums ===\n";
foreach (Status::cases() as $status) {
    printf("  %-12s -> %-20s canLogin: %s\n", $status->value, $status->label(), $status->canLogin() ? 'yes' : 'no');
}

echo "\n=== Readonly Class (Money) ===\n";
$price = new Money(1_500_000);
$tax   = new Money(165_000);
$total = $price->add($tax);
echo "  Price: $price\n";
echo "  Tax:   $tax\n";
echo "  Total: $total\n";

echo "\n=== Fibers (Cooperative Multitasking) ===\n";
$taskA = createTask('Download', 3);
$taskB = createTask('Process', 2);

$taskA->start();
$taskB->start();
while (!$taskA->isTerminated() || !$taskB->isTerminated()) {
    if (!$taskA->isTerminated()) $taskA->resume();
    if (!$taskB->isTerminated()) $taskB->resume();
}
echo "  Results: {$taskA->getReturn()}, {$taskB->getReturn()}\n";

echo "\n=== Pipeline with First-Class Callables ===\n";
$result = pipeline(
    '  hello world  ',
    trim(...),
    strtoupper(...),
    fn(string $s) => str_replace(' ', '-', $s),
    fn(string $s) => "<<< $s >>>",
);
echo "  Result: $result\n";

echo "\n=== Named Arguments ===\n";
$user = createUser(
    name: 'Zivi',
    email: 'zivi@example.com',
    status: Status::Active,
    balance: new Money(2_500_000),
);
print_r($user);
