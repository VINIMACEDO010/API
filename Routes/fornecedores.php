<?php
$method = $_SERVER['REQUEST_METHOD'];
$input  = json_decode(file_get_contents("php://input"), true);

switch ($method) {
  case 'GET':
    echo json_encode(getFornecedores());
    break;
  case 'POST':
    if (empty($input['nome'])) {
      http_response_code(400);
      echo json_encode(['erro'=>'Campo nome é obrigatório']);
      exit;
    }
    createFornecedor($input);
    break;
  case 'PUT':
    if (empty($input['id'])||empty($input['nome'])) {
      http_response_code(400);
      echo json_encode(['erro'=>'ID e nome são obrigatórios']);
      exit;
    }
    updateFornecedor($input['id'], $input);
    break;
  case 'DELETE':
    if (empty($input['id'])) {
      http_response_code(400);
      echo json_encode(['erro'=>'ID é obrigatório']);
      exit;
    }
    deleteFornecedor($input['id']);
    break;
  default:
    http_response_code(405);
    echo json_encode(['erro'=>'Método não permitido']);
    break;
}

function getFornecedores() {
  $pdo = getConnection();
  $stmt = $pdo->query("SELECT * FROM fornecedores ORDER BY id");
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function createFornecedor($data) {
  $pdo = getConnection();
  $stmt = $pdo->prepare("
    INSERT INTO fornecedores (nome, telefone, email)
    VALUES (?, ?, ?)
  ");
  $stmt->execute([
    $data['nome'],
    $data['telefone'] ?? null,
    $data['email']    ?? null
  ]);
  echo json_encode(['message'=>'Fornecedor criado com sucesso']);
}

function updateFornecedor($id, $data) {
  $pdo = getConnection();
  $stmt = $pdo->prepare("
    UPDATE fornecedores
       SET nome=?, telefone=?, email=?
     WHERE id=?
  ");
  $stmt->execute([
    $data['nome'],
    $data['telefone'] ?? null,
    $data['email']    ?? null,
    $id
  ]);
  echo json_encode(['message'=>'Fornecedor atualizado com sucesso']);
}

function deleteFornecedor($id) {
  $pdo = getConnection();
  $stmt = $pdo->prepare("DELETE FROM fornecedores WHERE id = ?");
  $stmt->execute([$id]);
  echo json_encode(['message'=>'Fornecedor excluído com sucesso']);
}
