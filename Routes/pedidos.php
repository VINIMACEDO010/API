<?php
require_once __DIR__ . '/../config/database.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

switch ($method) {
    case 'GET':
        echo json_encode(getPedidos());
        break;
    case 'POST':
        createPedido($input);
        break;
        case 'PUT':
        updatePedido($input);
        break;
    case 'DELETE':
        deletePedido($_GET['id']);
        break;
}

function getPedidos() {
    $pdo = getConnection();
    $stmt = $pdo->query("SELECT * FROM pedidos");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createPedido($data) {
    $pdo = getConnection();
    $stmt = $pdo->prepare("INSERT INTO pedidos (produto_id, quantidade, data_pedido) VALUES (?, ?, ?)");
    $stmt->execute([$data['produto_id'], $data['quantidade'], $data['data_pedido']]);
    echo json_encode(["message" => "Pedido criado com sucesso!"]);
}

function updatePedido($data) {
    $pdo = getConnection();
    $stmt = $pdo->prepare("UPDATE pedidos SET produto_id = ?, quantidade = ?, data_pedido = ? WHERE id = ?");
    $stmt->execute([
        $data['produto_id'],
        $data['quantidade'],
        $data['data_pedido'],
        $data['id']
    ]);
    echo json_encode(["message" => "Pedido atualizado com sucesso!"]);
}

function deletePedido($id) {
    $pdo = getConnection();
    $stmt = $pdo->prepare("DELETE FROM pedidos WHERE id = ?");
    $stmt->execute([$id]);
    echo json_encode(["message" => "Pedido excluído com sucesso!"]);
}
