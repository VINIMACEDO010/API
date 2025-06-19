import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import api from '../services/api';

export default function Fornecedores() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow]       = useState(false);
  const [edit, setEdit]       = useState(null);
  const [nome, setNome]       = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail]     = useState('');

  // Carrega listagem
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await api.get('?rota=fornecedores');
        setItems(data);
      } catch {
        alert('Erro ao carregar fornecedores');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Abre modal para novo/edição
  const openNew = () => {
    setEdit(null);
    setNome('');
    setTelefone('');
    setEmail('');
    setShow(true);
  };
  const openEdit = f => {
    setEdit(f);
    setNome(f.nome);
    setTelefone(f.telefone || '');
    setEmail(f.email || '');
    setShow(true);
  };

  // Deleta
  const handleDelete = async id => {
    if (!window.confirm('Confirma exclusão?')) return;
    await api.delete('?rota=fornecedores', { data: { id } });
    setItems(items.filter(i => i.id !== id));
  };

  // Cria ou atualiza
  const handleSave = async () => {
    if (!nome.trim()) return;
    const payload = {
      nome,
      telefone: telefone || null,
      email:    email    || null
    };
    if (edit) {
      await api.put('?rota=fornecedores', { id: edit.id, ...payload });
    } else {
      await api.post('?rota=fornecedores', payload);
    }
    setShow(false);
    // Recarrega
    const { data } = await api.get('?rota=fornecedores');
    setItems(data);
  };

  return (
    <>
      <h2>Fornecedores</h2>
      <Button className="mb-3" onClick={openNew}>Novo Fornecedor</Button>

      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(({id,nome,telefone,email}) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{nome}</td>
                <td>{telefone}</td>
                <td>{email}</td>
                <td>
                  <Button size="sm" variant="warning" onClick={() => openEdit({id,nome,telefone,email})}>
                    Editar
                  </Button>{' '}
                  <Button size="sm" variant="danger" onClick={() => handleDelete(id)}>
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{edit ? 'Editar' : 'Novo'} Fornecedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Nome</Form.Label>
            <Form.Control value={nome} onChange={e => setNome(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Telefone</Form.Label>
            <Form.Control value={telefone} onChange={e => setTelefone(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control value={email} onChange={e => setEmail(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancelar</Button>
          <Button variant="primary"   onClick={handleSave}>
            {edit ? 'Atualizar' : 'Criar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
