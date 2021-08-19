import paho.mqtt.client as paho
import time

client = paho.Client("bot")
client.username_pw_set(username="participants", password="prp1nterac")

def on_message(client, userdata, message):
    print("received message =",str(message.payload.decode("utf-8")))

def on_publish(client,userdata,result):
    print("data published \n")
    pass

def on_connect(client, userdata, flags, rc):
    client.subscribe("world")
    client.publish("world", "hello")


client.on_publish = on_publish
client.on_message = on_message
client.on_connect = on_connect

client.connect("146.164.26.62", 2494)
client.loop_forever() 
