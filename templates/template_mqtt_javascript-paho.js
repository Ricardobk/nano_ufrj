// Create a client instance
client = new Paho.MQTT.Client("146.164.26.62", Number(9110), "\\ws", "UseUmIdDiferenteAqui");

// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess: onConnect,
                userName : "participants",
	        password : "prp1nterac" });


// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  client.subscribe("world");
  message = new Paho.MQTT.Message("Hello");
  message.destinationName = "world";
  client.send(message);
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
  console.log("onMessageArrived:"+message.payloadString);
}
