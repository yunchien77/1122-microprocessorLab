import Jetson.GPIO as GPIO
import time

SPICLK = 11 #23
SPIMISO = 9 #21
SPIMOSI = 10 #19
SPICS = 8 #24
output_pin = 17 #11 
output_pin2 = 27 #13 

photo_ch = 0 #27

def init():
    GPIO.setwarnings(False)

    GPIO.cleanup()
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(output_pin, GPIO.OUT)
    GPIO.setup(output_pin2, GPIO.OUT)
    GPIO.setup(SPIMOSI, GPIO.OUT)
    GPIO.setup(SPIMISO, GPIO.IN)
    GPIO.setup(SPICLK, GPIO.OUT)
    GPIO.setup(SPICS, GPIO.OUT)

def readadc(adcnum, clockpin, mosipin, misopin, cspin, output1, output2):
    if((adcnum > 7) or (adcnum < 0)):
        return -1
    GPIO.output(cspin, True)

    GPIO.output(clockpin, False)
    GPIO.output(cspin, False)

    commandout = adcnum
    commandout |= 0x18
    commandout <<= 3
    for i in range(5):
        if (commandout & 0x80):
            GPIO.output(mosipin, True)
        else:
            GPIO.output(mosipin, False)
        commandout <<= 1
        GPIO.output(clockpin, True)
        GPIO.output(clockpin, False)

    adcout = 0
    for i in range(12):
        GPIO.output(clockpin, True)
        GPIO.output(clockpin, False)
        adcout <<= 1
        if(GPIO.input(misopin)):
            adcout |= 0x1
    
    GPIO.output(cspin, True)

    adcout >>= 1
    print(adcout)

    if(adcout > 450):
        #led2 bright
        GPIO.output(output2, GPIO.HIGH)
        #led1 bright
        GPIO.output(output1, GPIO.HIGH)
        print("LED1 on")
        print("LED2 on")
    elif(adcout > 150):
        #led1 bright
        GPIO.output(output1, GPIO.HIGH)
        #led2 dark
        GPIO.output(output2, GPIO.LOW)
        print("LED1 on")
        print("LED2 off")
    else:
        #led1 dark
        GPIO.output(output1, GPIO.LOW)
        #led2 dark
        GPIO.output(output2, GPIO.LOW)
        print("LED1 off")
        print("LED2 off")

    return adcout


def main():
    init()
    while True:
        adc_value = readadc(photo_ch, SPICLK, SPIMOSI, SPIMISO, SPICS, output_pin, output_pin2)
        print(adc_value)
        #LED_control(adc_value, output_pin, output_pin2)
        time.sleep(1)

if __name__ == '__main__':
    main()
