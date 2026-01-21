<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  echo json_encode(['success' => false, 'error' => 'Invalid request method']);
  exit;
}

// Read JSON body
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!is_array($data)) {
  echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
  exit;
}

// Sanitize & validate
$name = trim(strip_tags($data['name'] ?? ''));
$email = trim($data['email'] ?? '');
$phone = trim(strip_tags($data['phone'] ?? ''));
$message = trim(strip_tags($data['message'] ?? ''));

if ($name === '' || $email === '' || $message === '') {
  echo json_encode(['success' => false, 'error' => 'Missing required fields']);
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  echo json_encode(['success' => false, 'error' => 'Invalid email address']);
  exit;
}

// ✅ Your email here
$to = "okerekehelenugoeze@gmail.com";
$subject = "New Contact Message from Portfolio";

// Build message
$body =
"You have received a new message from your portfolio.\n\n" .
"Name: {$name}\n" .
"Email: {$email}\n" .
"Phone: {$phone}\n\n" .
"Message:\n{$message}\n";

// Best-practice headers (helps deliverability)
$domain = $_SERVER['SERVER_NAME'] ?? 'localhost';
$from = "no-reply@{$domain}";

$headers = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-Type: text/plain; charset=UTF-8";
$headers[] = "From: Portfolio Contact <{$from}>";
$headers[] = "Reply-To: {$name} <{$email}>";
$headers[] = "X-Mailer: PHP/" . phpversion();

$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'error' => 'Server could not send email (mail() failed).']);
}
