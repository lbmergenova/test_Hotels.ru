package main

import (
	"fmt"
	"math"
)

func main() {
	primes := primeNumbers(11, 20)
	fmt.Println(primes)
}

func primeNumbers(min, max int) []int {
	var primes []int
	for i := min; i <= max; i++ {
		if isPrime(i) {
			primes = append(primes, i)
		}
	}
	return primes
}

func isPrime(n int) bool {
	if n < 2 {
		return false
	}
	if n == 2 {
		return true
	}
	if n%2 == 0 {
		return false
	}
	for i := 3; i <= int(math.Sqrt(float64(n))); i += 2 {
		if n%i == 0 {
			return false
		}
	}
	return true
}
