// Create an instance of Wia
// Replace 'd_sk_abcdef' with your device secret key
var wia = require('wia')('d_sk_Ngqut2ETd5fYrBfHFQlHstJm');

// Listen for a successful connection to the MQTT API
wia.stream.on('connect', function() {
    // Publish a location
    wia.events.subscribe({
        device: 'dev_rGIW0KhW',
    }, function(err, event) {
        console.log(event);
        console.log(err);
    });
});

// Connect to the MQTT API
wia.stream.connect();