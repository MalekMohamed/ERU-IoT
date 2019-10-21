const wia = require('wia')('d_sk_Ngqut2ETd5fYrBfHFQlHstJm');
console.log('Connecting to Wia Server...!');
wia.stream.on('connect', function () {
    console.log('Connected');
    wia.events.subscribe({
        device: 'dev_rGIW0KhW',
    }, function (event, err) {
        if (err) console.log(err);
        if(event) {
            console.log('New Event Created');
            console.log('id: [' + event.id + ']');
            console.log('Name: [' + event.name + ']');
            console.log('Data: [' + event.data + ']');
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