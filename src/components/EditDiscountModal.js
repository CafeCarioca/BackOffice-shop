import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../apiConfig';

const EditDiscountModal = ({ discount, products, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    is_active: true,
    delivery_type: 'both',
    start_date: '',
    end_date: '',
    product_ids: []
  });

  const [loading, setLoading] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    loadDiscountData();
  }, [discount]);

  const loadDiscountData = async () => {
    try {
      // Cargar detalles del descuento con productos
      const response = await axios.get(`${API_ENDPOINTS.GET_DISCOUNT}/${discount.id}`);
      const discountData = response.data;

      setForm({
        name: discountData.name || '',
        description: discountData.description || '',
        discount_type: discountData.discount_type || 'percentage',
        discount_value: discountData.discount_value || '',
        is_active: discountData.is_active ?? true,
        delivery_type: discountData.delivery_type || 'both',
        start_date: discountData.start_date ? discountData.start_date.split('T')[0] : '',
        end_date: discountData.end_date ? discountData.end_date.split('T')[0] : '',
        product_ids: discountData.products ? discountData.products.map(p => p.id) : []
      });

      setLoadingProducts(false);
    } catch (error) {
      console.error('Error al cargar descuento:', error);
      setLoadingProducts(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProductToggle = (productId) => {
    setForm(prev => ({
      ...prev,
      product_ids: prev.product_ids.includes(productId)
        ? prev.product_ids.filter(id => id !== productId)
        : [...prev.product_ids, productId]
    }));
  };

  const handleSelectAll = () => {
    setForm(prev => ({
      ...prev,
      product_ids: prev.product_ids.length === products.length 
        ? [] 
        : products.map(p => p.id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.discount_value) {
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
      // Actualizar descuento
      await axios.put(`${API_ENDPOINTS.UPDATE_DISCOUNT}/${discount.id}`, {
        name: form.name,
        description: form.description,
        discount_type: form.discount_type,
        discount_value: parseFloat(form.discount_value),
        is_active: form.is_active,
        delivery_type: form.delivery_type,
        start_date: form.start_date || null,
        end_date: form.end_date || null
      });

      // Obtener productos actuales del descuento
      const currentProductsResponse = await axios.get(`${API_ENDPOINTS.GET_DISCOUNT_PRODUCTS}/${discount.id}/products`);
      const currentProductIds = currentProductsResponse.data.map(p => p.id);

      // Calcular productos a agregar y a remover
      const toAdd = form.product_ids.filter(id => !currentProductIds.includes(id));
      const toRemove = currentProductIds.filter(id => !form.product_ids.includes(id));

      // Agregar nuevos productos
      if (toAdd.length > 0) {
        await axios.post(`${API_ENDPOINTS.ADD_PRODUCTS_TO_DISCOUNT}/${discount.id}/products`, {
          product_ids: toAdd
        });
      }

      // Remover productos
      for (const productId of toRemove) {
        await axios.delete(`${API_ENDPOINTS.DELETE_DISCOUNT}/${discount.id}/products/${productId}`);
      }

      onSuccess();
    } catch (error) {
      console.error('Error al actualizar descuento:', error);
      alert('Error al actualizar descuento: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const categoryMap = {
    coffee: 'Café',
    capsules: 'Cápsulas',
    others: 'Otros'
  };

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'others';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  if (loadingProducts) {
    return (
      <Overlay onClick={onClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <LoadingMessage>Cargando...</LoadingMessage>
        </Modal>
      </Overlay>
    );
  }

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Editar Descuento</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nombre del descuento *</Label>
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
              placeholder="Descripción opcional del descuento"
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
                placeholder={form.discount_type === 'percentage' ? '15' : '200'}
                step="0.01"
                min="0"
                max={form.discount_type === 'percentage' ? '100' : undefined}
                required
              />
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
              <Helper>Opcional - Sin fecha = siempre activo</Helper>
            </FormGroup>

            <FormGroup>
              <Label>Fecha de fin</Label>
              <Input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                min={form.start_date}
              />
              <Helper>Opcional - Sin fecha = sin vencimiento</Helper>
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
              Descuento activo
            </CheckboxLabel>
          </FormGroup>

          <FormGroup>
            <Label>Tipo de entrega *</Label>
            <RadioGroup>
              <RadioLabel>
                <input
                  type="radio"
                  name="delivery_type"
                  value="both"
                  checked={form.delivery_type === 'both'}
                  onChange={handleChange}
                />
                Ambos (Delivery y TakeAway)
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="delivery_type"
                  value="delivery"
                  checked={form.delivery_type === 'delivery'}
                  onChange={handleChange}
                />
                Solo Delivery
              </RadioLabel>
              <RadioLabel>
                <input
                  type="radio"
                  name="delivery_type"
                  value="takeaway"
                  checked={form.delivery_type === 'takeaway'}
                  onChange={handleChange}
                />
                Solo TakeAway
              </RadioLabel>
            </RadioGroup>
          </FormGroup>

          <Divider />

          <ProductsSection>
            <ProductsHeader>
              <Label>Productos del descuento</Label>
              <SelectAllButton type="button" onClick={handleSelectAll}>
                {form.product_ids.length === products.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </SelectAllButton>
            </ProductsHeader>
            <ProductsCount>
              {form.product_ids.length} de {products.length} productos seleccionados
            </ProductsCount>

            <ProductsList>
              {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
                <CategoryGroup key={category}>
                  <CategoryTitle>{categoryMap[category] || category}</CategoryTitle>
                  {categoryProducts.map(product => (
                    <ProductItem key={product.id}>
                      <Checkbox
                        type="checkbox"
                        checked={form.product_ids.includes(product.id)}
                        onChange={() => handleProductToggle(product.id)}
                      />
                      <ProductLabel>
                        <ProductName>{product.name}</ProductName>
                        <ProductPrice>${product.price}</ProductPrice>
                      </ProductLabel>
                    </ProductItem>
                  ))}
                </CategoryGroup>
              ))}
            </ProductsList>
          </ProductsSection>

          <Actions>
            <CancelButton type="button" onClick={onClose}>
              Cancelar
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </SubmitButton>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default EditDiscountModal;

// Styled Components (reutilizamos los mismos del CreateDiscountModal)
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
  padding: 20px;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  font-size: 16px;
  color: #666;
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
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 32px;
  color: #888;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
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
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;

  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const Helper = styled.small`
  display: block;
  color: #888;
  font-size: 12px;
  margin-top: 4px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  input[type="radio"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e0e0e0;
  margin: 1.5rem 0;
`;

const ProductsSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const SelectAllButton = styled.button`
  background: none;
  border: none;
  color: #2196F3;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const ProductsCount = styled.p`
  color: #666;
  font-size: 13px;
  margin-bottom: 1rem;
`;

const ProductsList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
`;

const CategoryGroup = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #4CAF50;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-right: 12px;
`;

const ProductLabel = styled.label`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  cursor: pointer;
`;

const ProductName = styled.span`
  font-size: 14px;
  color: #333;
`;

const ProductPrice = styled.span`
  font-size: 13px;
  color: #666;
  font-weight: 500;
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  background-color: #4CAF50;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: #45a049;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
