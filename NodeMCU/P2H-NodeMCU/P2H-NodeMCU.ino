
const char* WifiSSID     = "meeplemaker"; // WifiSSID
const char* WifiPassword = "turboturbo"; // WifiPassword

const String boilerID = "ZFBBTKRG"; // HZPHRJBY
long data_timestamp = 0;
boolean data_connected = false;
uint16_t data_charge = 0; //
boolean data_powered = false;

//Constants
const uint16_t CPWater = 4190; //soortelijke warmtecapactiteit water 
const uint16_t CPRVS = 500; //soortelijke warmtecapaciteit RVS

//Sensors
double tempIn = 10.7; //aantal graden aan de ingang
double tempOut;
double usedVolume = 0.78; //het water dat gebruikt is 

//Settings
uint16_t settings_volume = 120; //volume van de boiler
uint16_t settings_wattage = 32000; //wattage van de boiler
uint8_t settings_temp = 65; //max of gewenste temperatuur van de boiler

//Commands;
long commands_timestamp; //poweruptime
boolean commands_power; //true when powered!!!

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
long currentTime;

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

  //setup pins
  pinMode(D0, OUTPUT);
  digitalWrite(D0, LOW);
  
  //NTP
  WiFi.begin(WifiSSID, WifiPassword);
  while ( WiFi.status() != WL_CONNECTED ) {
    delay ( 500 );
    Serial.print ( "." );
  }
  timeClient.begin();
  timeClient.update();

  // Optional functionalities of EspMQTTClient :
  client.enableDebuggingMessages(); // Enable debugging messages sent to serial output
  client.enableHTTPWebUpdater(); // Enable the web updater. User and password default to values of MQTTUsername and MQTTPassword. These can be overrited with enableHTTPWebUpdater("user", "password").
}

// This function is called once everything is connected (Wifi and MQTT)
// WARNING : YOU MUST IMPLEMENT IT IF YOU USE EspMQTTClient
void onConnectionEstablished()
{
  publishBoilerData();

  // Subscribe to "P2H/___/settings" and display received message to Serial
  client.subscribe("P2H/"+boilerID+"/settings", [](const String & payload) {
    const size_t capacity = JSON_OBJECT_SIZE(3) + 20;
    DynamicJsonDocument doc(capacity);
    deserializeJson(doc, payload);
    settings_volume = doc["volume"]; // 500
    settings_wattage = doc["wattage"];
    settings_temp = doc["temp"]; // 90
    Serial.println("Boiler volume set to "+String(settings_volume)+"l");
    Serial.println("Boiler wattage set to "+String(settings_wattage)+"W");
    Serial.println("Boiler maximum temperature set to "+String(settings_temp)+"°");
  });

  // Subscribe to "P2H/___/commands" and display received message to Serial
  client.subscribe("P2H/"+boilerID+"/commands", [](const String & payload) {
    const size_t capacity = JSON_OBJECT_SIZE(2) + 20;
    DynamicJsonDocument doc(capacity);
    deserializeJson(doc, payload);
    commands_timestamp = doc["timestamp"]; // 1587129806355
    commands_power = doc["power"]; // true
    if (commands_power) {
      Serial.println("The boiler will power up at "+String(commands_timestamp)+".");
    }
  });
}

void loop()
{
  client.loop();
  currentTime = timeClient.getEpochTime();
  //Serial.println(currentTime);
  //Serial.println(chargeTime());
  if (commands_power) {
    if (currentTime >= commands_timestamp){
      long counter = commands_timestamp + chargingTime() - currentTime;
      if (counter > 0) {
        Serial.print("The boiler will power down in "),
        Serial.print(counter);
        Serial.println(" seconds.");
      }
      if (currentTime < commands_timestamp + chargingTime() && !data_powered){
        powerOn();
      } else if (currentTime >= commands_timestamp + chargingTime() && data_powered) {
        powerOff();
      }
    }   
  }
  delay(1000);
}

void publishBoilerData() {
  //initialize JSON
  const size_t capacity = JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(4) + 70;
  StaticJsonDocument<capacity> doc;
  
  JsonObject root = doc.to<JsonObject>();
  root["boilerID"] = boilerID;
  JsonObject data = doc.createNestedObject("data");
  data["timestamp"] = data_timestamp;
  data["connected"] = data_connected;
  data["charge"] = data_charge;
  data["powered"] = data_powered;

  // Publish a message P2H/data when connected
  //timeClient.update();
  data["timestamp"] = timeClient.getEpochTime();
  data["connected"] = true;

  char buffer[512];
  serializeJson(doc, buffer);
  client.publish("P2H/data", buffer); // You can activate the retain flag by setting the third parameter to true
}

uint16_t getCharge()
{
  return 2000;
}

void powerOn() {
  data_powered = true;
  digitalWrite(D0, HIGH);
  publishBoilerData();  
}

void powerOff() {
  data_powered = false;
  digitalWrite(D0, LOW);
  publishBoilerData();  
}

long chargingTime() {
  double deltaT = settings_temp - tempIn;
  usedVolume = min(usedVolume, double(settings_volume));
  double Q = usedVolume*CPWater*deltaT;
  double chargingTime = Q / (settings_wattage/1000);
  return long(chargingTime);
}
