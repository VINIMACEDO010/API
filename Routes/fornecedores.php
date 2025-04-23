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
    case 'PUT':
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(["erro" => "ID do fornecedor não informado no JSON."]);
            exit;
        }
        updateFornecedor($input['id'], $input);
        break;
    case 'DELETE':
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(["erro" => "ID do fornecedor não informado no JSON."]);
            exit;
        }
        deleteFornecedor($input['id']);
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

function updateFornecedor($id, $data) {
    $pdo = getConnection();
    $stmt = $pdo->prepare("UPDATE fornecedores SET nome = ?, telefone = ?, email = ? WHERE id = ?");
    $stmt->execute([$data['nome'], $data['telefone'], $data['email'], $id]);
    echo json_encode(["message" => "Fornecedor atualizado com sucesso!"]);
}

function deleteFornecedor($id) {
    $pdo = getConnection();
    $stmt = $pdo->prepare("DELETE FROM fornecedores WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Fornecedor excluído com sucesso!"]);
}
