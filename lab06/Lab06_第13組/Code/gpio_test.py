import Jetson.GPIO as GPIO
import time
import sys

SPICLK = 11 #23
SPIMISO = 9 #21
SPIMOSI = 10 #19
SPICS = 8 #24
output_pin = 17 #11 
output_pin3 = 27 #13 
output_pin2 = 22 #15
output_pin4 = 5 #29 

photo_ch = 0 #27

def init():
    GPIO.setwarnings(False)

    GPIO.cleanup()
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(output_pin, GPIO.OUT)
    GPIO.setup(output_pin2, GPIO.OUT)
    GPIO.setup(output_pin3, GPIO.OUT)
    GPIO.setup(output_pin4, GPIO.OUT)
    GPIO.setup(SPIMOSI, GPIO.OUT)
    GPIO.setup(SPIMISO, GPIO.IN)
    GPIO.setup(SPICLK, GPIO.OUT)
    GPIO.setup(SPICS, GPIO.OUT)
    
# get light
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
    if(adcout > 450):
        #led2 bright
        GPIO.output(output2, GPIO.HIGH)
        #led1 bright
        GPIO.output(output1, GPIO.HIGH)
    elif(adcout > 150):
        #led1 bright
        GPIO.output(output1, GPIO.HIGH)
        #led2 dark
        GPIO.output(output2, GPIO.LOW)
    else:
        #led1 dark
        GPIO.output(output1, GPIO.LOW)
        #led2 dark
        GPIO.output(output2, GPIO.LOW)
    #print(adcout)
    return adcout

# ledbright
def ledbright(led):
    if(led == 1):
        GPIO.output(output_pin, True)
    if(led == 2):
        GPIO.output(output_pin2, True)

def leddark(led):
    if(led == 1):
        GPIO.output(output_pin, False)
    if(led == 2):
        GPIO.output(output_pin2, False)

def ledshine(time):
    for i in range(2*time):
        adc_value = readadc(photo_ch, SPICLK, SPIMOSI, SPIMISO, SPICS, output_pin, output_pin2)
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
        time.sleep(1000000/adc_value)
    GPIO.output(output_pin1, False)
    GPIO.output(output_pin2, False)
    GPIO.output(output_pin3, False)
    GPIO.output(output_pin4, False)


def main(argv):
    init()
    #print("operating~~~~~~~~~~~~~")
    
    if(len(argv) == 1):
        #print("are you ok?")
        adc_value = readadc(photo_ch, SPICLK, SPIMOSI, SPIMISO, SPICS, output_pin, output_pin2)
        print(adc_value)
        return adc_value
    elif(argv[1][1] == 'E'):
        #print("elif")
        if(argv[2] =="on"):
            ledbright(int(argv[1][3]))
        elif(argv[2] == "off"):
            leddark(int(argv[1][3]))
    else:
        #print("else")
        ledshine(int(argv[2]))

if __name__ == '__main__':
    main(sys.argv)