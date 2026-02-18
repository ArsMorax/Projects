package main

import (
"fmt"
"math"
"sort"
"strings"
"sync"
"time"
)

func Map[T any, R any](slice []T, fn func(T) R) []R {
result := make([]R, len(slice))
for i, v := range slice {
result[i] = fn(v)
}
return result
}

func Filter[T any](slice []T, fn func(T) bool) []T {
var result []T
for _, v := range slice {
if fn(v) {
result = append(result, v)
}
}
return result
}

func Reduce[T any, R any](slice []T, initial R, fn func(R, T) R) R {
acc := initial
for _, v := range slice {
acc = fn(acc, v)
}
return acc
}

type Shape interface {
Area() float64
Perimeter() float64
}

type Circle struct{ Radius float64 }
type Rectangle struct{ Width, Height float64 }

func (c Circle) Area() float64      { return math.Pi * c.Radius * c.Radius }
func (c Circle) Perimeter() float64 { return 2 * math.Pi * c.Radius }
func (c Circle) String() string     { return fmt.Sprintf("Circle(r=%.1f)", c.Radius) }

func (r Rectangle) Area() float64      { return r.Width * r.Height }
func (r Rectangle) Perimeter() float64 { return 2 * (r.Width + r.Height) }
func (r Rectangle) String() string {
return fmt.Sprintf("Rect(%.1fx%.1f)", r.Width, r.Height)
}

func describeShape(s Shape) {
fmt.Printf("  %-20s area=%.2f  perimeter=%.2f\n", s, s.Area(), s.Perimeter())
}

func concurrentSquares(nums []int) map[int]int {
results := make(map[int]int)
ch := make(chan [2]int, len(nums))
var wg sync.WaitGroup

for _, n := range nums {
wg.Add(1)
go func(x int) {
defer wg.Done()
time.Sleep(50 * time.Millisecond)
ch <- [2]int{x, x * x}
}(n)
}

go func() {
wg.Wait()
close(ch)
}()

for pair := range ch {
results[pair[0]] = pair[1]
}
return results
}

func makeCounter(start int) func() int {
count := start
return func() int {
count++
return count
}
}

func main() {
fmt.Println("=== Generics (Map/Filter/Reduce) ===")
nums := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
doubled := Map(nums, func(n int) int { return n * 2 })
evens := Filter(nums, func(n int) bool { return n%2 == 0 })
sum := Reduce(nums, 0, func(acc, n int) int { return acc + n })
fmt.Printf("  Doubled: %v\n", doubled)
fmt.Printf("  Evens:   %v\n", evens)
fmt.Printf("  Sum:     %d\n", sum)

words := []string{"hello", "world", "go", "generics"}
upper := Map(words, strings.ToUpper)
long := Filter(words, func(s string) bool { return len(s) > 3 })
fmt.Printf("  Upper:   %v\n", upper)
fmt.Printf("  Long:    %v\n", long)

fmt.Println("\n=== Interfaces ===")
shapes := []Shape{Circle{5}, Rectangle{4, 6}, Circle{3}, Rectangle{10, 2}}
for _, s := range shapes {
describeShape(s)
}

sort.Slice(shapes, func(i, j int) bool {
return shapes[i].Area() > shapes[j].Area()
})
fmt.Println("  Sorted by area (desc):")
for _, s := range shapes {
fmt.Printf("    %s = %.2f\n", s, s.Area())
}

fmt.Println("\n=== Goroutines + Channels ===")
start := time.Now()
squares := concurrentSquares([]int{2, 4, 6, 8, 10})
fmt.Printf("  Squares: %v (took %v)\n", squares, time.Since(start).Round(time.Millisecond))

fmt.Println("\n=== Closures ===")
counter := makeCounter(0)
for i := 0; i < 5; i++ {
fmt.Printf("  counter() = %d\n", counter())
}
}
