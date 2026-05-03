import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../apiConfig';

const PROTECTED_SLUGS = ['coffee', 'capsules', 'others'];

const emptyForm = { slug: '', name: '', description: '', display_order: '' };

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.GET_CATEGORIES);
      setCategories(res.data);
    } catch {
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => process.env.REACT_APP_API_TOKEN;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (cat) => {
    setForm({ slug: cat.slug, name: cat.name, description: cat.description || '', display_order: cat.display_order });
    setEditingId(cat.id);
    setShowForm(true);
    setError('');
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      ...form,
      display_order: form.display_order === '' ? 999 : parseInt(form.display_order),
    };
    try {
      if (editingId) {
        await axios.put(`${API_ENDPOINTS.UPDATE_CATEGORY}/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      } else {
        await axios.post(API_ENDPOINTS.CREATE_CATEGORY, payload, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
      }
      handleCancel();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar categoría');
    }
  };

  const handleDelete = async (cat) => {
    if (!window.confirm(`¿Eliminar la categoría "${cat.name}"?`)) return;
    try {
      await axios.delete(`${API_ENDPOINTS.DELETE_CATEGORY}/${cat.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Error al eliminar categoría');
    }
  };

  if (loading) return <Container><p>Cargando...</p></Container>;

  return (
    <Container>
      <Header>
        <h2>Categorías</h2>
        {!showForm && (
          <AddButton onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}>
            + Nueva categoría
          </AddButton>
        )}
      </Header>

      {showForm && (
        <Form onSubmit={handleSubmit}>
          <h3>{editingId ? 'Editar categoría' : 'Nueva categoría'}</h3>
          {error && <ErrorMsg>{error}</ErrorMsg>}
          <FormRow>
            <FormGroup>
              <label>Slug <small>(identificador único, sin espacios)</small></label>
              <input
                name="slug"
                value={form.slug}
                onChange={handleChange}
                placeholder="ej: sets"
                required
                disabled={!!editingId}
              />
            </FormGroup>
            <FormGroup>
              <label>Nombre (visible en la tienda)</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="ej: Sets" required />
            </FormGroup>
            <FormGroup>
              <label>Orden</label>
              <input name="display_order" type="number" value={form.display_order} onChange={handleChange} placeholder="999" />
            </FormGroup>
          </FormRow>
          <FormGroup>
            <label>Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={2} />
          </FormGroup>
          <FormActions>
            <SaveButton type="submit">{editingId ? 'Guardar cambios' : 'Crear'}</SaveButton>
            <CancelButton type="button" onClick={handleCancel}>Cancelar</CancelButton>
          </FormActions>
        </Form>
      )}

      <Table>
        <thead>
          <tr>
            <th>Slug</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Orden</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td><SlugBadge>{cat.slug}</SlugBadge></td>
              <td>{cat.name}</td>
              <td>{cat.description || '-'}</td>
              <td>{cat.display_order}</td>
              <td>
                <ActionBtn onClick={() => handleEdit(cat)}>Editar</ActionBtn>
                {!PROTECTED_SLUGS.includes(cat.slug) && (
                  <DeleteBtn onClick={() => handleDelete(cat)}>Eliminar</DeleteBtn>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Categories;

const Container = styled.div`
  padding: 20px;
  flex: 1;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const AddButton = styled.button`
  padding: 8px 16px;
  background: #3c3c8f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  &:hover { background: #2e2e70; }
`;
const Form = styled.form`
  background: #f9f9ff;
  border: 1px solid #e0e0f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
`;
const FormRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 150px;
  label { font-size: 13px; font-weight: 500; color: #555; }
  small { font-weight: 400; color: #999; }
  input, textarea {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    &:disabled { background: #f0f0f0; color: #999; }
  }
`;
const FormActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 12px;
`;
const SaveButton = styled.button`
  padding: 8px 20px;
  background: #3c3c8f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: #2e2e70; }
`;
const CancelButton = styled.button`
  padding: 8px 20px;
  background: #eee;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }
  th { background: #f5f5ff; font-weight: 600; color: #444; }
  tr:hover td { background: #fafafe; }
`;
const SlugBadge = styled.span`
  background: #e8e8f8;
  color: #3c3c8f;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-family: monospace;
`;
const ActionBtn = styled.button`
  padding: 4px 10px;
  margin-right: 6px;
  background: #3c3c8f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  &:hover { background: #2e2e70; }
`;
const DeleteBtn = styled.button`
  padding: 4px 10px;
  background: #e53935;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  &:hover { background: #b71c1c; }
`;
const ErrorMsg = styled.p`
  color: #e53935;
  font-size: 13px;
  margin-bottom: 10px;
`;
