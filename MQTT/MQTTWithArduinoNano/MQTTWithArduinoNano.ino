#include <SPI.h>
#include <UIPEthernet.h>
#include "PubSubClient.h"

#define CLIENT_ID       "ArduinoNano"
#define INTERVAL        10000 // 10 sec delay between publishing
uint8_t mac[6] = {0x00,0x01,0x02,0x03,0x04,0x05};

long sensorTime = millis();
long previousSensorTime;

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i=0;i<length;i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  if (topic = "room/lamp") {
    for (int i=0;i<length;i++) {
      digitalWrite(7, !((int)payload[i]-48)); //negatieve logica...
    }  
  }
}

EthernetClient ethClient;
PubSubClient mqttClient(ethClient);

void reconnect() {
  // Loop until we're reconnected
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (mqttClient.connect("arduinoClient")) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      mqttClient.publish("outTopic","hello world");
      mqttClient.publish("room/temperature", "20");
      mqttClient.publish("room/humidity", "50");
      // ... and resubscribe
      mqttClient.subscribe("room/lamp");
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup() {
  pinMode(7, OUTPUT);
  
  Serial.begin(9600);

  // setup mqtt client
  mqttClient.setServer("192.168.1.45",1883);
  mqttClient.setCallback(callback);

  //setup ethernet/DHCP
  Ethernet.begin(mac);

  Serial.print("IP Adres          : ");
  Serial.println(Ethernet.localIP());
  Serial.print("Subnet Mask       : ");
  Serial.println(Ethernet.subnetMask());
  Serial.print("Default Gateway IP: ");
  Serial.println(Ethernet.gatewayIP());
  Serial.print("DNS Server IP     : ");
  Serial.println(Ethernet.dnsServerIP());

  previousSensorTime = sensorTime;
}

void loop() {
  
  if (!mqttClient.connected()) {
    reconnect();
  }
  mqttClient.loop();
}
