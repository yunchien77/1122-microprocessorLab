const express = require("express");
const app = express();


app.use(express.static('./public'));



app.get("/index", (req, res)=>{
    if(req.query.botton1 === "Submit"){
        if(req.query.led1 === "on"){
            controlLED("LED1", req.query.POWER)
        }
        if(req.query.led2 === "on"){
            controlLED("LED2", req.query.POWER)
        }
        /*
        if(req.query.led3 === "on"){
            controlLED("LED3", req.query.POWER)
        }
        if(req.query.led4 === "on"){
            controlLED("LED4", req.query.POWER)
        }*/
    }
    if(req.query.botton2 === "Mode_shine"){
        controlLED("Mode_shine", req.query.time)
    }
    
    //res.send("Successfully Requested")
    //res.send('response')
    /*
    var response = {
        "LED1" : req.query.led1, 
        "LED2":req.query.led2, 
        "LED3":req.query.led3, 
        "LED4":req.query.led4,
        "POWER" : req.query.POWER,
        "botton1":req.query.botton1,
        "detect" : req.query.detecting,
        "botton3":req.query.botton3
    }
    res.send(response)*/
    if(req.query.botton3 === "Submit"){
        if(req.query.detecting === "detect"){
            //res.sendFile('/public/detect.html', {root: __dirname })
            res.redirect('/detect')
        }
        else{
            res.sendFile('/public/index.html', {root: __dirname })
        }
    }
    else{
        res.sendFile('/public/index.html', {root: __dirname })
        //event.preventDefault()
    }
    
}) 

app.get("/detect", (req, res)=> {
    res.sendFile('/public/detect.html', {root: __dirname })
    console.log("good")
    detect()
    if(req.query.botton3 === "Submit" && req.query.detecting === "noDected"){
        res.sendFile('/public/index.html', {root: __dirname })
    }
    
})

app.get("/detecting", (req, res)=> {
    //res.sendFile('/public/detect.html', {root: __dirname })
    console.log("good2")
    //console.log(detect())
    detect()
    .then(function(data){
        res.send(data)
    })
    .catch(error => {
        console.log(err)
    })
})

function controlLED(LED, POWER){
    return new Promise(function(resolve, reject){

        let child_process = require("child_process");

        let process = child_process.spawn('python',[
            "./gpio_led.py", LED, POWER
        ]);

        process.stdout.on('data', (data) =>{
            console.log(`stdout: ${data}`);
            
        });

        process.stderr.on('data', (data) =>{
           console.error(`stderr: ${data}`);
        });
    })
}


function detect(){
    var p = new Promise(function(resolve, reject){

        let child_process = require("child_process");

        let process = child_process.spawn('python',[
            "./gpio_test.py"
        ]);
        //let process = child_process.spawn('python',[
          //  "./test.py"
        //]);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}.`);
});