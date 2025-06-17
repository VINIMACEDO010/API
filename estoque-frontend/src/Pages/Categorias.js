import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import api from '../services/api';

export default function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [nome, setNome] = useState('');

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('?rota=categorias');
      setCategorias(data);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(fetchCategorias, []);

  const openNew = () => {
    setEditing(null);
    setNome('');
    setShowModal(true);
  };
  const openEdit = cat => {
    setEditing(cat);
    setNome(cat.nome);
    setShowModal(true);
  };
  const handleDelete = async id => {
    if (!window.confirm('Confirmar exclusão?')) return;
    try {
      await api.delete('?rota=categorias', { data: { id } });
      fetchCategorias();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir');
    }
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await api.put('?rota=categorias', { id: editing.id, nome });
      } else {
        await api.post('?rota=categorias', { nome });
      }
      setShowModal(false);
      fetchCategorias();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar');
    }
  };

  return (
    <>
      <h2>Categoria</h2>
      <Button className="mb-3" onClick={openNew}>Nova Categoria</Button>

      {loading
        ? <Spinner animation="border" />
        : (
          <Table striped bordered hover>
            <thead>
              <tr><th>ID</th><th>Nome</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {categorias.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nome}</td>
                  <td>
                    <Button size="sm" variant="warning" onClick={() => openEdit(c)}>Editar</Button>{' '}
                    <Button size="sm" variant="danger" onClick={() => handleDelete(c.id)}>Excluir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )
      }

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? 'Editar' : 'Nova'} Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Digite o nome"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleSave}>
            {editing ? 'Atualizar' : 'Criar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
