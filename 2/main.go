package main

import (
	"fmt"
	"math"
	"sort"
)

func main() {
	arr := []int{42, 12, 18}
	result := commonDivisors(arr)
	fmt.Println(result)
}

func commonDivisors(arr []int) []int {
	// Находим делители минимального значения массива
	divs := divisors(minInts(arr))
	// Создаем карту из элементов, которые нужно исключить
	m := make(map[int]struct{}, 0)
	for _, v := range arr {
		for _, d := range divs {
			if v%d != 0 {
				m[d] = struct{}{}
			}
		}
	}
	// Создаем слайс, который будет содержать элементы без исключений
	result := make([]int, 0)
	for _, d := range divs {
		if _, ok := m[d]; !ok {
			result = append(result, d)
		}
	}
	return result
}

func divisors(n int) []int {
	var divs []int
	for i := 2; i <= int(math.Sqrt(float64(n))); i++ {
		if n%i == 0 {
			divs = append(divs, i)
			if i != n/i {
				divs = append(divs, n/i)
			}
		}
	}
	divs = append(divs, n)
	sort.Ints(divs)
	return divs
}

func minInts(arr []int) int {
	min := arr[0]
	for _, v := range arr {
		if v < min {
			min = v
		}
	}
	return min
}
