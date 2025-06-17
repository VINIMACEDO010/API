import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  const cards = [
    { title: 'Categoria', path: '/categoria', text: 'Gerenciar categorias' },
    { title: 'Fornecedor', path: '/fornecedor', text: 'Gerenciar fornecedores' },
    { title: 'Pedidos', path: '/pedidos', text: 'Gerenciar pedidos' },
    { title: 'Produtos', path: '/produtos', text: 'Gerenciar produtos' },
  ];

  return (
    <Row xs={1} md={2} lg={4} className="g-4">
      {cards.map(c => (
        <Col key={c.path}>
          <Card>
            <Card.Body>
              <Card.Title>{c.title}</Card.Title>
              <Card.Text>{c.text}</Card.Text>
              <Button as={Link} to={c.path} variant="primary">Acessar</Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
