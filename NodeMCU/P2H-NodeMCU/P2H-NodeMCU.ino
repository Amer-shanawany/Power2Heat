const char* WifiSSID     = "meeplemaker"; // WifiSSID
const char* WifiPassword = "turboturbo"; // WifiPassword

const char* boilerID = "5FBBTKRG"; // HZPHRJBY 8SJGCZDU T94D2YUS YZJ3JZL5 Y9XDE3RM 7X8RAEKR CR5MAKQK
long data_timestamp = 0;
boolean data_connected = false;
uint16_t data_charge = 0; //
boolean data_powered = false;

//JSON
#include <ArduinoJson.h>

//NTP
#include <NTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
const long utcOffsetInSeconds = 0; //0 = zomertijd - 3600 = wintertijd
char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

//MQTT
#include "EspMQTTClient.h"

EspMQTTClient client(
  WifiSSID,       // WifiSSID
  WifiPassword,   // WifiPassword
  //  "88.99.186.143");  // MQTT Broker server ip
  "192.168.1.43");  // MQTT Broker server ip
//  "MQTTUsername",   // Can be omitted if not needed
//  "MQTTPassword",   // Can be omitted if not needed
//  "TestClient",     // Client name that uniquely identify your device
//  1883              // The MQTT port, default to 1883. this line can be omitted
// );


void setup() {
  Serial.begin(115200);
  while (!Serial) continue;
  
  //NTP
  WiFi.begin(WifiSSID, WifiPassword);
  while ( WiFi.status() != WL_CONNECTED ) {
    delay ( 500 );
    Serial.print ( "." );
  }
  timeClient.begin();

  // Optional functionalities of EspMQTTClient :
  client.enableDebuggingMessages(); // Enable debugging messages sent to serial output
  client.enableHTTPWebUpdater(); // Enable the web updater. User and password default to values of MQTTUsername and MQTTPassword. These can be overrited with enableHTTPWebUpdater("user", "password").
  //client.enableLastWillMessage("TestClient/lastwill", "I am going offline");  // You can activate the retain flag by setting the third parameter to true
}

// This function is called once everything is connected (Wifi and MQTT)
// WARNING : YOU MUST IMPLEMENT IT IF YOU USE EspMQTTClient
void onConnectionEstablished()
{
  //initialize JSON
  const size_t capacity = JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(4);
  StaticJsonDocument<capacity> doc;
  
  JsonObject root = doc.to<JsonObject>();
  root["boilerID"] = boilerID;
  JsonObject data = doc.createNestedObject("data");
  data["timestamp"] = data_timestamp;
  data["connected"] = data_connected;
  data["charge"] = data_charge;
  data["powered"] = data_powered;

  // Publish a message P2H/boilerdata when connected
  timeClient.update();
  data["timestamp"] = timeClient.getEpochTime();
  data["connected"] = true;

  char buffer[512];
  serializeJson(doc, buffer);
  client.publish("P2H/boilerdata", buffer); // You can activate the retain flag by setting the third parameter to true

  // Subscribe to "P2H/test" and display received message to Serial
  client.subscribe("P2H/test", [](const String & payload) {
  Serial.println(payload);
  });

  // Subscribe to "mytopic/wildcardtest/#" and display received message to Serial
  //client.subscribe("mytopic/wildcardtest/#", [](const String & topic, const String & payload) {
  //  Serial.println(topic + ": " + payload);
  //});

  // Execute delayed instructions
  //client.executeDelayed(5 * 1000, []() {
  //  client.publish("mytopic/test", "This is a message sent 5 seconds later");
  //});
}

void loop()
{
  client.loop();
}

uint16_t getCharge()
{
  return 2000;
}
