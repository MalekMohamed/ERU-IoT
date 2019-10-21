'use strict'
const wia = require('wia')('d_sk_Ngqut2ETd5fYrBfHFQlHstJm');
var fs = require('fs');
fs.readFile('data.json', 'utf8', function (err, data) {
    PushData(JSON.stringify(data));
});
function PushData(Data) {
    console.log('Sending Power Values');
    wia.events.publish({
        name: 'Incoming-From-Sensors',
        data: Data
    });
    console.log('Done');
}