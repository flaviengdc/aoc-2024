package main

import (
	_ "embed"
	"fmt"
	"regexp"
	"strconv"
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

func get_all_muls(line string) [][]string {
	var pattern = regexp.MustCompile(`mul\((\d+),(\d+)\)`)

	return pattern.FindAllStringSubmatch(line, -1)
}

func get_all_muls_with_do(line string) [][]string {
	var pattern = regexp.MustCompile(`do\(\).*^(?!don't\(\)).*mul\((\d+),(\d+)\)`)

	return pattern.FindAllStringSubmatch(line, -1)
}

func parse_pattern_match(matches [][]string) [][]int {
	res := make([][]int, 0)
	for i, match := range matches {
		res = append(res, make([]int, 0))
		for _, value := range match[1:] {
			var parsed_value, err = strconv.Atoi(value)
			if err != nil {
				panic(err)
			}
			res[i] = append(res[i], parsed_value)
		}
	}

	return res
}

func mul_match_and_add(matches [][]int) int {
	res := 0

	for _, values := range matches {
		current_value := 1
		for _, value := range values {
			current_value = current_value * value
		}

		res = res + current_value
	}

	return res
}

func part_1() {
	var results = mul_match_and_add(parse_pattern_match(get_all_muls(input)))
	fmt.Printf("%v\n", results)
}

func part_2() {
	res := get_all_muls_with_do(input)
	fmt.Printf("%v\n", res)
}
