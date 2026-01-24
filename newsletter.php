<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$email = strtolower(trim($_POST['email'] ?? ''));

if (!$email) {
    echo json_encode(['success' => false, 'message' => 'Email is required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// 🔐 SECRET ONLY LIVES HERE
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
    echo json_encode([
        'success' => false,
        'message' => 'Could not connect to subscription service'
    ]);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo json_encode([
        'success' => false,
        'message' => 'Subscription service error'
    ]);
    exit;
}

// Pass through Google response
echo $response;
 
?>
