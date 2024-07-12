const express = require("express");
const app = express();
/*
app.get("/", (req, res)=> {
    res.send("hello world!!!")
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}.`);
});
*/

app.use(express.static('./public'));
/*
app.get("/index", (req, res)=> {
    var response = {
        "my name" : req.query.name,
        "my id" : req.query.id
    }
    res.send(response)
})*/

app.get("/index", (req, res)=> {
    //var html = " "
    /*
    var response = {
        "LED1" : req.query.led1, 
        "LED2":req.query.led2, 
        "LED3":req.query.led3, 
        "LED4":req.query.led4,
        "POWER" : req.query.POWER,
        "botton1":req.query.botton1,
        "time" : req.query.time,
        "botton2":req.query.botton2
    }*/

    if(req.query.botton1 === "Submit"){
        if(req.query.led1 === "on"){
            controlLED("LED1", req.query.POWER)
        }
        if(req.query.led2 === "on"){
            controlLED("LED2", req.query.POWER)
        }
        if(req.query.led3 === "on"){
            controlLED("LED3", req.query.POWER)
        }
        if(req.query.led4 === "on"){
            controlLED("LED4", req.query.POWER)
        }
    }

    if(req.query.botton2 === "Mode_shine"){
        controlLED("Mode_shine", req.query.time)
    }
    
    //res.send("Successfully Requested")
    //res.send('response')
    res.sendFile('/public/index.html', {root: __dirname })
    
})

function controlLED(LED, POWER){

    let child_process = require("child_process");
    console.log(`excuing`)

    let process = child_process.execFile('sudo' ,['./C++/L4Program', LED, POWER
    ]);
    console.log(`success`)

    process.stdout.on('data', (data) =>{
        console.log(`stdout: ${data}`);
    });

    process.stderr.on('data', (data) =>{
        console.error(`stderr: ${data}`);
    });

}
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}.`);
});