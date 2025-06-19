// src/App.js
import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

import Home         from './pages/Home';
import Categorias   from './pages/Categorias';
import Fornecedores from './pages/Fornecedores';
import Produtos     from './pages/Produtos';
import Pedidos      from './pages/Pedidos';

export default function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} to="/">Estoque</Navbar.Brand>
          <Navbar.Toggle aria-controls="nav-menu" />
          <Navbar.Collapse id="nav-menu">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/categorias">Categorias</Nav.Link>
              <Nav.Link as={NavLink} to="/fornecedores">Fornecedores</Nav.Link>
              <Nav.Link as={NavLink} to="/produtos">Produtos</Nav.Link>
              <Nav.Link as={NavLink} to="/pedidos">Pedidos</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categorias"   element={<Categorias />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
          <Route path="/produtos"     element={<Produtos />} />
          <Route path="/pedidos"      element={<Pedidos />} />
          {/* alias, se quiser */}
          <Route path="/categoria" element={<Categorias />} />
          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
    </>
  );
}
