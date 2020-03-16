<?php
$MyUsername = "devuser";  // mysql gebruikersnaam
$MyPassword = "devpass";  // mysql wachtwoord
$MyHostname = "db";      // dit is meestal "localhost" tenzij mysql op een andere server staat
// hostname = db => zo opgegeven in de dockerfile
$MyDatabase = "power2heat_db";

#phpinfo();

$link = mysqli_connect($MyHostname, $MyUsername, $MyPassword, $MyDatabase, 3306);

if (!$link) {
    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

#echo "Success: A proper connection to MySQL was made! The my_db database is great." . PHP_EOL;
#echo "Host information: " . mysqli_get_host_info($link) . PHP_EOL;

#mysqli_close($link);
?>