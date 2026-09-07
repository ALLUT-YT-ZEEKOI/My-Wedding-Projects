<?php

/**
 * Shared Vercel bootstrap. $laravelRoot must be set by the caller.
 */
error_reporting(E_ALL);
ini_set('display_errors', '1');

$defaults = [
    'APP_NAME' => 'My Wedding',
    'APP_ENV' => 'production',
    'APP_KEY' => 'base64:q8T8+aaiZJO4PvNuWKBmzoKLQFjkjaoATPOZZthT4L4=',
    'APP_DEBUG' => 'true',
    'APP_URL' => 'https://my-wedding-five-beta.vercel.app',
    'APP_VERSION' => '1.0.1',
    'APP_CONFIG_CACHE' => '/tmp/config.php',
    'APP_EVENTS_CACHE' => '/tmp/events.php',
    'APP_PACKAGES_CACHE' => '/tmp/packages.php',
    'APP_ROUTES_CACHE' => '/tmp/routes.php',
    'APP_SERVICES_CACHE' => '/tmp/services.php',
    'VIEW_COMPILED_PATH' => '/tmp/storage/framework/views',
    'CACHE_STORE' => 'array',
    'SESSION_DRIVER' => 'cookie',
    'QUEUE_CONNECTION' => 'sync',
    'LOG_CHANNEL' => 'stderr',
    'DB_CONNECTION' => 'sqlite',
    'DB_DATABASE' => '/tmp/database.sqlite',
    'FILESYSTEM_DISK' => 'local',
    'MAIL_MAILER' => 'log',
];

foreach ($defaults as $key => $value) {
    $current = getenv($key);
    if ($current === false || $current === '') {
        putenv("{$key}={$value}");
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

$writableDirs = [
    '/tmp/storage/app/public',
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/framework/views',
    '/tmp/storage/logs',
    '/tmp/views',
];

foreach ($writableDirs as $dir) {
    if (! is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
}

$database = getenv('DB_DATABASE') ?: '/tmp/database.sqlite';
if (! file_exists($database)) {
    @touch($database);
}

$envFile = $laravelRoot . '/.env';
$envSource = $laravelRoot . '/.env.vercel';
if (! is_file($envFile) && is_file($envSource)) {
    @copy($envSource, $envFile);
}

$autoload = $laravelRoot . '/vendor/autoload.php';

if (! is_file($autoload)) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo "Laravel vendor/autoload.php was not found.\n";
    echo 'Laravel root: ' . $laravelRoot . "\n";
    echo 'Root exists: ' . (is_dir($laravelRoot) ? 'yes' : 'no') . "\n";

    $projectRoot = dirname($laravelRoot);
    echo 'Project contents: ' . (is_dir($projectRoot) ? implode(', ', scandir($projectRoot)) : 'missing') . "\n";
    echo 'Laravel contents: ' . (is_dir($laravelRoot) ? implode(', ', scandir($laravelRoot)) : 'missing') . "\n";
    exit;
}

require $autoload;

/** @var \Illuminate\Foundation\Application $app */
$app = require $laravelRoot . '/bootstrap/app.php';
$app->useStoragePath('/tmp/storage');

$app->handleRequest(\Illuminate\Http\Request::capture());
