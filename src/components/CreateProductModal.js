import React, { useState } from 'react';
import styled from 'styled-components';

const CreateProductModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    name: '',
    category: 'coffee',
    description: '',
    origin: '',
    toasted: '',
    flavors: '',
    price: '',
    available: true,
    display_order: 999,
    presentations: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePresentationChange = (index, field, value) => {
    const updated = [...form.presentations];
    updated[index][field] = value;
    setForm({ ...form, presentations: updated });
  };

  const removePresentation = (index) => {
    const updated = form.presentations.filter((_, i) => i !== index);
    setForm({ ...form, presentations: updated });
  };

  const addPresentation = () => {
    setForm({
      ...form,
      presentations: [...form.presentations, { weight: '', price: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convertir display_order a número antes de enviar
      const formToSubmit = {
        ...form,
        display_order: form.display_order === '' || form.display_order === null || form.display_order === undefined ? 999 : parseInt(form.display_order)
      };
      await onCreate(formToSubmit);
    } catch (error) {
      console.error('Error al crear producto:', error);
    }
  };

  return (
    <Modal>
      <ModalContent>
        <CloseButton onClick={onClose}>✖</CloseButton>
        <h2>Crear nuevo producto</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Nombre</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </FormGroup>

          <FormGroup>
            <label>Categoría</label>
            <select name="category" value={form.category} onChange={handleChange}>
              <option value="coffee">Café</option>
              <option value="capsules">Cápsulas</option>
              <option value="others">Otros</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label>Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <label>Origen</label>
              <input name="origin" value={form.origin} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <label>Tostado</label>
              <input name="toasted" value={form.toasted} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <label>Sabores</label>
              <input name="flavors" value={form.flavors} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <label>Precio base</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} />
            </FormGroup>

            <FormGroup>
              <label>Orden de visualización</label>
              <input 
                name="display_order" 
                type="number" 
                value={form.display_order} 
                onChange={handleChange}
                title="Número más bajo aparece primero (1, 2, 3...)"
              />
            </FormGroup>
          </FormRow>

          <h4>Presentaciones</h4>
          {form.presentations.map((p, i) => (
            <PresentationRow key={i}>
              <input
                value={p.weight}
                onChange={(e) => handlePresentationChange(i, 'weight', e.target.value)}
                placeholder="Peso"
              />
              <input
                type="number"
                value={p.price}
                onChange={(e) => handlePresentationChange(i, 'price', e.target.value)}
                placeholder="Precio"
              />
              <RemoveButton type="button" onClick={() => removePresentation(i)}>✖</RemoveButton>
            </PresentationRow>
          ))}

          <AddButton type="button" onClick={addPresentation}>Agregar presentación</AddButton>
          <SubmitButton type="submit">Crear producto</SubmitButton>
        </Form>
      </ModalContent>
    </Modal>
  );
};

export default CreateProductModal;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  width: 100%;
  max-width: 700px;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.3s ease;
  overflow-y: auto;
  max-height: 90vh;

  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
  border: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-weight: 500;
    margin-bottom: 0.3rem;
  }

  input, select, textarea {
    padding: 0.6rem;
    font-size: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fafafa;
  }

  textarea {
    resize: vertical;
    min-height: 60px;
  }
`;

const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  ${FormGroup} {
    flex: 1;
    min-width: 150px;
  }
`;

const PresentationRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;

  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
`;

const AddButton = styled.button`
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: #e0e7ff;
  color: #1e3a8a;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #c7d2fe;
  }
`;

const SubmitButton = styled.button`
  background-color: #1e3a8a;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #2c4db0;
  }
`;

const RemoveButton = styled.button`
  background-color: #fee2e2;
  color: #991b1b;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #fecaca;
  }
`;
