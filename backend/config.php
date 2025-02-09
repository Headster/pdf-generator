<?php

function getEnvValue($key, $default = null) {
    $envFile = __DIR__ . '/.env';
    
    if (!file_exists($envFile)) {
        return $default;
    }

    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($envKey, $envValue) = explode('=', $line, 2);
        if (trim($envKey) === $key) {
            return trim($envValue);
        }
    }

    return $default;
}

// Load credentials
$API_KEY = getEnvValue('API_KEY');
$API_SECRET = getEnvValue('API_SECRET');
$WORKSPACE = getEnvValue('WORKSPACE');
?>
