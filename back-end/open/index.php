<?php
require __DIR__ . '/../vendor/autoload.php';
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;

$post = json_decode(file_get_contents("php://input"), true);

if (isset($post["message"])) {
	$msg = $post["message"];
	$msg["date"] = round(microtime(TRUE) * 1000);
	$db = require "../db.php";
	
	$stmt = $db->prepare("INSERT INTO Messages (candyType, opener, image, date) VALUES (?, ?, ?, " . $msg["date"] . ")");
	$stmt->bind_param("sss", $candyType, $opener, $image);
	$candyType = $msg["candyType"];
	$opener = $msg["opener"];
	if (isset($msg["image"])) {
		$image = $msg["image"];
	}
	else {
		$image = NULL;
	}

	$stmt->execute();
	$stmt->close();

	{
		$vapid = array(
			"VAPID" => array(
				"subject" => "https://github.com/89netraM/candy",
				"publicKey" => (require "../keys/public.php"),
				"privateKey" => (require "../keys/private.php")
			)
		);
		$webPush = new WebPush($vapid);

		$sql = "SELECT endpoint, p256dh, auth FROM Subscribers";
		$result = $db->query($sql);

		if ($result->num_rows > 0) {
			while ($row = $result->fetch_assoc()) {
				$webPush->sendNotification($row["endpoint"], json_encode($msg), $row["p256dh"], $row["auth"]);
			}
			while ($r = $webPush->flush()) { }
		}
	}

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