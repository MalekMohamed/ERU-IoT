'use strict';
const wia = require('wia')('d_sk_Ngqut2ETd5fYrBfHFQlHstJm');
const Gpio = require('pigpio').Gpio;
const module_4 = new Gpio(21, {mode: Gpio.OUTPUT}); // Yellow LED
const module_1 = new Gpio(4, {mode: Gpio.OUTPUT}); // Blue LED
const module_2 = new Gpio(14, {mode: Gpio.OUTPUT}); // RED LED
const module_3 = new Gpio(17, {mode: Gpio.OUTPUT}); // Green LED
const SerialPort = require('serialport'); // Include Serial port library
const port = new SerialPort('/dev/ttyACM0', {baudRate: 115200}); // Set port to Dev/ttyACM0
var Readline = SerialPort.parsers.Readline;
var parser = new Readline();
port.pipe(parser);
// Connect to the port
port.on("open", () => {
    console.log('serial port open');
});
var pi = require('node-raspi');
var temp = pi.getThrm();
var str;
parser.on('data', function (data) {
    str = JSON.stringify(data); // Convert to JSON
    str = JSON.parse(data); //Then parse it
    str.temperature = temp;
    str.module_1 = module_1.digitalRead();
    str.module_2 = module_2.digitalRead();
    str.module_3 = module_3.digitalRead();
    str.module_4 = module_4.digitalRead();
    str = JSON.stringify(str);
    str = str.toString();
});


function PushData(Data) {
    console.log(Data);
    wia.events.publish({
        name: 'Incoming-From-Sensors',
        data: Data
    });
}
function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
    console.log('Connecting to Cloud Server...!');
    wia.stream.on('connect', function () {
        console.log('Connected');
        wia.events.subscribe({
                device: 'dev_rGIW0KhW',
            },
            function (event, err) {
                if (err) console.log(err);
                if (event.name != 'Incoming-From-Sensors') {
                    event.data = JSON.parse(event.data);
                    if (event.name == 'Set-Fan-Speed') {
                        let analogSpeed = Math.round(map_range(event.data, 0, 1200, 0, 255));
                        console.log('Fan speed set to:' + event.data);
                        console.log('Fan speed PWM set to:' + analogSpeed);
                        //led.pwmWrite(analogSpeed);
                    } else if (event.name == 'Set-module-1') {
                        console.log(event.name + ' to: ' + event.data);
                        module_1.digitalWrite(event.data);
                    } else if (event.name == 'Set-module-2') {
                        console.log(event.name + ' to: ' + event.data);
                        module_2.digitalWrite(event.data);
                    } else if (event.name == 'Set-module-3') {
                        console.log(event.name + ' to: ' + event.data);
                        module_3.digitalWrite(event.data);
                    } else if (event.name == 'Set-module-4') {
                        console.log(event.name + ' to: ' + event.data);
                        module_4.digitalWrite(event.data);
                    } else {
                        console.log('New Event Created');
                        console.log('id: [' + event.id + ']');
                        console.log('Name: [' + event.name + ']');
                        console.log('Data: [' + event.data + ']');
                    }
                }
            });

    });
// Connect to the MQTT API
    wia.stream.connect();
    wia.stream.on('disconnect', function () {
        console.log("Disconnect emitted.");
    });
    wia.stream.on('offline', function () {
        console.log("Offline emitted.");
    });
    wia.stream.on('error', function (err) {
        console.log("Error emitted.");
        console.log(err);
    });
setInterval(function () {
    if (typeof str == 'string') {
        PushData(str);
    } else {
        console.log('Error in getting data')
    }
}, 1000);
