import Jetson.GPIO as GPIO
import time
import sys

SPICLK = 11 #23
SPIMISO = 9 #21
SPIMOSI = 10 #19
SPICS = 8 #24
output_pin = 17 #11 
output_pin2 = 27 #13 
output_pin3 = 22 #15
output_pin4 = 5 #29 

photo_ch = 0 #27

def init(pin):
    print("initing = =")
    print(pin)
    GPIO.setwarnings(False)

    GPIO.cleanup()
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(pin, GPIO.OUT)
    GPIO.setup(SPIMOSI, GPIO.OUT)
    GPIO.setup(SPIMISO, GPIO.IN)
    GPIO.setup(SPICLK, GPIO.OUT)
    GPIO.setup(SPICS, GPIO.OUT)
    
# get light
def readadc(adcnum, clockpin, mosipin, misopin, cspin):
    print("adcing")
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
    return adcout

# ledbright
def ledbright(led):
    print("brighting")
    print(led)
    GPIO.output(led, True)
    #if(led == 1):
    #    GPIO.output(output_pin, True)
    #elif(led == 2):
    #    GPIO.output(output_pin2, True)

def leddark(led):
    print("darking")
    print(led)
    GPIO.output(led, False)
    #if(led == 1):
    #    GPIO.output(output_pin, GPIO.LOW)
    #elif(led == 2):
    #    GPIO.output(output_pin2, GPIO.LOW)

def ledshine(time):
    for i in range(2*time):
        adc_value = readadc(photo_ch, SPICLK, SPIMOSI, SPIMISO, SPICS)
        print(adc_value)
        if(i % 2 == 0):
            GPIO.output(output_pin, True)
            GPIO.output(output_pin2, True)
            GPIO.output(output_pin3, False)
            GPIO.output(output_pin4, False)
        else:
            GPIO.output(output_pin3, True)
            GPIO.output(output_pin4, True)
            GPIO.output(output_pin1, False)
            GPIO.output(output_pin2, False)
        time.sleep(100000/adc_value)
    GPIO.output(output_pin1, False)
    GPIO.output(output_pin2, False)
    GPIO.output(output_pin3, False)
    GPIO.output(output_pin4, False)


def main(argv):
    if(int(argv[1][3]) == 1):
        init(17)
        led = 17
    elif(int(argv[1][3]) == 2):
        init(22)
        led = 22
    
    #print("operating~~~~~~~~~~~~~")
    
    if(len(argv) == 1):
        #print("are you ok?")
        adc_value = readadc(photo_ch, SPICLK, SPIMOSI, SPIMISO, SPICS)
        print(adc_value)
        return adc_value
    elif(argv[1][1] == 'E'):
        #print("elif")
        if(argv[2] =="on"):
            print(led)
            print("on")
            #ledbright(int(argv[1][3]))
            ledbright(led)
        elif(argv[2] == "off"):
            #leddark(int(argv[1][3]))
            print(led)
            print("off")
            leddark(led)
    #else:
        #print("else")
        #ledshine(int(argv[2]))

if __name__ == '__main__':
    main(sys.argv)