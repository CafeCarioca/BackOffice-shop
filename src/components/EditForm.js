import { useState } from "react";
import styled from "styled-components";


const EditForm = ({ product, onClose, onUpdate }) => {
    const [form, setForm] = useState({ ...product });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
    };
  
    const handlePresentationChange = (index, field, value) => {
      const updated = [...form.presentations];
      updated[index][field] = value;
      setForm({ ...form, presentations: updated });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const url = process.env.BACKEND_URL || "http://localhost:3000/"
        await fetch(`${url}products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        onUpdate(form);
      } catch (error) {
        console.error('Error al actualizar producto:', error);
      }
    };
  
    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <label>Nombre</label>
                <input name="name" value={form.name} onChange={handleChange} />
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
            </FormRow>
        
            <h4>Presentaciones</h4>
            {form.presentations?.map((p, i) => (
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
            </PresentationRow>
            ))}
        
            <SaveButton type="submit">Guardar cambios</SaveButton>
        </Form>
    );
  };


  
  export default EditForm;

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

  input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
`;

const SaveButton = styled.button`
  align-self: flex-start;
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
