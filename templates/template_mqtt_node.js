// require npm package
const mqtt = require('mqtt');

// declare client
const client = mqtt.connect('participants:prp1nterac@146.164.26.62:2494', {
  clientId: 'nanode'
});

// register "connect" callback
client.on('connect', function() {
  console.log('connected!');

  // subscribe to topic
  client.subscribe('world');

  // publish message every second
  setInterval(function() {
    client.publish('world', 'hello');
  }, 1000);
});

// register "message" callback
client.on('message', function(topic, message) {
  console.log(topic + ': ' + message.toString());
});
