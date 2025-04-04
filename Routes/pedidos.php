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
}

function getPedidos() {
    $pdo = getConnection();
    $stmt = $pdo->query("SELECT * FROM pedidos");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createPedido($data) {
    $pdo = getConnection();
    $stmt = $pdo->prepare("INSERT INTO pedidos (produto_id, quantidade) VALUES (?, ?)");
    $stmt->execute([$data['produto_id'], $data['quantidade']]);

    // Atualiza o estoque
    $update = $pdo->prepare("UPDATE produtos SET quantidade_estoque = quantidade_estoque - ? WHERE id = ?");
    $update->execute([$data['quantidade'], $data['produto_id']]);

    echo json_encode(["message" => "Pedido criado e estoque atualizado!"]);
}
?>
