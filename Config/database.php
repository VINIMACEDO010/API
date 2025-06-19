<?php
// config/database.php
define('DB_HOST', 'localhost');
define('DB_NAME', 'apiestoque');
define('DB_USER', 'postgres');
define('DB_PASS', 'admin');

function getConnection() {
    try {
        return new PDO(
            "pgsql:host=".DB_HOST.";dbname=".DB_NAME,
            DB_USER,
            DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Erro na conexão: ".$e->getMessage()]);
        exit;
    }
}
