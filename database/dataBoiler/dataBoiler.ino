#include <UIPEthernet.h> // Used for Ethernet

// **** ETHERNET SETTING ****
// Arduino Uno pins: 10 = CS, 11 = MOSI, 12 = MISO, 13 = SCK
// Ethernet MAC address - must be unique on your network - MAC Reads T4A001 in hex (unique in your network)
IPAddress ip(192, 168, 3, 3);   
byte mac[] = { 0x54, 0x34, 0x41, 0x30, 0x30, 0x31 };
byte nameserver[] = { 192, 168, 1, 1};                                     
// For the rest we use DHCP (IP address and such)

EthernetClient client;
char server[] = "192.168.1.45"; // IP Adres (or name) of server to dump data to
int  interval = 10000; // Wait between dumps

void setup() {

  Serial.begin(9600);
  Ethernet.begin(mac, ip, nameserver);

  Serial.print("IP Address        : ");
  Serial.println(Ethernet.localIP());
  Serial.print("Subnet Mask       : ");
  Serial.println(Ethernet.subnetMask());
  Serial.print("Default Gateway IP: ");
  Serial.println(Ethernet.gatewayIP());
  Serial.print("DNS Server IP     : ");
  Serial.println(Ethernet.dnsServerIP());
}

void loop() {
  // if you get a connection, report back via serial:
  if (client.connect(server, 8100)) {
    Serial.println("-> Connected");
    // Make a HTTP request:
    client.print("GET /add_data.php?");
    client.print("serial=");
    client.print( "288884820500006X" );
    client.print("&");
    client.print("temperature=");
    client.print( "12.3");
    client.print( " HTTP/1.1\r\n");
    client.print( "Host: " );
    client.print(server);
    client.print("\r\n");
    client.print("User-Agent: arduino-ethernet\r\n");
    client.print( "Connection: close\r\n" );
    client.print("\r\n");
    //client.println();
    client.stop();
  }
  else {
    // you didn't get a connection to the server:
    Serial.println("--> connection failed/n");
  }

  delay(interval);
}
