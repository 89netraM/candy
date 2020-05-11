<?php
$db = require "../db.php";

$sql = "SELECT candyType, opener, image, date FROM Messages";
$result = $db->query($sql);

$data = array();
if ($result->num_rows > 0) {
	while ($row = $result->fetch_assoc()) {
		array_push(
			$data,
			array(
				"candyType" => $row["candyType"],
				"opener" => $row["opener"],
				"image" => $row["image"],
				"date" => (double)$row["date"]
			)
		);
	}
}

$db->close();

header("Content-Type: application/json");
echo(json_encode($data));
?>