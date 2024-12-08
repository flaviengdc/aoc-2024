package main

import (
	"aoc/utils/slice"
	_ "embed"
	"fmt"
	"strconv"
	"strings"
)

type Operation struct {
	result int
	items  []int
}

type Operator int

const (
	Add Operator = iota
	Mul Operator = iota
)

//go:embed input.txt
var input string

var operations []Operation

func init() {
	input = strings.TrimRight(input, "\n")
	for _, line := range strings.Split(input, "\n") {
		splited := strings.Split(line, ":")
		result, err := strconv.Atoi(splited[0])
		if err != nil {
			panic(err)
		}
		var items []int
		for _, item := range strings.Split(splited[1], " ") {
			if len(item) == 0 {
				continue
			}

			var parsed_item, err = strconv.Atoi(item)
			if err != nil {
				panic(err)
			}
			items = append(items, parsed_item)
		}
		operations = append(operations, Operation{result, items})
	}
}
func main() {
	part_1()
	part_2()
}

func is_operation_correct(target int, items []int, cur_res int) bool {
	if len(items) == 0 {
		return cur_res == target
	}

	current_number := items[0]
	new_numbers := slice.Remove(items, 0)

	is_add_correct := is_operation_correct(target, new_numbers, cur_res+current_number)
	if cur_res == 0 {
		cur_res = 1
	}
	is_mul_correct := is_operation_correct(target, new_numbers, cur_res*current_number)

	return is_add_correct || is_mul_correct
}

func concat_numbers(x int, y int) int {
	s1 := strconv.FormatInt(int64(x), 10)
	s2 := strconv.FormatInt(int64(y), 10)

	result, err := strconv.Atoi(s1 + s2)
	if err != nil {
		panic(err)
	}
	return result
}

func is_operation_correct_with_concat(target int, items []int, cur_res int) bool {
	if len(items) == 0 {
		return cur_res == target
	}

	current_number := items[0]
	new_numbers := slice.Remove(items, 0)

	is_add_correct := is_operation_correct_with_concat(target, new_numbers, cur_res+current_number)
	is_concat_correct := is_operation_correct_with_concat(target, new_numbers, concat_numbers(cur_res, current_number))
	if cur_res == 0 {
		cur_res = 1
	}
	is_mul_correct := is_operation_correct_with_concat(target, new_numbers, cur_res*current_number)

	return is_add_correct || is_mul_correct || is_concat_correct
}

func get_sum_of_correct() int {
	sum := 0

	for _, operation := range operations {
		if is_operation_correct(operation.result, operation.items, 0) {
			sum += operation.result
		}
	}
	return sum
}

func get_sum_of_correct_with_concat() int {
	sum := 0

	for _, operation := range operations {
		if is_operation_correct_with_concat(operation.result, operation.items, 0) {
			sum += operation.result
		}
	}
	return sum
}

func part_1() {
	fmt.Printf("%v\n", get_sum_of_correct())
}

func part_2() {
	fmt.Printf("%v\n", get_sum_of_correct_with_concat())
}
