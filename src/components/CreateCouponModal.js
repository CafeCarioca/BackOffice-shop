import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../apiConfig';

const CreateCouponModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    delivery_type: 'both',
    min_purchase_amount: '',
    max_uses: '',
    is_active: true,
    start_date: '',
    end_date: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.code || !form.name || !form.discount_value) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    if (parseFloat(form.discount_value) <= 0) {
      alert('El valor del descuento debe ser mayor a 0');
      return;
    }

    if (form.discount_type === 'percentage' && parseFloat(form.discount_value) > 100) {
      alert('El porcentaje no puede ser mayor a 100');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        code: form.code.toUpperCase(),
        name: form.name,
        description: form.description || null,
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        delivery_type: form.delivery_type,
        min_purchase_amount: form.min_purchase_amount ? parseFloat(form.min_purchase_amount) : 0,
        max_uses: form.max_uses ? parseInt(form.max_uses) : null,
        is_active: form.is_active,
        start_date: form.start_date || null,
        end_date: form.end_date || null
      };

      await axios.post(API_ENDPOINTS.CREATE_COUPON, payload);
      onSuccess();
    } catch (error) {
      console.error('Error al crear cupón:', error);
      alert('Error al crear cupón: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Crear Nuevo Cupón</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Código del cupón *</Label>
            <Input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              placeholder="Ej: BLACKFRIDAY"
              maxLength={50}
              style={{ textTransform: 'uppercase' }}
              required
            />
            <Hint>El código se convertirá automáticamente a mayúsculas</Hint>
          </FormGroup>

          <FormGroup>
            <Label>Nombre del cupón *</Label>
            <Input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Black Friday 2025"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Descripción</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descripción opcional del cupón"
              rows={3}
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label>Tipo de descuento *</Label>
              <Select
                name="discount_type"
                value={form.discount_type}
                onChange={handleChange}
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed_amount">Monto fijo ($)</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                Valor *
                {form.discount_type === 'percentage' ? ' (%)' : ' ($)'}
              </Label>
              <Input
                type="number"
                name="discount_value"
                value={form.discount_value}
                onChange={handleChange}
                placeholder={form.discount_type === 'percentage' ? '10' : '100'}
                step="0.01"
                min="0"
                required
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Disponible para</Label>
            <RadioGroup>
              <RadioOption>
                <input
                  type="radio"
                  name="delivery_type"
                  value="both"
                  checked={form.delivery_type === 'both'}
                  onChange={handleChange}
                />
                <span>Ambos (Delivery y TakeAway)</span>
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="delivery_type"
                  value="delivery"
                  checked={form.delivery_type === 'delivery'}
                  onChange={handleChange}
                />
                <span>Solo Delivery</span>
              </RadioOption>
              <RadioOption>
                <input
                  type="radio"
                  name="delivery_type"
                  value="takeaway"
                  checked={form.delivery_type === 'takeaway'}
                  onChange={handleChange}
                />
                <span>Solo TakeAway</span>
              </RadioOption>
            </RadioGroup>
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label>Compra mínima ($)</Label>
              <Input
                type="number"
                name="min_purchase_amount"
                value={form.min_purchase_amount}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min="0"
              />
              <Hint>Dejar en 0 para sin mínimo</Hint>
            </FormGroup>

            <FormGroup>
              <Label>Usos máximos</Label>
              <Input
                type="number"
                name="max_uses"
                value={form.max_uses}
                onChange={handleChange}
                placeholder="Ilimitado"
                min="1"
              />
              <Hint>Dejar vacío para ilimitado</Hint>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Fecha de inicio</Label>
              <Input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Fecha de fin</Label>
              <Input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
              />
              <span>Cupón activo</span>
            </CheckboxLabel>
          </FormGroup>

          <Actions>
            <CancelButton type="button" onClick={onClose} disabled={loading}>
              Cancelar
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Cupón'}
            </SubmitButton>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  );
};

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 1;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #58000a;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #58000a;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  font-size: 1rem;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #58000a;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  input[type="radio"] {
    cursor: pointer;
  }

  span {
    font-size: 0.95rem;
    color: #333;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  input[type="checkbox"] {
    cursor: pointer;
    width: 1.2rem;
    height: 1.2rem;
  }

  span {
    font-size: 0.95rem;
    color: #333;
  }
`;

const Hint = styled.small`
  display: block;
  margin-top: 0.25rem;
  color: #888;
  font-size: 0.85rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background-color: white;
  color: #666;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #f5f5f5;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: #58000a;
  color: white;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #7a0010;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default CreateCouponModal;
