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
    case 'PUT':
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(["erro" => "ID da categoria não informado no JSON."]);
            exit;
        }
        updateCategoria($input['id'], $input);
        break;
    case 'DELETE':
        if (!isset($input['id'])) {
            http_response_code(400);
            echo json_encode(["erro" => "ID da categoria não informado no JSON."]);
            exit;
        }
        deleteCategoria($input['id']);
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

function updateCategoria($id, $data) {
    $pdo = getConnection();
    $stmt = $pdo->prepare("UPDATE categorias SET nome = ? WHERE id = ?");
    $stmt->execute([$data['nome'], $id]);
    echo json_encode(["message" => "Categoria atualizada com sucesso!"]);
}

function deleteCategoria($id) {
    $pdo = getConnection();
    $stmt = $pdo->prepare("DELETE FROM categorias WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Categoria excluída com sucesso!"]);
}
