<?php
require_once __DIR__ . '/../config/database.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        echo json_encode(getCategorias());
        break;
    case 'POST':
        createCategoria($input);
        break;
}

function getCategorias() {
    $pdo = getConnection();
    $stmt = $pdo->query("SELECT * FROM categorias");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createCategoria($data) {
    $pdo = getConnection();
    $stmt = $pdo->prepare("INSERT INTO categorias (nome) VALUES (?)");
    $stmt->execute([$data['nome']]);
    echo json_encode(["message" => "Categoria criada com sucesso!"]);
}
?>
