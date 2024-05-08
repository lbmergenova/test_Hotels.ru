package main

import (
	"fmt"
	"math"
)

func main() {
	multTable(5)
}

func multTable(n int) {
	// Вычисления для формирования строк в зависимости от разряда n
	gradeN := int(math.Floor(math.Log10(float64(n))) + 1)
	gradeN2 := int(math.Floor(math.Log10(float64(n*n))) + 1)
	formatMult := fmt.Sprintf("%%%dd ", gradeN)
	formatProduct := fmt.Sprintf("%%%dd ", gradeN2)
	fmt.Printf(fmt.Sprintf("%%%ds ", gradeN), "")
	// Вывод заголовка таблицы
	for i := 1; i <= n; i++ {
		fmt.Printf(formatProduct, i)
	}
	fmt.Println()
	// Вывод строк таблицы
	for i := 1; i <= n; i++ {
		fmt.Printf(formatMult, i)
		for j := 1; j <= n; j++ {
			fmt.Printf(formatProduct, i*j)
		}
		fmt.Println()
	}
}
