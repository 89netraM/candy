<?php
$post = json_decode(file_get_contents("php://input"), true);

if (isset($post["subscription"])) {
	$sub = $post["subscription"];
	$db = require "../db.php";
	
	$stmt = $db->prepare("INSERT INTO Subscribers (endpoint, p256dh, auth) VALUES (?, ?, ?)");
	$stmt->bind_param("sss", $endpoint, $p256dh, $auth);
	$endpoint = $sub["endpoint"];
	$p256dh = $sub["keys"]["p256dh"];
	$auth = $sub["keys"]["auth"];

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