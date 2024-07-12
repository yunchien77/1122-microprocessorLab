#include <linux/init.h>
#include <linux/module.h>
#include <linux/fs.h>
#include <linux/gpio.h>
#include <asm/uaccess.h>

MODULE_LICENSE("Dual BSD/GPL");

#define DRIVER_MAJOR 60
#define DRIVER_NAME "demo"

int gpioPin[4] = { 396, 429, 395, 393};
int ledPin[4] = { 7, 12, 18, 37 };
int ledBook[4] = { 0, 0, 0, 0 };
static char userChar[100];

static int driver_open(struct inode *inode, struct file *filp) {
    printk("Open: Enter Open function\n");
    return 0;
}

static int driver_close(struct inode *inode, struct file *filp) {
    printk("Release: Enter Release function\n");
    return 0;
}

long driver_ioctl(struct file *filp, unsigned int cmd, unsigned long arg)
{
    printk("I/O Control: Enter I/O Control function\n");
    return 0;
}

static ssize_t driver_read(struct file *filp, char *buf, size_t size, loff_t *f_pos) {
    printk("Read: Enter Release function\n");
    return 0;
}

static ssize_t driver_write(struct file *filp, const char *buf, size_t size, loff_t *f_pos) {
    printk("Write: Enter Write function\n");
    if(copy_from_user(userChar, buf, size) == 0){
        userChar[size - 1] = '\0';
        int ledIndex;
	    int pin;

        printk("%s\n", userChar);
        if(userChar[0] == 'g') {
	        ledIndex = userChar[4] - '1';
            printk("LED%d Status: %d\n", ledIndex + 1, ledBook[ledIndex]);
        } 
        else if (userChar[1] == 'n') {
	        ledIndex = userChar[3] - '1';
	        pin = gpioPin[ledIndex];
            gpio_set_value(pin, 1);
            ledBook[ledIndex] = 1;
        } 
        else if (userChar[1] == 'f') {
	        ledIndex = userChar[4] - '1';
	        pin = gpioPin[ledIndex];
            gpio_set_value(pin, 0);
            ledBook[ledIndex] = 0;
        } 
        else {
            printk("Error: command not found");
        }
    } else{
        printk("Error: Write Error\n");
    }
    return size;
}

static struct file_operations driver_fops = {
    .open = driver_open,
    .release = driver_close,
    .unlocked_ioctl = driver_ioctl,
    .read = driver_read,
    .write = driver_write,
};

static int demo_init(void) {
    int result;
    printk("<1>demo: started\n");

    char* ledName[4] = { "LED1", "LED2", "LED3", "LED4" };
    int i;
    for (i = 0; i < 4; i++) {
        if (gpio_is_valid(gpioPin[i]) == 0) {
            printk("pin %d is no valid\n", gpioPin[i]);
            return -EBUSY;
        }

        if (gpio_request(gpioPin[i], ledName[i]) < 0) {
            printk("pin %d is busy\n", gpioPin[i]);
            return -EBUSY;
        }

        gpio_direction_output(gpioPin[i], 0);
        gpio_export(gpioPin[i], false);
    }
    
    result = register_chrdev(DRIVER_MAJOR, DRIVER_NAME, &driver_fops);
    if (result < 0) {
        printk("<1>demo: Failed to register character device\n");
        return result;
    }

    return 0;
}

static void demo_exit(void) {
    printk("<1>demo: removed\n");
    int i;
    for (i = 0; i < 4; i++) {
        gpio_free(gpioPin[i]);
    }

    /* Unregister character device */
    unregister_chrdev(DRIVER_MAJOR, DRIVER_NAME);
}

module_init(demo_init);
module_exit(demo_exit);