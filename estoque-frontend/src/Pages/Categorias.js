import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import api from '../services/api';

export default function Categorias() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow]       = useState(false);
  const [edit, setEdit]       = useState(null);
  const [nome, setNome]       = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await api.get('?rota=categorias');
        setItems(data);
      } catch {
        alert('Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openNew  = () => { setEdit(null); setNome(''); setShow(true); };
  const openEdit = i => { setEdit(i); setNome(i.nome); setShow(true); };

  const handleDelete = async id => {
    if (!window.confirm('Confirma exclusão?')) return;
    await api.delete('?rota=categorias', { data:{ id } });
    setItems(items.filter(i=>i.id!==id));
  };

  const handleSave = async () => {
    if (!nome.trim()) return;
    if (edit) await api.put('?rota=categorias', { id: edit.id, nome });
    else      await api.post('?rota=categorias', { nome });
    setShow(false);
    const { data } = await api.get('?rota=categorias');
    setItems(data);
  };

  return (
    <>
      <h2>Categorias</h2>
      <Button className="mb-3" onClick={openNew}>Nova Categoria</Button>
      {loading
        ? <Spinner animation="border" />
        : (
          <Table striped bordered hover>
            <thead>
              <tr><th>ID</th><th>Nome</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {items.map(({id,nome})=>(
                <tr key={id}>
                  <td>{id}</td>
                  <td>{nome}</td>
                  <td>
                    <Button size="sm" variant="warning" onClick={()=>openEdit({id,nome})}>Editar</Button>{' '}
                    <Button size="sm" variant="danger"  onClick={()=>handleDelete(id)}>Excluir</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )
      }

      <Modal show={show} onHide={()=>setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{edit?'Editar':'Nova'} Categoria</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            value={nome}
            onChange={e=>setNome(e.target.value)}
            placeholder="Nome da categoria"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShow(false)}>Cancelar</Button>
          <Button variant="primary"   onClick={handleSave}>{edit?'Atualizar':'Criar'}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
