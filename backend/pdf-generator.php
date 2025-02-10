<?php

require 'jwt.php'; // Include JWT generator

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$jwt_token = generateJWT(); // Get a new JWT token

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}

$requiredFields = ['date', 'signature_name', 'student_name', 'subject'];

foreach ($requiredFields as $field) {
    if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
        echo json_encode(["error" => "Missing or empty field: $field"]);
        exit;
    }
}

$allowedFormats = ["pdf", "html", "xlsx", "zip"];
$format = strtolower(trim($_POST['format']));

if (!in_array($format, $allowedFormats)) {
    echo json_encode(["error" => "Invalid format selected. Allowed formats: PDF, HTML, XLSX, ZIP."]);
    exit;
}

if (!isset($_FILES['image'])) {
    echo json_encode(["error" => "No image uploaded"]);
    exit;
}

$image = $_FILES['image'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

$fileType = mime_content_type($image['tmp_name']);
if (!in_array($fileType, $allowedTypes)) {
    echo json_encode(["error" => "Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP)."]);
    exit;
}

$maxFileSize = 5 * 1024 * 1024; // Max file size 5MB
if ($image['size'] > $maxFileSize) {
    echo json_encode(["error" => "File too large. Maximum size is 5MB."]);
    exit;
}

$imageContent = file_get_contents($image['tmp_name']);
$base64Image = base64_encode($imageContent);

$data = [
    "template" => [
        "id" => "1327203",
        "data" => [
            "date" => htmlspecialchars($_POST['date']), // Prevent XSS
            "image" => "data:$fileType;base64,$base64Image",
            "signature_name" => htmlspecialchars($_POST['signature_name']),
            "student_name" => htmlspecialchars($_POST['student_name']),
            "subject" => htmlspecialchars($_POST['subject'])
        ]
    ],
    "format" => $format,
    "output" => "url",
    "name" => "Certificate Example"
];

$jsonData = json_encode($data);

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://us1.pdfgeneratorapi.com/api/v4/documents/generate",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => $jsonData,
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

?>
