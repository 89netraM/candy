<?php
header("Content-Type: application/json");
$data = array(
	"key" => require "../keys/public.php"
);
echo(json_encode($data));
?>