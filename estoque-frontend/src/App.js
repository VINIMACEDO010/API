import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Home from './pages/Home';
import Categoria from './Pages/Categorias';
// futuramente: Fornecedor, Pedidos, Produtos

export default function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} to="/">Estoque</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav>
              <Nav.Link as={NavLink} to="/">Home</Nav.Link>
              <Nav.Link as={NavLink} to="/categoria">Categoria</Nav.Link>
              {/* Fornecedor, Pedidos, Produtos */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categoria" element={<Categoria />} />
          {/* <Route path="/fornecedor" element={<Fornecedor />} /> */}
        </Routes>
      </Container>
    </>
  );
}
