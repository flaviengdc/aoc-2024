package main

import (
	"aoc/mathy"
	_ "embed"
	"log"
	"math"
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

func get_lists() ([]int, []int) {
	var list1 []int
	var list2 []int

	for _, line := range strings.Split(input, "\n") {
		var values = strings.Fields(line)
		var value1, err1 = strconv.Atoi(values[0])
		if err1 != nil {
			panic(err1)
		}
		var value2, err2 = strconv.Atoi(values[1])
		if err2 != nil {
			panic(err2)
		}

		list1 = append(list1, value1)
		list2 = append(list2, value2)
	}

	return list1, list2
}

func find_lowest_index(array []int) (int, int) {
	var lowest int = math.MaxInt32
	var lowest_index int = math.MaxInt32

	for i, value := range array {
		if value < lowest {
			lowest = value
			lowest_index = i
		}
	}
	return lowest_index, lowest
}

func part_1() {
	var list1, list2 = get_lists()
	var distance int

	for len(list1) > 0 && len(list2) > 0 {
		var lowest_index1, value1 = find_lowest_index(list1)
		var lowest_index2, value2 = find_lowest_index(list2)
		distance = distance + mathy.Abs(value1-value2)
		list1 = append(list1[:lowest_index1], list1[lowest_index1+1:]...)
		list2 = append(list2[:lowest_index2], list2[lowest_index2+1:]...)
	}

	log.Printf("Part 1: %d", distance)
}

func count_occurences(target int, list []int) int {
	var count int

	for _, value := range list {
		if value == target {
			count = count + 1
		}
	}

	return count
}

func part_2() {
	var list1, list2 = get_lists()
	var distance int

	for _, target := range list1 {
		var occurences = count_occurences(target, list2)

		distance = distance + target*occurences
	}

	log.Printf("Part 2: %d", distance)
}
