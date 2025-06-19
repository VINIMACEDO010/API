<?php
// routes/pedidos.php
require_once __DIR__ . '/../config/database.php';
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$input  = json_decode(file_get_contents("php://input"), true);

switch ($method) {
  case 'GET':
    echo json_encode(getPedidos());
    break;
  case 'POST':
    if (empty($input['produto_id']) || !isset($input['quantidade'])) {
      http_response_code(400);
      echo json_encode(['erro'=>'Produto e quantidade são obrigatórios']);
      exit;
    }
    createPedido($input);
    break;
  case 'PUT':
    if (empty($input['id']) || empty($input['produto_id']) || !isset($input['quantidade'])) {
      http_response_code(400);
      echo json_encode(['erro'=>'ID, produto e quantidade são obrigatórios']);
      exit;
    }
    updatePedido($input['id'], $input);
    break;
  case 'DELETE':
    if (empty($input['id'])) {
      http_response_code(400);
      echo json_encode(['erro'=>'ID é obrigatório']);
      exit;
    }
    deletePedido($input['id']);
    break;
  default:
    http_response_code(405);
    echo json_encode(['erro'=>'Método não permitido']);
    break;
}

function getPedidos() {
  $pdo = getConnection();
  $stmt = $pdo->query("
    SELECT pd.*, pr.nome AS produto
      FROM pedidos pd
 LEFT JOIN produtos pr ON pr.id = pd.produto_id
   ORDER BY pd.id
  ");
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createPedido($d) {
  $pdo = getConnection();
  $stmt = $pdo->prepare("
    INSERT INTO pedidos (produto_id, quantidade)
    VALUES (?, ?)
  ");
  $stmt->execute([
    $d['produto_id'],
    $d['quantidade']
  ]);
  echo json_encode(['message'=>'Pedido criado com sucesso']);
}

function updatePedido($id, $d) {
  $pdo = getConnection();
  $stmt = $pdo->prepare("
    UPDATE pedidos SET produto_id=?, quantidade=?
    WHERE id=?
  ");
  $stmt->execute([
    $d['produto_id'],
    $d['quantidade'],
    $id
  ]);
  echo json_encode(['message'=>'Pedido atualizado com sucesso']);
}

function deletePedido($id) {
  $pdo = getConnection();
  $stmt = $pdo->prepare("DELETE FROM pedidos WHERE id = ?");
  $stmt->execute([$id]);
  echo json_encode(['message'=>'Pedido excluído com sucesso']);
}
