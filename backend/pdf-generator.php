<?php

require 'jwt.php'; // Include JWT generator

$jwt_token = generateJWT(); // Get a new JWT token

$curl = curl_init();

$data = [
    "template" => [
        "id" => "1327203",
        "data" => [
            "date" => "2025-02-07",
            "image" => "https://png.pngtree.com/png-clipart/20230423/original/pngtree-travel-logo-design-template-for-business-and-company-png-image_9077410.png",
            "signature_name" => "John Doe",
            "student_name" => "Mario Rossi",
            "subject" => "Lorem Ipsum"
        ]
    ],
    "format" => "pdf",
    "output" => "url",
    "name" => "Certificate Example"
];

$jsonData = json_encode($data);

curl_setopt_array($curl, [
    CURLOPT_URL => "https://us1.pdfgeneratorapi.com/api/v4/documents/generate",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
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
    echo "cURL Error #:" . $err;
} else {
    $response = stripslashes($response); // Remove escaped slashes
    echo $response;
}

?>