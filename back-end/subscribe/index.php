<?php
$post = json_decode(file_get_contents("php://input"), true);

if (isset($post["subscription"])) {
	$sub = $post["subscription"];
	$db = require "../db.php";
	
	$stmt = $db->prepare("INSERT INTO Subscribers (endpoint, p256dh, auth) VALUES (?, ?, ?)");
	$stmt->bind_param("sss", $endpoint, $p256dh, $auth);
	$endpoint = $sub["endpoint"];
	$p256dh = substr($sub["keys"]["p256dh"] . "====", 0, 88);
	$auth = substr($sub["keys"]["auth"] . "====", 0, 24);

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