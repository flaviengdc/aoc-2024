package main

import (
	_ "embed"
	"strings"
)

//go:embed input.txt
var input string

func init() {
	input = strings.TrimRight(input, "\n")
}
func main() {
	part_1()
	part_2()
}

func part_1() {
}

func part_2() {
}
