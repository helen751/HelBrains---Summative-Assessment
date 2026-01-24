<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$email = strtolower(trim($_POST['email'] ?? ''));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email']);
    exit;
}

// 🔐 Server-only secret (NOT in JS)
$payload = [
    'email'  => $email,
    'source' => 'Website Newsletter',
    'key'    => 'HELBRAINS_SERVER_ONLY_KEY'
];

$ch = curl_init('https://script.google.com/macros/s/AKfycbwhPKJMNoixou4_LeIwON05tdnMFjvGtnlZdMImbjyqA6CYcKC2U-HifUrc9sr5eZQP/exec');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_TIMEOUT        => 10
]);

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode(['success' => false, 'message' => 'Server error']);
    exit;
}

curl_close($ch);
echo $response;
