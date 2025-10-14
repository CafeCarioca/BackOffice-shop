import { useState, useRef } from "react";
import styled from "styled-components";

const EditForm = ({ product, onClose, onUpdate }) => {
  const [form, setForm] = useState({ ...product });
  const [error, setError] = useState(null);
  // Guardamos el estado original para comparar después
  const originalProduct = useRef(JSON.parse(JSON.stringify(product)));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  const getChangedFields = (original, updated) => {
    const changed = {};

    for (const key in updated) {
      if (key === 'presentations') {
        const originalPres = (original.presentations || []).map(p => ({
          weight: String(p.weight || '').trim(),
          price: parseFloat(p.price) || 0
        }));

        const updatedPres = (updated.presentations || []).map(p => ({
          weight: String(p.weight || '').trim(),
          price: parseFloat(p.price) || 0
        }));

        // Comparar longitud y cada elemento
        const isDifferent = originalPres.length !== updatedPres.length ||
          originalPres.some((o, i) => {
            const u = updatedPres[i];
            if (!u) return true;
            
            const weightChanged = o.weight !== u.weight;
            const priceChanged = Math.abs(o.price - u.price) > 0.001; // Tolerancia para decimales
            
            return weightChanged || priceChanged;
          });

        if (isDifferent) {
          changed.presentations = updated.presentations.map(p => ({
            weight: String(p.weight).trim(),
            price: parseFloat(p.price)
          }));
        }
      } else if (String(updated[key]) !== String(original[key])) {
        changed[key] = updated[key];
      }
    }

    return changed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const changes = getChangedFields(originalProduct.current, form);

    if (Object.keys(changes).length === 0) {
      alert("No hay cambios para guardar.");
      return;
    }

    try {
      const url = process.env.REACT_APP_API_URL || "http://localhost:3000";
      const endpoint = `${url}/products/${product.id}`;
      const response = await fetch(endpoint, {
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

      onUpdate({ ...originalProduct.current, ...changes });
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      setError(error.message || 'Ocurrió un error al actualizar el producto.');
    }
  };

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
{form.presentations?.map((p, i) => {
  return (
    <PresentationRow key={i}>
      <div>
        <label>Cantidad (g)</label>
        <input
          value={p.weight}
          onChange={(e) => handlePresentationChange(i, 'weight', e.target.value)}
          placeholder="Peso"
        />
      </div>
      <div>
        <label>Precio ($)</label>
        <input
          type="number"
          value={p.price}
          onChange={(e) => handlePresentationChange(i, 'price', e.target.value)}
          placeholder="Precio"
        />
      </div>
      <RemoveButton type="button" onClick={() => removePresentation(i)}>✖</RemoveButton>
    </PresentationRow>
  );
})}


      <AddButton type="button" onClick={addPresentation}>Agregar presentación</AddButton>
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
  align-items: flex-end;

  div {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  label {
    font-size: 0.85rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  input {
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
