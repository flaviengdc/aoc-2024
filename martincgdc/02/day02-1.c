#include <stdio.h>

int main(void) {
  int res = 0;
  char c;

  for (;;) {
    int a = -1;
    int b = 0;
    int sign = 0;

    for (;;) {
      c = getchar();
      if (0x30 <= c && c < 0x40) {
        b = (b * 10) + (c - 0x30);
        continue;
      }

      if (c == 0x4 || c == -1)
        break;

      if (a == -1) {
        a = b;
        b = 0;
        continue;
      }

      if (sign == 0) {
        sign = b - a > 0 ? 1 : -1;
      }

      int diff = (b - a) * sign;

      if (1 > diff || diff > 3) {
        while (c != 0x0a) {
          c = getchar();
        }
        break;
      }

      if (c == 0x20) {
        a = b;
        b = 0;
        continue;
      }

      if (c == 0x0a) {
        res++;
        break;
      }

      __builtin_unreachable();
    }

    if (c == 0x4 || c == -1)
      break;
  }

  printf("%d\n", res);
  return 0;
}
