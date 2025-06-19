<?php
require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD']==='OPTIONS') {
  http_response_code(200);
  exit;
}

$rota = $_GET['rota'] ?? '';
switch ($rota) {
  case 'categorias':
    require __DIR__ . '/../routes/categorias.php';
    break;
  case 'fornecedores':
    require __DIR__ . '/../routes/fornecedores.php';
    break;
  case 'produtos':
    require __DIR__ . '/../routes/produtos.php';
    break;
  case 'pedidos':
    require __DIR__ . '/../routes/pedidos.php';
    break;
  default:
    http_response_code(404);
    echo json_encode(['erro'=>'Rota não encontrada']);
    break;
}
