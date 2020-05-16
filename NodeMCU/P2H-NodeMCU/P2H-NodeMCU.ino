#include "config.h"
const String topic = BOILERID; //

//Interval
const long dataInterval = 300; // om de 5 minuten wordt de data geupdatet
const long sensorInterval = 10; // om de 10 sec worden de sensoren uitgelezen

//Boiler variables
float boilerQ; // Q of the boiler
const float boilerWindow = 1.0; // window vermijdt het constant aan en uitschakel van de boiler
float boilerDesiredTemp = 70.0; //

//Data
long data_timestamp = 0;
float data_charge = 0.0; //in % minTemp = 0% // maxTemp = 100%
float data_volume = 0.0; // in l
float data_temp = 70.0; // in °C - use 68.83° to simulate 
boolean data_power = false;

//Constants
const uint16_t CPWater = 4190; //soortelijke warmtecapactiteit water 
const uint16_t CPRVS = 500; //soortelijke warmtecapaciteit RVS

//Sensors
float tempIn = 15.0; //aantal graden aan de ingang
float tempOut;
float usedVolume = 0.0; //het water dat gebruikt is 

//Settings
uint16_t settings_volume = 120; //volume van de boiler
uint16_t settings_wattage = 3200; //wattage van de boiler
float settings_minTemp = 60.0; //min temperatuur van de boiler
float settings_maxTemp = 90.0; //max temperatuur van de boiler
//float settings_desiredTemp = 70.0; //gewenste temperatuur van de boiler

//Profile
typedef struct DFHSQFGKSQHJG{
    uint16_t time;
    uint8_t temp;
} TimeTemp_t;

TimeTemp_t myProfile[21] = {{0, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}, {10080, 70}};
uint16_t timeCode = 0;

//Commands;
boolean commands_P2H = false; //true when powered!!!

//Time
long prevDataTime;
long prevSensorTime;
long myTime;

//JSON
#include <ArduinoJson.h>

//WIRE-I2C
#include <Wire.h>

//NTP
#include <NTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
const long utcOffsetInSeconds = 7200; // offset ZOMERTIJD = 7200 // WINTERTIJD = 3600
char daysOfTheWeek[7][12] = {"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);
long currentTime;

//MQTT
// !!! change MQTT_MAX_PACKET_SIZE 512 in PubSubClient.h
#include "EspMQTTClient.h"

EspMQTTClient client(
  WIFISSID,         // WifiSSID
  WIFIPASSWORD,     // WifiPassword
  "88.99.186.143", // MQTT Broker server ip
  //"192.168.1.43",  // MQTT Broker server ip
  "",               // MQTTUsername - Can be omitted if not needed
  "",               // MQTTPassword - Can be omitted if not needed
  BOILERID,     // Client name that uniquely identify your device
  1883              // The MQTT port, default to 1883. this line can be omitted
  );

void setup() {
  Serial.begin(115200);
  while (!Serial) continue;

  //setup pins
  pinMode(D0, OUTPUT);
  pinMode(A0, INPUT);
  digitalWrite(D0, LOW);
  
  //NTP
  WiFi.begin(WIFISSID, WIFIPASSWORD);
  while (WiFi.status() != WL_CONNECTED ) {
    delay (500);
    Serial.print (".");
  }
  timeClient.begin();
  timeClient.update();
  myTime = timeClient.getEpochTime();
  prevSensorTime = myTime;
  prevDataTime = myTime;

  // Optional functionalities of EspMQTTClient :
  client.enableDebuggingMessages(); // Enable debugging messages sent to serial output
  client.enableHTTPWebUpdater(); // Enable the web updater. User and password default to values of MQTTUsername and MQTTPassword. These can be overrited with enableHTTPWebUpdater("user", "password").
  
  // Enable I2C
  Wire.begin();
}

// This function is called once everything is connected (Wifi and MQTT)
// WARNING : YOU MUST IMPLEMENT IT IF YOU USE EspMQTTClient
void onConnectionEstablished()
{
  publishData();
  
  // Subscribe to "P2H/___/profile" and display received message to Serial
  client.subscribe("P2H/"+topic+"/profile", [](const String & payload) {
    const size_t capacity = 2*JSON_ARRAY_SIZE(21) + JSON_OBJECT_SIZE(2) + 20;
    DynamicJsonDocument doc(capacity);
    deserializeJson(doc, payload); // 10080
    JsonArray time = doc["time"];
    JsonArray temp = doc["temp"];
    for (int i = 0; i < 21; i++) {
      myProfile[i].time = time[i];
      myProfile[i].temp = temp[i];
    }
    Serial.println("Profile succesfully received.");
  });

  // Subscribe to "P2H/___/settings" and display received message to Serial
  client.subscribe("P2H/"+topic+"/settings", [](const String & payload) {
    const size_t capacity = JSON_OBJECT_SIZE(5) + 50;
    DynamicJsonDocument doc(capacity);
    deserializeJson(doc, payload);
    settings_volume = doc["volume"]; // 500
    settings_wattage = doc["wattage"];
    settings_minTemp = doc["mintemp"]; // 90
    settings_maxTemp = doc["maxtemp"]; // 90
    //settings_desiredTemp = doc["desiredtemp"]; // 70
    Serial.println("Boiler volume set to "+String(settings_volume)+"l");
    Serial.println("Boiler wattage set to "+String(settings_wattage)+"W");
    Serial.println("Boiler minimum temperature set to "+String(settings_minTemp)+"°");
    Serial.println("Boiler maximum temperature set to "+String(settings_maxTemp)+"°");
    //Serial.println("Boiler desired temperature set to "+String(settings_desiredTemp)+"°");
  });

  // Subscribe to "P2H/___/commands" and display received message to Serial
  client.subscribe("P2H/"+topic+"/commands", [](const String & payload) {
    const size_t capacity = JSON_OBJECT_SIZE(1) + 20;
    DynamicJsonDocument doc(capacity);
    deserializeJson(doc, payload);
    commands_P2H = doc["P2H"]; // true or false
  });
}

void loop()
{  
  client.loop();
  
  myTime = timeClient.getEpochTime();
  
  if (myTime >= prevSensorTime + sensorInterval) { // check usedVolume
    //SIMULATIE AFKOELING
    data_temp *= 0.9999;

    // Set desired temp
    if (commands_P2H) {
      boilerDesiredTemp = settings_maxTemp;
    } else {
      timeCode = timeClient.getDay()*1440+timeClient.getHours()*60+timeClient.getMinutes();
      // loop through the profile
      for (int i = 0; i < 21; i++) {
        if (timeCode >= myProfile[i].time && myProfile[i].time < 10080) { //
          boilerDesiredTemp = myProfile[i].temp;
        }
      }
    }

    Serial.println("Desired temperature : "+ String(boilerDesiredTemp) + "°C");
    //Serial.println(boilerDesiredTemp);

    // Als de boiler aanstaat gaat de temperatuur volgens berekening omhoog
    if (data_power) {
      data_temp += tempRise(myTime-prevSensorTime);
    }
    
    prevSensorTime = timeClient.getEpochTime();
    
    //get data from sensors
    Wire.requestFrom(8,8);
    String payload = "";
    while (Wire.available()) {
      payload += (char)Wire.read();
    }
    usedVolume = payload.toFloat();
    //Serial.println(usedVolume);

    if (usedVolume > 0) { // Als er water verbruikt is kunnen we een exacte meting van de boiler doen
      tempOut = getTempOut();
      data_temp = (tempOut*((1.0*settings_volume)-usedVolume)+(tempIn*usedVolume))/settings_volume; // Temp updaten met instromende water
      data_volume += usedVolume; // Verbruikte water bijhouden
    }

    // Check of de boiler moet aan of uitstaan
    if ((data_temp + boilerWindow) < boilerDesiredTemp) {
      if (!data_power) {
        powerOn();
      }
    } else if (data_temp >= boilerDesiredTemp) {
      if (data_power) {
        powerOff();
      }
    }

    Serial.print("Boiler temperature: ");
    Serial.print(data_temp, 4);
    Serial.println("°C.");
  }

  if (myTime >= prevDataTime + dataInterval) {
    publishData();
  }

}

void publishData() {
  prevDataTime = timeClient.getEpochTime();
  data_timestamp = prevDataTime;
  data_charge = percentage();

  //initialize JSON
  const size_t capacity = JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(5) + 70;
  StaticJsonDocument<capacity> doc;
  
  JsonObject root = doc.to<JsonObject>();
  root["boilerID"] = BOILERID;
  JsonObject data = doc.createNestedObject("data");
  data["timestamp"] = data_timestamp;
  data["power"] = data_power;
  data["charge"] = String(data_charge, 2).toFloat(); //data_currentCharge;
  data["temp"] = String(data_temp, 2).toFloat(); //data_currentTemp;
  data["volume"] = String(data_volume, 2).toFloat(); //data_usedVolume;
  
  char buffer[256];
  serializeJson(doc, buffer, 256);
  client.publish("P2H/data", buffer); // You can activate the retain flag by setting the third parameter to true

  data_volume = 0.0; // verbruikte water terug op 0 zetten
}

void powerOn() {
  data_power = true;
  digitalWrite(D0, HIGH);
  publishData();  
}

void powerOff() {
  data_power = false;
  digitalWrite(D0, LOW);
  publishData();  
}

float getTempOut() {
  float temp = analogRead(A0)/1024.0*settings_maxTemp; // 1024 instead of 1023
  return temp;
}

float tempRise(long timeInterval) {
  float temp = (1.0*timeInterval*settings_wattage)/(1.0*settings_volume*CPWater);
  return temp;
}

float calcTemp() {
  float temp = boilerQ/(settings_volume*settings_wattage);
  return temp;
}

float percentage() {
  float percentage = (data_temp-settings_minTemp)/(settings_maxTemp-settings_minTemp)*100.0;
  percentage = max(percentage, (float)0.0); //
  //Serial.println(percentage);
  return percentage;
}
