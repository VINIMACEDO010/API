import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import api from '../services/api';

export default function Pedidos() {
  const [items, setItems]         = useState([]);
  const [produtos, setProdutos]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [show, setShow]           = useState(false);
  const [edit, setEdit]           = useState(null);
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      const [pdRes, prRes] = await Promise.all([
        api.get('?rota=pedidos'),
        api.get('?rota=produtos')
      ]);
      setItems(pdRes.data);
      setProdutos(prRes.data);
      setLoading(false);
    }
    loadAll();
  }, []);

  const openNew = () => {
    setEdit(null);
    setProdutoId('');
    setQuantidade('');
    setShow(true);
  };
  const openEdit = p => {
    setEdit(p);
    setProdutoId(p.produto_id);
    setQuantidade(p.quantidade);
    setShow(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Excluir?')) return;
    await api.delete('?rota=pedidos',{ data:{id} });
    setItems(items.filter(x=>x.id!==id));
  };

  const handleSave = async () => {
    if (!produtoId||!quantidade) return;
    const payload = { produto_id: produtoId, quantidade };
    if (edit) await api.put('?rota=pedidos',{ id:edit.id, ...payload });
    else      await api.post('?rota=pedidos', payload);
    setShow(false);
    const { data } = await api.get('?rota=pedidos');
    setItems(data);
  };

  return (
    <>
      <h2>Pedidos</h2>
      <Button className="mb-3" onClick={openNew}>Novo Pedido</Button>
      {loading ? <Spinner/> : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th><th>Produto</th><th>Qtd</th><th>Data</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(i=>(
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.produto}</td>
                <td>{i.quantidade}</td>
                <td>{new Date(i.data_pedido).toLocaleString()}</td>
                <td>
                  <Button size="sm" variant="warning" onClick={()=>openEdit(i)}>Editar</Button>{' '}
                  <Button size="sm" variant="danger"  onClick={()=>handleDelete(i.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={show} onHide={()=>setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{edit?'Editar':'Novo'} Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Produto</Form.Label>
            <Form.Select value={produtoId} onChange={e=>setProdutoId(e.target.value)}>
              <option value="">Selecione</option>
              {produtos.map(p=>(
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Quantidade</Form.Label>
            <Form.Control type="number" value={quantidade} onChange={e=>setQuantidade(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>setShow(false)}>Cancelar</Button>
          <Button variant="primary"   onClick={handleSave}>
            {edit?'Atualizar':'Criar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
