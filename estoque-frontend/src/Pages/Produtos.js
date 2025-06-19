import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import api from '../services/api';

export default function Produtos() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [show, setShow]         = useState(false);
  const [edit, setEdit]         = useState(null);
  const [nome, setNome]         = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco]       = useState('');
  const [qtd, setQtd]           = useState('');
  const [catId, setCatId]       = useState('');
  const [fnId, setFnId]         = useState([]);

  const [cats, setCats]         = useState([]);
  const [fns, setFns]           = useState([]);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      const [pRes, cRes, fRes] = await Promise.all([
        api.get('?rota=produtos'),
        api.get('?rota=categorias'),
        api.get('?rota=fornecedores'),
      ]);
      setItems(pRes.data);
      setCats(cRes.data);
      setFns(fRes.data);
      setLoading(false);
    }
    loadAll();
  }, []);

  const openNew = () => {
    setEdit(null);
    setNome(''); setDescricao(''); setPreco(''); setQtd('');
    setCatId(''); setFnId('');
    setShow(true);
  };
  const openEdit = i => {
    setEdit(i);
    setNome(i.nome);
    setDescricao(i.descricao||'');
    setPreco(i.preco);
    setQtd(i.quantidade_estoque);
    setCatId(i.categoria_id||'');
    setFnId(i.fornecedor_id||'');
    setShow(true);
  };

  const handleDelete = async id => {
    if (!window.confirm('Excluir?')) return;
    await api.delete('?rota=produtos',{ data:{id} });
    setItems(items.filter(x=>x.id!==id));
  };

  const handleSave = async () => {
    if (!nome.trim()) return;
    const payload = {
      nome,
      descricao: descricao||null,
      preco,
      quantidade_estoque: qtd,
      categoria_id: catId||null,
      fornecedor_id: fnId||null
    };
    if (edit) await api.put('?rota=produtos',{ id:edit.id, ...payload });
    else      await api.post('?rota=produtos', payload);
    setShow(false);
    const { data } = await api.get('?rota=produtos');
    setItems(data);
  };

  return (
    <>
      <h2>Produtos</h2>
      <Button className="mb-3" onClick={openNew}>Novo Produto</Button>
      {loading ? <Spinner/> : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th><th>Nome</th><th>Preço</th>
              <th>Qtd</th><th>Categoria</th><th>Fornecedor</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it=>(
              <tr key={it.id}>
                <td>{it.id}</td>
                <td>{it.nome}</td>
                <td>{it.preco}</td>
                <td>{it.quantidade_estoque}</td>
                <td>{it.categoria}</td>
                <td>{it.fornecedor}</td>
                <td>
                  <Button size="sm" variant="warning" onClick={()=>openEdit(it)}>Editar</Button>{' '}
                  <Button size="sm" variant="danger"  onClick={()=>handleDelete(it.id)}>Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Modal show={show} onHide={()=>setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{edit?'Editar':'Novo'} Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-2">
            <Form.Label>Nome</Form.Label>
            <Form.Control value={nome} onChange={e=>setNome(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Descrição</Form.Label>
            <Form.Control as="textarea" rows={2} value={descricao} onChange={e=>setDescricao(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Preço</Form.Label>
            <Form.Control type="number" value={preco} onChange={e=>setPreco(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Quantidade</Form.Label>
            <Form.Control type="number" value={qtd} onChange={e=>setQtd(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Categoria</Form.Label>
            <Form.Select value={catId} onChange={e=>setCatId(e.target.value)}>
              <option value="">Selecione</option>
              {cats.map(c=>(
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Fornecedor</Form.Label>
            <Form.Select value={fnId} onChange={e=>setFnId(e.target.value)}>
              <option value="">Selecione</option>
              {fns.map(f=>(
                <option key={f.id} value={f.id}>{f.nome}</option>
              ))}
            </Form.Select>
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
