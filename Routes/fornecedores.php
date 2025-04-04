<?php
require_once __DIR__ . '/../config/database.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        echo json_encode(getFornecedores());
        break;
    case 'POST':
        createFornecedor($input);
        break;
}

function getFornecedores() {
    $pdo = getConnection();
    $stmt = $pdo->query("SELECT * FROM fornecedores");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createFornecedor($data) {
    $pdo = getConnection();
    $stmt = $pdo->prepare("INSERT INTO fornecedores (nome, telefone, email) VALUES (?, ?, ?)");
    $stmt->execute([$data['nome'], $data['telefone'], $data['email']]);
    echo json_encode(["message" => "Fornecedor criado com sucesso!"]);
}
?>
