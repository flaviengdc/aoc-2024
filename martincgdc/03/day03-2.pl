#!/usr/bin/perl -w

use strict;
use warnings;
use v5.38;

my $result = 0;
my $enabled = 1;

while (my $line = <>) {
  while ($line =~ /(do\(\))|(don't\(\))|mul\((\d+),(\d+)\)/g) {
    if ($1) {
      $enabled = 1;
    } elsif ($2) {
      $enabled = 0;
    } elsif ($enabled != 0) {
      $result += $3 * $4;
    }
  }
}

say $result;
