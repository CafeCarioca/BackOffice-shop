import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../apiConfig';
import CreateDiscountModal from '../components/CreateDiscountModal';
import EditDiscountModal from '../components/EditDiscountModal';

const Discounts = () => {
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);

  useEffect(() => {
    fetchDiscounts();
    fetchProducts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_DISCOUNTS);
      setDiscounts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener descuentos:', error);
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_PRODUCTS);
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este descuento?')) {
      try {
        await axios.delete(`${API_ENDPOINTS.DELETE_DISCOUNT}/${id}`);
        fetchDiscounts();
      } catch (error) {
        console.error('Error al eliminar descuento:', error);
        alert('Error al eliminar descuento');
      }
    }
  };

  const handleToggleActive = async (discount) => {
    try {
      await axios.put(`${API_ENDPOINTS.UPDATE_DISCOUNT}/${discount.id}`, {
        is_active: !discount.is_active
      });
      fetchDiscounts();
    } catch (error) {
      console.error('Error al actualizar descuento:', error);
      alert('Error al actualizar descuento');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Sin límite';
    return new Date(date).toLocaleDateString('es-UY');
  };

  const isActive = (discount) => {
    if (!discount.is_active) return false;
    
    const now = new Date();
    const start = discount.start_date ? new Date(discount.start_date) : null;
    const end = discount.end_date ? new Date(discount.end_date) : null;

    if (start && now < start) return false;
    if (end && now > end) return false;

    return true;
  };

  if (loading) {
    return <Container><p>Cargando descuentos...</p></Container>;
  }

  return (
    <Container>
      <Header>
        <Title>Gestión de Descuentos</Title>
        <CreateButton onClick={() => setShowCreateModal(true)}>
          + Crear Descuento
        </CreateButton>
      </Header>

      <DiscountsGrid>
        {discounts.map(discount => (
          <DiscountCard key={discount.id}>
            <CardHeader>
              <DiscountName>{discount.name}</DiscountName>
              <StatusBadge active={isActive(discount)}>
                {isActive(discount) ? 'ACTIVO' : 'INACTIVO'}
              </StatusBadge>
            </CardHeader>

            {discount.description && (
              <Description>{discount.description}</Description>
            )}

            <InfoRow>
              <InfoLabel>Tipo:</InfoLabel>
              <InfoValue>
                {discount.discount_type === 'percentage' ? 'Porcentaje' : 'Monto fijo'}
              </InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Valor:</InfoLabel>
              <DiscountValue type={discount.discount_type}>
                {discount.discount_type === 'percentage' 
                  ? `${discount.discount_value}%` 
                  : `$${discount.discount_value}`}
              </DiscountValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Productos:</InfoLabel>
              <InfoValue>{discount.product_count || 0} productos</InfoValue>
            </InfoRow>

            {(discount.start_date || discount.end_date) && (
              <DateInfo>
                <InfoRow>
                  <InfoLabel>Inicio:</InfoLabel>
                  <InfoValue>{formatDate(discount.start_date)}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Fin:</InfoLabel>
                  <InfoValue>{formatDate(discount.end_date)}</InfoValue>
                </InfoRow>
              </DateInfo>
            )}

            <Actions>
              <ActionButton 
                color="#2196F3" 
                onClick={() => setEditingDiscount(discount)}
              >
                Editar
              </ActionButton>
              <ActionButton 
                color={discount.is_active ? "#FF9800" : "#4CAF50"}
                onClick={() => handleToggleActive(discount)}
              >
                {discount.is_active ? 'Desactivar' : 'Activar'}
              </ActionButton>
              <ActionButton 
                color="#f44336" 
                onClick={() => handleDelete(discount.id)}
              >
                Eliminar
              </ActionButton>
            </Actions>
          </DiscountCard>
        ))}

        {discounts.length === 0 && (
          <EmptyState>
            <p>No hay descuentos creados</p>
            <CreateButton onClick={() => setShowCreateModal(true)}>
              Crear el primero
            </CreateButton>
          </EmptyState>
        )}
      </DiscountsGrid>

      {showCreateModal && (
        <CreateDiscountModal
          products={products}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchDiscounts();
          }}
        />
      )}

      {editingDiscount && (
        <EditDiscountModal
          discount={editingDiscount}
          products={products}
          onClose={() => setEditingDiscount(null)}
          onSuccess={() => {
            setEditingDiscount(null);
            fetchDiscounts();
          }}
        />
      )}
    </Container>
  );
};

export default Discounts;

// Styled Components
const Container = styled.div`
  padding: 2rem;
  flex: 1;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #333;
`;

const CreateButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const DiscountsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  
  @media screen and (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    max-width: 1100px;
  }
  
  @media screen and (min-width: 1600px) {
    grid-template-columns: repeat(4, 1fr);
    max-width: 1400px;
  }
`;

const DiscountCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.2rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border: 1px solid #e0e0e0;
  transition: box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.8rem;
  gap: 0.5rem;
`;

const DiscountName = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const StatusBadge = styled.span`
  background-color: ${props => props.active ? '#4CAF50' : '#9E9E9E'};
  color: white;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;
`;

const Description = styled.p`
  color: #666;
  font-size: 13px;
  margin-bottom: 0.8rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
  font-size: 13px;
`;

const InfoLabel = styled.span`
  color: #888;
  font-size: 12px;
`;

const InfoValue = styled.span`
  color: #333;
  font-size: 13px;
  font-weight: 500;
`;

const DiscountValue = styled.span`
  color: ${props => props.type === 'percentage' ? '#FF6B6B' : '#4CAF50'};
  font-size: 20px;
  font-weight: 700;
`;

const DateInfo = styled.div`
  margin-top: 0.8rem;
  padding-top: 0.8rem;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-top: auto;
  padding-top: 0.8rem;
  border-top: 1px solid #e0e0e0;
`;

const ActionButton = styled.button`
  flex: 1;
  background-color: ${props => props.color};
  color: white;
  border: none;
  padding: 7px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.3s;
  white-space: nowrap;

  &:hover {
    opacity: 0.85;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #888;

  p {
    font-size: 18px;
    margin-bottom: 1rem;
  }
`;
