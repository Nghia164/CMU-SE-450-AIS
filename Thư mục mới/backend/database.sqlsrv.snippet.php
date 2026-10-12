<?php
/*
Add/confirm this connection inside config/database.php.
Recent Laravel versions already include a sqlsrv connection by default.
*/

'sqlsrv' => [
    'driver' => 'sqlsrv',
    'url' => env('DB_URL'),
    'host' => env('DB_HOST', '127.0.0.1'),
    'port' => env('DB_PORT', '1433'),
    'database' => env('DB_DATABASE', 'SmartScheduling'),
    'username' => env('DB_USERNAME', 'sa'),
    'password' => env('DB_PASSWORD', ''),
    'charset' => env('DB_CHARSET', 'utf8'),
    'prefix' => '',
    'prefix_indexes' => true,
    'encrypt' => env('DB_ENCRYPT', 'yes'),
    'trust_server_certificate' => env('DB_TRUST_SERVER_CERTIFICATE', 'true'),
];
