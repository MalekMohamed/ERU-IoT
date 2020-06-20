'use strict';
const Gpio = require('pigpio').Gpio;
const in_1 = new Gpio(8, {mode: Gpio.OUTPUT}); // peltier 9/10
const in_2 = new Gpio(7, {mode: Gpio.OUTPUT}); // peltier 7/8
const in_6 = new Gpio(12, {mode: Gpio.OUTPUT}); // peltier 5/6
const in_7 = new Gpio(16, {mode: Gpio.OUTPUT}); // peltier 3/4
const in_8 = new Gpio(20, {mode: Gpio.OUTPUT}); // peltier 1/2
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
let admin = require("firebase-admin");

let serviceAccount = {
    "type": "service_account",
    "project_id": "erus-11c50",
    "private_key_id": "b7ba7d8796efc6deaa0522122db153e748419454",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3CoSjHCbmKJ3s\neymB/zhccyh6aCyZTradSkBVnvYWvoZfn2gV1r/kURn/HNHOf0vh96F7lZOo6VXk\nvNMh6a11t73X6+pwjyc5jBH96sXy3362LI990wVnl4zfnDVoNDCsybx3rQOL+e94\noIXQzEkwkXQ2iRhdvmJB7l326L7FeN+PftiA3kTDuVkEdWw+vFCofT8ed2kJUoLF\nF0ez8l4IhHKta5ajc40YVX59n37jqdRUOiQXmthZKTOqXxuqlkjGYjWP3Z5yjXWa\nc96jagybdac6ATjbs/QucOJkp51j/+W2DegLyshnLctQQ+JLrnUkmS5tPBNpcEoX\nMzBYnVAlAgMBAAECggEADe3Zupzjk+u+2tZjif49UIG98JS5YiBEktMp8qoSYZg1\nmxTDI7hQKYSHdSvBBpUW1fcVfZVcI4RAMlQxP/krp1PoeUQ9drvaGQ3A98D0N9+M\nobnh4IoctO2qPYECam/gTWHbuwK6TJ5kPBqBHGrTXgQPoy/LICUjDo/gbC/5hobj\nKBdIezmn5B1UQAEUSlvQegou35Iec7TPDFf/oxDN0OGP8vKKDpuIeWHpdfuVcSp+\nIn8HkJ3qjYI75ScuztsITSt18JRcZ4hG9TSNXsa4Uwsh0hTGWxIfX98iNoGrwLNC\nMrFwmDKYbUUaAqUfTXprpYXCZzxN83Ar8ZOurtif8QKBgQD9QBHf2chTEheiq59K\nVs82gSE07pVeMcJ63LJxTMkPWMHIAIBnC7fHdCXJ27MBtnQO5Nd18WShWj8nNEig\nMFYM9hXqwsJSwT2Qa4DqSfTNSqEYUgLb22lGUJLRa02l1CzxvJZsfwaShLY/5pZX\nEcm0J7htVOzHv8Nv5fKHHzjB9QKBgQC5B0vIPACffITBe0aBnZf6c5p2bk0+6dKy\nWBz5qfwASC5Q+Wb+7Gl4ufGT3PcAuZCciavZbTDHIwLE+dmoP7qjDi1BzastT2ot\nWwQe7KULR0JjPQSxbDdN99CWbVo128R7obWhKxmEG2Q3ic3ij309G9xoZTsz6OiY\nPr8C8voHcQKBgDIuUdxjUPh0604GZ8fZL7IDIEtWwy4o+fpSZOFib6ykz7ELuGWy\nwrW45Av9hpjeSFzzJ2ZtcJ0wPrdL+uAS89oZoPoloU+4jrRhOOgzw1gyY31oMrzR\n2yhdqtnoQziKtGUqEzxoZyr9NQewbzXNhoQ2Iqs3Wrux2c4AaHAx1ZNJAoGBAJy4\nN1IUsJplx7RyDBhBObcjL9PcPYVqW9I/m9tERXSfrstbVAfcisF9DcemQ3jTtE9C\ntNJnEAe7+d6JmfhOcnEl0uOHptOsDkz4aJcg7fKNmwefaVg2Rum9W2numZhA2z20\njLlEXkptQQdhq4eY7gVSke/CvtCLGGfLzdJbp7ehAoGBAOlN24rODTpUN/Dtc75H\ncI+SJlvE361wURZqNyFks/3G/fiHtWIj73GwtDA0fcVyJQIGEYauXD38xJxTthqN\njtEQACAnw+ZkUFUxFGMLnwwvV3jIjXMr8+zdzzXcSuAHiSCM5v6cvaZcyjEsG0kS\nRDMbQEGTN0GBqmETbfS5Xpk0\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-3j52f@erus-11c50.iam.gserviceaccount.com",
    "client_id": "106802816373413352676",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3j52f%40erus-11c50.iam.gserviceaccount.com"
};

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
