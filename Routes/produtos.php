<?php
require_once __DIR__ . '/../config/database.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        echo json_encode(getProdutos());
        break;
    case 'POST':
        createProduto($input);
        break;
    case 'PUT':
        updateProduto($_GET['id'], $input);
        break;
    case 'DELETE':
        deleteProduto($_GET['id']);
        break;
}

function getProdutos() {
    $pdo = getConnection();
    $stmt = $pdo->query("SELECT * FROM produtos");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createProduto($data) {
    $pdo = getConnection();
    $stmt = $pdo->prepare("INSERT INTO produtos (nome, descricao, preco, quantidade_estoque, categoria_id, fornecedor_id) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data['nome'], $data['descricao'], $data['preco'], $data['quantidade_estoque'], $data['categoria_id'], $data['fornecedor_id']]);
    echo json_encode(["message" => "Produto criado com sucesso!"]);
}

function updateProduto($id, $data) {
    $pdo = getConnection();
    $stmt = $pdo->prepare("UPDATE produtos SET nome = ?, descricao = ?, preco = ?, quantidade_estoque = ?, categoria_id = ?, fornecedor_id = ? WHERE id = ?");
    $stmt->execute([$data['nome'], $data['descricao'], $data['preco'], $data['quantidade_estoque'], $data['categoria_id'], $data['fornecedor_id'], $id]);
    echo json_encode(["message" => "Produto atualizado com sucesso!"]);
}

function deleteProduto($id) {
    $pdo = getConnection();
    $stmt = $pdo->prepare("DELETE FROM produtos WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Produto excluído com sucesso!"]);
}
?>
