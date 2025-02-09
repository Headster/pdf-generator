<?php

require 'config.php'; // Load API credentials

function generateJWT() {
    global $API_KEY, $API_SECRET, $WORKSPACE;

    // Create Header
    $header = json_encode(["alg" => "HS256", "typ" => "JWT"]);
    $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));

    // Create Payload
    $payload = json_encode([
        "iss" => $API_KEY,
        "sub" => $WORKSPACE,
        "exp" => time() + 60 // Expires in 60 seconds
    ]);
    $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

    // Create Signature
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $API_SECRET, true);
    $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    // Return JWT Token
    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

?>
