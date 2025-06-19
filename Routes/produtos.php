<?php
// routes/produtos.php
require_once __DIR__ . '/../config/database.php';
header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$input  = json_decode(file_get_contents("php://input"), true);

switch ($method) {
  case 'GET':
    echo json_encode(getProdutos());
    break;
  case 'POST':
    if (empty($input['nome']) || !isset($input['preco']) || !isset($input['quantidade_estoque'])) {
      http_response_code(400);
      echo json_encode(['erro'=>'Nome, preço e quantidade são obrigatórios']);
      exit;
    }
    createProduto($input);
    break;
  case 'PUT':
    if (empty($input['id']) || empty($input['nome']) || !isset($input['preco']) || !isset($input['quantidade_estoque'])) {
      http_response_code(400);
      echo json_encode(['erro'=>'ID, nome, preço e quantidade são obrigatórios']);
      exit;
    }
    updateProduto($input['id'], $input);
    break;
  case 'DELETE':
    if (empty($input['id'])) {
      http_response_code(400);
      echo json_encode(['erro'=>'ID é obrigatório']);
      exit;
    }
    deleteProduto($input['id']);
    break;
  default:
    http_response_code(405);
    echo json_encode(['erro'=>'Método não permitido']);
    break;
}

function getProdutos() {
  $pdo = getConnection();
  $stmt = $pdo->query("
    SELECT p.*, c.nome AS categoria, f.nome AS fornecedor
      FROM produtos p
 LEFT JOIN categorias c ON c.id = p.categoria_id
 LEFT JOIN fornecedores f ON f.id = p.fornecedor_id
   ORDER BY p.id
  ");
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createProduto($d) {
  $pdo = getConnection();
  $stmt = $pdo->prepare("
    INSERT INTO produtos
      (nome, descricao, preco, quantidade_estoque, categoria_id, fornecedor_id)
    VALUES (?, ?, ?, ?, ?, ?)
  ");
  $stmt->execute([
    $d['nome'],
    $d['descricao']         ?? null,
    $d['preco'],
    $d['quantidade_estoque'],
    $d['categoria_id']      ?? null,
    $d['fornecedor_id']     ?? null
  ]);
  echo json_encode(['message'=>'Produto criado com sucesso']);
}

function updateProduto($id, $d) {
  $pdo = getConnection();
  $stmt = $pdo->prepare("
    UPDATE produtos SET
      nome=?, descricao=?, preco=?, quantidade_estoque=?, categoria_id=?, fornecedor_id=?
    WHERE id=?
  ");
  $stmt->execute([
    $d['nome'],
    $d['descricao']         ?? null,
    $d['preco'],
    $d['quantidade_estoque'],
    $d['categoria_id']      ?? null,
    $d['fornecedor_id']     ?? null,
    $id
  ]);
  echo json_encode(['message'=>'Produto atualizado com sucesso']);
}

function deleteProduto($id) {
  $pdo = getConnection();
  $stmt = $pdo->prepare("DELETE FROM produtos WHERE id = ?");
  $stmt->execute([$id]);
  echo json_encode(['message'=>'Produto excluído com sucesso']);
}
