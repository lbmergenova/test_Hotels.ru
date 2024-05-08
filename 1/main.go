package main

import (
	"fmt"
)

func main() {
	fmt.Println(computerDeclension(25))
	fmt.Println(computerDeclension(41))
	fmt.Println(computerDeclension(42))
	fmt.Println(computerDeclension(1048))
}

func computerDeclension(n int) string {
	last2Digits := n % 100
	lastDigit := n % 10
	var result string
	if last2Digits >= 11 && last2Digits <= 14 {
		result = "компьютеров"
	} else {
		switch lastDigit {
		case 1:
			result = "компьютер"
		case 2, 3, 4:
			result = "компьютера"
		default:
			result = "компьютеров"
		}
	}
	return fmt.Sprintf("%d %s", n, result)
}
