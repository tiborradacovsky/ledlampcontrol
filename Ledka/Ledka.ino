#include <DigiUSB.h>

#define BIT_0 "sbi %[port], 1\nnop\nnop\nnop\nnop\nnop\n cbi %[port], 1\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\n"
#define BIT_1 "sbi %[port], 1\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\nnop\n cbi %[port], 1\nnop\nnop\nnop\nnop\nnop\nnop\n"

register uint8_t RED asm("r10");
register uint8_t GREEN asm("r11");
register uint8_t BLUE asm("r12");

void updatePixels() {
  asm volatile(
      "in r26, __SREG__\n cli\n"

      "ldi r27, 8\n"
      "1: rol %0\n"
      "brcs 2f\n"
      BIT_0 "rjmp 3f\n"
      "2:" BIT_1 "3:"
      "dec r27\n"
      "brne 1b\n"

      "ldi r27, 8\n"
      "4: rol %1\n"
      "brcs 5f\n"
      BIT_0 "rjmp 6f\n"
      "5:" BIT_1 "6:"
      "dec r27\n"
      "brne 4b\n"

      "ldi r27, 8\n"
      "7: rol %2\n"
      "brcs 8f\n"
      BIT_0 "rjmp 9f\n"
      "8:" BIT_1 "9:"
      "dec r27\n"
      "brne 7b\n"

      "out __SREG__, r26\n"

      : "r=" (GREEN), "r=" (RED), "r=" (BLUE)
      : [port] "I" (_SFR_IO_ADDR(PORTB))
    );
}

void setup() {
  DigiUSB.begin();
  pinMode(1,OUTPUT);
  digitalWrite(1, LOW);
  RED = GREEN = BLUE = 0;
}

uint8_t get_byte() {
  uint8_t ans = 0, count = 0;
  while (count < 2) {
    if (DigiUSB.available()) {
      char c = DigiUSB.read();
      if (c >= '0' && c <= '9') {
        ans = 16*ans + (c - '0');
        count++;
      }
      else if (c >= 'a' && c <= 'f') {
        ans = 16*ans + (c - 'a' + 10);
        count++;
      }
    }
    DigiUSB.delay(10);
  }
  return ans;
}

void loop() {
  RED = get_byte();
  GREEN = get_byte();
  BLUE = get_byte();
  updatePixels();
}

