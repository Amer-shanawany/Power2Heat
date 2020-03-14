#include <UIPEthernet.h> // Voor Ethernet

// **** ETHERNET INSTELLINGEN ****
byte mac[] = { 0x54, 0x34, 0x41, 0x30, 0x30, 0x31 };                                       
IPAddress ip(192, 168, 3, 3);                        
EthernetServer server(80);

void setup() {
  Serial.begin(9600);

  // start de Ethernet verbinding en de server:
  Ethernet.begin(mac, ip);
  server.begin();

  Serial.print("IP Adres          : ");
  Serial.println(Ethernet.localIP());
  Serial.print("Subnet Mask       : ");
  Serial.println(Ethernet.subnetMask());
  Serial.print("Default Gateway IP: ");
  Serial.println(Ethernet.gatewayIP());
  Serial.print("DNS Server IP     : ");
  Serial.println(Ethernet.dnsServerIP());
}

void loop() {
  // listen for incoming clients
  EthernetClient client = server.available();

  if (client) 
  {  
    Serial.println("-> Nieuwe Verbinding");

    // een http request eindigt met een lege regel
    boolean currentLineIsBlank = true;

    while (client.connected()) 
    {
      if (client.available()) 
      {
        char c = client.read();

        // als je aan het einde van een regel bent (newline karakter ontvangen)
        // en de regel is leeg, dan zijn we aan het einde van een HTTP request gekomen,
        // en kunnen we een antwoord sturen
        if (c == '\n' && currentLineIsBlank) 
        {
          client.println("<html><title>Hallo Wereld!</title><body><h3>Hallo Wereld!</h3></body>");
          break;
        }

        if (c == '\n') {
          // We beginnen met een nieuwe regel
          currentLineIsBlank = true;
        }
        else if (c != '\r') 
        {
          // we ontvingen een karakter (niet einde regel)
          currentLineIsBlank = false;
        }
      } 
    }

    // geef de browser tijd om de data te ontvangen
    delay(10);

    // sluit de verbinding:
    client.stop();
    Serial.println("   Einde verbinding\n");
  }
}
