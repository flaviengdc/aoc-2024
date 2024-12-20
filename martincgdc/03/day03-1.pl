#!/usr/bin/perl -w

use strict;
use warnings;
use v5.38;

my $result = 0;

while (my $line = <>) {
  while ($line =~ /mul\((\d+),(\d+)\)/g) {
    $result += $1 * $2;
  }
}

say $result;
