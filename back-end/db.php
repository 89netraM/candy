<?php
$server = "127.0.0.1";
$username = "root";
$password = "";
$dbName = "candy";

$conn = new mysqli($server, $username, $password, $dbName);

if ($conn->connect_error) {
	http_response_code(500);
	die();
}
else {
	return $conn;
}
?>