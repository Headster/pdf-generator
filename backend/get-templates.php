<?php

require 'jwt.php'; // Include JWT generator

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

$jwt_token = generateJWT(); // Generate JWT token

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://us1.pdfgeneratorapi.com/api/v4/templates",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer " . $jwt_token,
        "Content-Type: application/json"
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
    echo json_encode(["error" => "cURL Error: " . $err]);
} else {
    echo stripslashes($response);
}

?>