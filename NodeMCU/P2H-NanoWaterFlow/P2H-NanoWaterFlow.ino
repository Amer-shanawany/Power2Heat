#include <Wire.h>

// defines pins numbers
const int potentiometer = A0;

// defines const
const uint16_t sensorInterval = 1000;

const uint8_t maxFlow = 30; //max flow = 30 l/min

// defines variables
long prevSensorTime;
long prevWireTime;
uint16_t analogValue;
double waterFlow; // current water flow l/min
double totalWaterFlow; // total water flow l/min

void setup() {
  Serial.begin(9600); // Starts the serial communication

  // I2C setup
  Wire.begin(8);                // join i2c bus with address #8
  Wire.onRequest(requestEvent);

  // set pins
  pinMode(potentiometer, INPUT);
}

void loop() {

  if (millis() > prevSensorTime + sensorInterval) {
    prevSensorTime = millis();

    analogValue = analogRead(potentiometer);
    waterFlow = analogValue*1.0/1023*maxFlow;
    
    totalWaterFlow += waterFlow/(60.0*sensorInterval/1000.0);

    Serial.print(waterFlow);
    Serial.println("l/min");
  }

}

void requestEvent() {
  Serial.println("Receiving I2C request");

  Serial.print("Total waterflow in last period: ");
  Serial.print(totalWaterFlow);
  Serial.println("l");
  
  //String msg = String(totalWaterFlow);
  char buf[8];
  Serial.println(dtostrf(totalWaterFlow, 8, 2, buf));
  Wire.write(dtostrf(totalWaterFlow, 8, 2, buf));
  //Wire.print(msg);

  totalWaterFlow = 0;
}
