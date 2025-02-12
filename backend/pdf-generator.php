<?php

require 'jwt.php'; // Include JWT generator

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

$jwt_token = generateJWT(); // Get a new JWT token

global $DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME;

$conn = new mysqli($DB_HOST, $DB_USERNAME, $DB_PASSWORD, $DB_NAME);
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Invalid request method"]);
    exit;
}

$requiredFields = ['template_id', 'date', 'signature_name', 'student_name', 'subject', 'format', 'certificate_name'];

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
$template_id = htmlspecialchars($_POST['template_id']);// Prevent XSS
$certificate_date = htmlspecialchars($_POST['date']);
$signature_name = htmlspecialchars($_POST['signature_name']);
$student_name = htmlspecialchars($_POST['student_name']);
$subject = htmlspecialchars($_POST['subject']);
$certificate_name = htmlspecialchars($_POST['certificate_name']);

$data = [
    "template" => [
        "id" => $template_id,
        "data" => [
            "date" => $certificate_date,
            "image" => "data:$fileType;base64,$base64Image",
            "signature_name" => $signature_name,
            "student_name" => $student_name,
            "subject" => $subject
        ]
    ],
    "format" => $format,
    "output" => "url",
    "name" => $certificate_name
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

$responseData = json_decode($response, true);

if (isset($responseData["response"])) {
    $file_url = $responseData["response"];

    $stmt = $conn->prepare("INSERT INTO certificates (template_id, student_name, subject, certificate_name, file_url, certificate_image, format, certificate_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->bind_param("ssssssss", $template_id, $student_name, $subject, $certificate_name, $file_url, $base64Image, $format, $certificate_date);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => "Certificate generated and saved successfully!",
            "file_url" => $file_url
        ]);
    } else {
        echo json_encode(["error" => "Certificate generated but failed to save in database"]);
    }

    $stmt->close();
} else {
    echo json_encode(["error" => "Failed to generate certificate"]);
}

$conn->close();

?>
