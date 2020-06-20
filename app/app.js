'use strict';
const Gpio = require('pigpio').Gpio;
const in_1 = new Gpio(8, {mode: Gpio.OUTPUT}); // peltier 9/10
const in_2 = new Gpio(7, {mode: Gpio.OUTPUT}); // peltier 7/8
const in_6 = new Gpio(12, {mode: Gpio.OUTPUT}); // peltier 5/6
const in_7 = new Gpio(16, {mode: Gpio.OUTPUT}); // peltier 3/4
const in_8 = new Gpio(20, {mode: Gpio.OUTPUT}); // peltier 1/2
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
let admin = require("firebase-admin");

// contact the ower for service Account

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://erus-11c50.firebaseio.com"
});
const db = admin.firestore();

const SerialPort = require('serialport'); // Include Serial port library
const port = new SerialPort('/dev/ttyACM0', {
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
}); // Set port to Dev/ttyACM0
var str = {};

var Readline = SerialPort.parsers.Readline;
var parser = new Readline();
port.pipe(parser);

// Connect to the port
port.on("open", () => {
    console.log('serial port open');
});

parser.on('data', async function (data) {
    await sleep(1000);
    str = JSON.parse(data.toString()); //Then parse it
    str.in_1 = in_1.digitalRead();
    str.in_2 = in_2.digitalRead();
    str.in_6 = in_6.digitalRead();
    str.in_7 = in_7.digitalRead();
    str.in_8 = in_8.digitalRead();
    str.DT = str.Temperature_1 - str.Temperature_2; // Inside the tube - ampiant temp

});
setInterval(function () {
    //console.log('Delta T = ', str.DT);
    if (str.DT >= 8) {
        console.log('Turning moduels off', str.DT);
        in_1.digitalWrite(0);
        in_8.digitalWrite(0);
    }
    if (typeof str.DT == 'number') {
        PushData(str);
    }
}, 2000);
let state = db.collection('events').doc('device').set({state:'online'},{merge:true});
function PushData(Data) {
    return db.collection('events').doc('Incoming-From-Sensors').set(Data,{merge:true}).then(res=> {
        // console.log('New Data Saved')
    });

}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

console.log('Connecting to Firebase Server...!');
function getDocData(docName) {
    console.log('getting ' + docName + ' Data...!');
    return db.collection('events').doc(docName);
}
getDocData('Set-Fan-Speed').onSnapshot(snapShot => {
    let analogSpeed = Math.round(map_range(snapShot.data().data, 0, 1600, 0, 255));
    console.log('Fan speed set to: ' + snapShot.data().data);
    console.log('Fan speed PWM set to: ' + analogSpeed);
    port.write('Fan='+snapShot.data().data+'\n');
});
getDocData('Set-module-1_2').onSnapshot(snapShot => {
    console.log('Set Peltier 1 & 2 to: ' + snapShot.data().data);
    in_8.digitalWrite(snapShot.data().data);
});
getDocData('Set-module-3_4').onSnapshot(snapShot => {
    console.log('Set Peltier 3 & 4 to: ' + snapShot.data().data);
    in_7.digitalWrite(snapShot.data().data);
});
getDocData('Set-module-5_6').onSnapshot(snapShot => {
    console.log('Set Peltier 5 & 6 to: ' + snapShot.data().data);
    in_6.digitalWrite(snapShot.data().data);
});
getDocData('Set-module-7_8').onSnapshot(snapShot => {
    console.log('Set Peltier 7 & 8 to: ' + snapShot.data().data);
    in_2.digitalWrite(snapShot.data().data);
});
getDocData('Set-module-9_10').onSnapshot(snapShot => {
    console.log('Set Peltier 9 & 10 to: ' + snapShot.data().data);
    in_1.digitalWrite(snapShot.data().data);
});
process.on('SIGINT', function(code) {
    setTimeout(function () {
        return db.collection('events').doc('device').set({state:'offline'},{merge:true}).then(res=> {
            console.log('System is going offline');
            process.exit();
        });
    },2000)
});
