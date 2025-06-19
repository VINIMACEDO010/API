import React from 'react';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const cards = [
    { title: 'Categorias',   path: '/categorias',     text: 'Gerenciar categorias' },
    { title: 'Fornecedores', path: '/fornecedores',   text: 'Gerenciar fornecedores' },
    { title: 'Produtos',     path: '/produtos',       text: 'Gerenciar produtos' },
    { title: 'Pedidos',      path: '/pedidos',        text: 'Gerenciar pedidos' },
  ];

  return (
    <Container className="mt-4">
      {/* Cabeçalho */}
      <header className="mb-5 text-center">
        <h1>API - Estoque</h1>
        <p className="text-muted">Alunos: Vinicius Macedo e Misael Sardá</p>
      </header>

      {/* Cards de navegação */}
      <Row xs={1} md={2} lg={4} className="g-4">
        {cards.map(c => (
          <Col key={c.path}>
            <Card className="h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title>{c.title}</Card.Title>
                <Card.Text className="flex-grow-1">{c.text}</Card.Text>
                <Button 
                  variant="primary" 
                  onClick={() => navigate(c.path)}
                >
                  Acessar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
