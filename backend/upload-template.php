<?php
require 'jwt.php'; // Include JWT generator for authentication

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}

$jsonData = file_get_contents("php://input");
if (empty($jsonData)) {
    echo json_encode(["error" => "No JSON data received"]);
    exit;
}

$decodedData = json_decode($jsonData, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(["error" => "Invalid JSON format"]);
    exit;
}

$jwt_token = generateJWT(); // Get a new JWT token

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://us1.pdfgeneratorapi.com/api/v4/templates",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode($decodedData),
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
    echo stripslashes($response); // Remove escaped slashes
}
