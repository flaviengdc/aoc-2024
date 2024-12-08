package main

import (
	"aoc/mathy"
	"aoc/utils/slice"
	_ "embed"
	"fmt"
	"strconv"
	"strings"
)

type Direction int

// Declare related constants for each weekday starting with index 1
const (
	Unknown Direction = iota + 1
	Increase
	Decrease
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

func get_reports() [][]int {
	var reports [][]int
	var raw_reports = strings.Split(input, "\n")

	for _, raw_report := range raw_reports {
		var report []int

		for _, raw_value := range strings.Split(raw_report, " ") {
			var value, err = strconv.Atoi(raw_value)
			if err != nil {
				panic(err)
			}

			report = append(report, value)
		}

		reports = append(reports, report)

	}

	return reports
}

func is_report_valid(report []int) bool {
	var direction Direction
	var is_valid = true

	for i, value := range report {
		if i == 0 {
			continue
		}

		var last_value = report[i-1]

		if value == last_value || mathy.Abs(value-last_value) > 3 {
			is_valid = false
			break
		}

		if i == 1 {
			if value > last_value {
				direction = Increase
			} else {
				direction = Decrease
			}
		}

		if direction == Increase && value < last_value {
			is_valid = false
		}

		if direction == Decrease && value > last_value {
			is_valid = false
		}
	}

	return is_valid
}

func get_safe_reports_1(reports [][]int) [][]int {
	var safe_reports [][]int

	for _, report := range reports {
		var is_valid = is_report_valid(report)
		if is_valid {
			safe_reports = append(safe_reports, report)
		}
	}

	return safe_reports
}

func get_safe_reports_2(reports [][]int) [][]int {
	var safe_reports [][]int

	for _, report := range reports {
		if is_report_valid(report) {
			safe_reports = append(safe_reports, report)
			continue
		}

		for i := range report {
			var corrected_report = slice.Remove(report, i)

			if is_report_valid(corrected_report) {
				safe_reports = append(safe_reports, corrected_report)
				break
			}
		}
	}

	return safe_reports
}

func part_1() {
	var reports = get_reports()
	var safe_reports = get_safe_reports_1(reports)

	fmt.Printf("Part 1: %d\n", len(safe_reports))
}

func part_2() {
	var reports = get_reports()
	var safe_reports = get_safe_reports_2(reports)

	fmt.Printf("Part 2: %d\n", len(safe_reports))
}
