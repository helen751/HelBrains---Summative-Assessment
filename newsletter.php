<?php
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

$postData = http_build_query([
    'email' => $email,
    'key'   => 'HELBRAINS_SERVER_ONLY_KEY'
]);

$ch = curl_init('https://script.google.com/macros/s/AKfycbxg6XT2PJzRIntvDmkwOJSN0TsGj_CSfGAAq6xjwpVGB4ce0G9B7L_56TNVcAW-99TI/exec');

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $postData,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/x-www-form-urlencoded'
    ],
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_TIMEOUT        => 10
]);

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode(['success' => false, 'message' => 'Network error']);
    exit;
}

curl_close($ch);

// pass Google response directly
echo $response;

?>