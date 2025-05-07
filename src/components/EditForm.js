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
    const getChangedFields = (original, updated) => {
      const changed = {};
    
      for (const key in updated) {
        if (key === 'presentations') {
          // Comparar presentaciones (asumimos que si cambia alguna, se manda todo)
          const originalStr = JSON.stringify(original.presentations || []);
          const updatedStr = JSON.stringify(updated.presentations || []);
          if (originalStr !== updatedStr) {
            changed.presentations = updated.presentations;
          }
        } else if (updated[key] !== original[key]) {
          changed[key] = updated[key];
        }
      }
    
      return changed;
    };

    const removePresentation = (index) => {
      const updated = form.presentations.filter((_, i) => i !== index);
      setForm({ ...form, presentations: updated });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
      
        const changes = getChangedFields(product, form);
      
        if (Object.keys(changes).length === 0) {
          alert("No hay cambios para guardar.");
          return;
        }
      
        try {
          const response = await fetch(`http://localhost:3000/products/${product.id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}` 
            },
            body: JSON.stringify(changes),
          });
      
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || "No se pudo actualizar el producto.");
          }
      
          onUpdate({ ...product, ...changes }); // actualizás localmente también
        } catch (error) {
          console.error('Error al actualizar producto:', error);
          setError(error.message || 'Ocurrió un error al actualizar el producto.');
        }
      };
    
    

    const [error, setError] = useState(null);

    return (
      
      <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
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
            <FormGroup>
              <label>Precio</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} />
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
            <RemoveButton type="button" onClick={() => removePresentation(i)}>✖</RemoveButton>
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

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #b91c1c;
  font-size: 1.2rem;
  cursor: pointer;
  align-self: center;

  &:hover {
    color: #7f1d1d;
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

const ErrorMessage = styled.div`
  background-color: #ffe5e5;
  color: #b00020;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #ffb3b3;
  font-size: 0.95rem;
`;