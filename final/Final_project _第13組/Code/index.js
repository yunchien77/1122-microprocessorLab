const express = require("express");
const app = express();
const url = require('url');
var nodemailer = require('nodemailer');
var slideValue = 50;
var temperature = 25; 

var showLight = 0;
var showTemp = 0;

app.use('/', express.static('./public'));

var LEDs = ['LED1', 'LED2', 'LED3', 'LED4'];
var Status = ['off', 'off', 'off', 'off'];

app.get("/slideControl", (req, res) =>{
    slideValue = req.query.slideValue;
    console.log(`Received temperature value: ${slideValue}`);
    //res.send( req.query.slideValue)
    
    ledshine("LED1");
    res.redirect(url.format({
        pathname: "/",
    }));
})

async function ledshine(LED){
    try {
        await insmod();
        await controLED(LED, "on");
        console.log(`on`);

        //setTimeout(() => {
        //    controLED(LED, "off");
        //    console.log(`off`);
        //}, 3000);
        await rmmod();
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

// 窗簾敞開程度
app.get("/index1", (req, res) => {
    console.log(`Received slide value: ${slideValue}`);
    res.send(`${slideValue}`);
})

app.get("/openControl", (req, res)=>{
    temperature = req.query.temperature;
    console.log(`Received temperature value: ${temperature}`);
    ledshine("LED2");
    //res.send( req.query.temperature)
    res.redirect(url.format({
        pathname: "/",
    }));
})
// 冷氣溫度
app.get('/index2', (req, res) => {
    console.log(`Received temperature value: ${temperature}`);
    res.send(`${temperature}`);
});

app.get("/ddd", (req, res)=>{
    console.log("reset")
    resetLED();
    res.redirect(url.format({
        pathname: "/",
    }));
})

async function resetLED(){
    console.log("ddd")
    try {
        await insmod();
        await controLED("LED1", "off");
        await controLED("LED2", "off");
        await controLED("LED3", "off");
        await controLED("LED4", "off");
        await rmmod();
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

app.get("/detect1", (req, res)=>{
    //console.log("dsfsdf")
    detect1()
    .then(function(data){
        //console.log("send1")
        res.send(data)
    })
    .catch(error => {
        console.log(err)
    })
})


app.get("/detect2", (req, res) =>{
    //console.log("sfsfs")
    detect2()
    .then(function(data){
        //console.log("send2")
        res.send(data)
    })
    .catch(error => {
        console.log(err)
    })
})

app.get("/sending", (req, res) =>{
    console.log(req.query.mail);
    console.log(req.query.message);
    sendEmail(req.query.mail, req.query.message, temperature, slideValue);
    res.redirect(url.format({
        pathname: "/",
    }));
})


async function insmod() {

    return new Promise((resolve, reject) => {

        const { exec } = require('child_process');

        const command = 'sudo insmod driver/demo.ko';

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`error: ${error.message}`);
                return;
            }
            console.log("insmod")
            resolve();
        });

    });


}

async function rmmod() {

    return new Promise((resolve, reject) => {
        const { exec } = require('child_process');
        const command = 'sudo rmmod driver/demo.ko';

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            console.log("rmmod")
            resolve();
        });
    });
}

async function controLED(LED, POWER) {
    console.log(LED)
    console.log(POWER)
    return new Promise((resolve, reject) => {
        let child_process = require("child_process");

        let process = child_process.execFile('sudo', [
            "./driver/test.o", LED, POWER,
        ]);

        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        })

        process.stdout.on('data', (data) => {
            console.log(`stderr: ${data}`);
        })

        process.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Process exited with code ${code}`));
            }
        });
    });
}



function detect1(){
    light = "light";
    var p = new Promise(function(resolve, reject){

        let child_process = require("child_process");

        let process = child_process.spawn('python',[
            "./gpio_test.py", light
        ]);

        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            resolve(data)
            //return data;
        });

        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            reject(data)
        });
    })
    return p
}

function detect2(){
    temp = "temp";
    var p = new Promise(function(resolve, reject){

        let child_process = require("child_process");

        let process = child_process.spawn('python',[
            "./gpio_test.py", temp
        ]);

        process.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            resolve(data)
            //return data;
        });

        process.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            reject(data)
        });
    })
    return p
}


function sendEmail(mail, userText, mailTemp, mailOpen){
    var today = new Date();

    let inputSubject = `【來自自在控小雷擊落客-${today}】`;

    let inputText = `您好

我是您的自在控小雷擊落客，
您的冷氣現在為${mailTemp}度
床簾開啟狀態為${mailOpen}%
過去的您給自己的提醒是:
`;

    let sign = `
以上
--
智慧是人工的 但我對您的愛不是

Sincerely,
Email You
--------------------------------------------------------------------
0952-520-520
emailJUSTFORYOUUUUU@gmail.com`;

    //宣告發信物件
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'emailjustforyouuuuu@gmail.com',
            pass: 'pazbtldskeucvvef' // 這是真的
        }
    });

    var options = {
        //寄件者
        from: 'Email You <emailjustforyouuuuu@gmail.com>',
        //收件者
        to: mail, 
        //副本
        cc: 'b812110011@tmu.edu.tw',
       // //密件副本
        //bcc: 'account4@gmail.com',
        //主旨
        subject: inputSubject, // Subject line
        //純文字
        text: inputText + userText + sign,
    };

    //console.log(text);

    //發送信件方法
    transporter.sendMail(options)
    .then(info => {
        //console.log({ info });
    }).catch(console.error);

    console.log("send finish");
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}.`);
});