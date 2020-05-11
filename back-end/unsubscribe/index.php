<?php
$post = json_decode(file_get_contents("php://input"), true);

if (isset($post["endpoint"])) {
	$db = require "../db.php";
	
	$stmt = $db->prepare("DELETE FROM Subscribers WHERE endpoint = ?");
	$stmt->bind_param("s", $endpoint);
	$endpoint = $post["endpoint"];

	$stmt->execute();
	$stmt->close();
	
	$db->close();

	header("Content-Type: application/json");
	echo(json_encode(array(
		"success" => TRUE
	)));
}
else {
	http_response_code(400);
	header("Content-Type: application/json");
	echo(json_encode(array(
		"success" => FALSE
	)));
}
?>