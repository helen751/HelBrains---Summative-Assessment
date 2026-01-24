<?php
// Always return JSON
header('Content-Type: application/json; charset=utf-8');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit;
}

// Get and sanitize email
$email = strtolower(trim($_POST['email'] ?? ''));

if ($email === '') {
    echo json_encode([
        'success' => false,
        'message' => 'Email is required'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address'
    ]);
    exit;
}

// Google Apps Script endpoint
$endpoint = 'https://script.google.com/macros/s/AKfycbwhPKJMNoixou4_LeIwON05tdnMFjvGtnlZdMImbjyqA6CYcKC2U-HifUrc9sr5eZQP/exec';

// Payload sent to Google
$payload = [
    'email'  => $email,
    'source' => 'Website Newsletter',
    'key'    => 'HELBRAINS_SERVER_ONLY_KEY'
];

// Init cURL
$ch = curl_init($endpoint);

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => http_build_query($payload), // IMPORTANT
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/x-www-form-urlencoded'
    ],
    CURLOPT_FOLLOWLOCATION => true,   // 🔥 REQUIRED FOR GOOGLE
    CURLOPT_TIMEOUT        => 10,
    CURLOPT_SSL_VERIFYPEER => true
]);

$response = curl_exec($ch);

// cURL-level error
if ($response === false) {
    echo json_encode([
        'success' => false,
        'message' => 'Network error. Please try again later.',
        'detail'  => curl_error($ch)
    ]);
    curl_close($ch);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Google did not accept request
if ($httpCode !== 200) {
    echo json_encode([
        'success' => false,
        'message' => 'Subscription service error'
    ]);
    exit;
}

// Success (pass Google response through)
echo $response;
