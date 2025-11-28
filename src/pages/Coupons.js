import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { API_ENDPOINTS } from '../apiConfig';
import CreateCouponModal from '../components/CreateCouponModal';
import EditCouponModal from '../components/EditCouponModal';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_COUPONS);
      setCoupons(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener cupones:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cupón?')) {
      try {
        await axios.delete(`${API_ENDPOINTS.DELETE_COUPON}/${id}`);
        fetchCoupons();
      } catch (error) {
        console.error('Error al eliminar cupón:', error);
        alert('Error al eliminar cupón');
      }
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      await axios.put(`${API_ENDPOINTS.UPDATE_COUPON}/${coupon.id}`, {
        is_active: !coupon.is_active
      });
      fetchCoupons();
    } catch (error) {
      console.error('Error al actualizar cupón:', error);
      alert('Error al actualizar cupón');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Sin límite';
    return new Date(date).toLocaleDateString('es-UY');
  };

  const isActive = (coupon) => {
    if (!coupon.is_active) return false;
    
    const now = new Date();
    const start = coupon.start_date ? new Date(coupon.start_date) : null;
    const end = coupon.end_date ? new Date(coupon.end_date) : null;

    if (start && now < start) return false;
    if (end && now > end) return false;

    // Verificar si alcanzó el máximo de usos
    if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) return false;

    return true;
  };

  if (loading) {
    return <Container><p>Cargando cupones...</p></Container>;
  }

  return (
    <Container>
      <Header>
        <Title>Gestión de Cupones</Title>
        <CreateButton onClick={() => setShowCreateModal(true)}>
          + Crear Cupón
        </CreateButton>
      </Header>

      <CouponsGrid>
        {coupons.map(coupon => (
          <CouponCard key={coupon.id}>
            <CardHeader>
              <CouponCode>{coupon.code}</CouponCode>
              <BadgeContainer>
                <StatusBadge active={isActive(coupon)}>
                  {isActive(coupon) ? 'ACTIVO' : 'INACTIVO'}
                </StatusBadge>
                <DeliveryTypeBadge deliveryType={coupon.delivery_type || 'both'}>
                  {coupon.delivery_type === 'delivery' ? '🚚 Delivery' : 
                   coupon.delivery_type === 'takeaway' ? '🏪 TakeAway' : 
                   '🚚🏪 Ambos'}
                </DeliveryTypeBadge>
              </BadgeContainer>
            </CardHeader>

            <CouponName>{coupon.name}</CouponName>

            {coupon.description && (
              <Description>{coupon.description}</Description>
            )}

            <InfoRow>
              <InfoLabel>Tipo:</InfoLabel>
              <InfoValue>
                {coupon.discount_type === 'percentage' ? 'Porcentaje' : 'Monto fijo'}
              </InfoValue>
            </InfoRow>

            <InfoRow>
              <InfoLabel>Valor:</InfoLabel>
              <DiscountValue type={coupon.discount_type}>
                {coupon.discount_type === 'percentage' 
                  ? `${coupon.discount_value}%` 
                  : `$${coupon.discount_value}`}
              </DiscountValue>
            </InfoRow>

            {coupon.min_purchase_amount > 0 && (
              <InfoRow>
                <InfoLabel>Compra mínima:</InfoLabel>
                <InfoValue>${coupon.min_purchase_amount}</InfoValue>
              </InfoRow>
            )}

            {coupon.max_uses && (
              <InfoRow>
                <InfoLabel>Usos:</InfoLabel>
                <UsageValue>
                  {coupon.current_uses} / {coupon.max_uses}
                  {coupon.current_uses >= coupon.max_uses && 
                    <UsageWarning> ⚠️</UsageWarning>}
                </UsageValue>
              </InfoRow>
            )}

            {(coupon.start_date || coupon.end_date) && (
              <DateInfo>
                <InfoRow>
                  <InfoLabel>Inicio:</InfoLabel>
                  <InfoValue>{formatDate(coupon.start_date)}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>Fin:</InfoLabel>
                  <InfoValue>{formatDate(coupon.end_date)}</InfoValue>
                </InfoRow>
              </DateInfo>
            )}

            <Actions>
              <ActionButton 
                color="#2196F3" 
                onClick={() => setEditingCoupon(coupon)}
              >
                Editar
              </ActionButton>
              <ActionButton 
                color={coupon.is_active ? "#FF9800" : "#4CAF50"}
                onClick={() => handleToggleActive(coupon)}
              >
                {coupon.is_active ? 'Desactivar' : 'Activar'}
              </ActionButton>
              <ActionButton 
                color="#f44336" 
                onClick={() => handleDelete(coupon.id)}
              >
                Eliminar
              </ActionButton>
            </Actions>
          </CouponCard>
        ))}

        {coupons.length === 0 && (
          <EmptyState>
            <p>No hay cupones creados</p>
            <CreateButton onClick={() => setShowCreateModal(true)}>
              Crear el primero
            </CreateButton>
          </EmptyState>
        )}
      </CouponsGrid>

      {showCreateModal && (
        <CreateCouponModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchCoupons();
          }}
        />
      )}

      {editingCoupon && (
        <EditCouponModal
          coupon={editingCoupon}
          onClose={() => setEditingCoupon(null)}
          onSuccess={() => {
            setEditingCoupon(null);
            fetchCoupons();
          }}
        />
      )}
    </Container>
  );
};

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

const CouponsGrid = styled.div`
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

const CouponCard = styled.div`
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

const CouponCode = styled.h3`
  font-size: 17px;
  font-weight: 700;
  color: #58000a;
  margin: 0;
  flex: 1;
  line-height: 1.3;
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 1px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CouponName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.8rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
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

const DeliveryTypeBadge = styled.span`
  background-color: ${props => 
    props.deliveryType === 'delivery' ? '#2196F3' : 
    props.deliveryType === 'takeaway' ? '#FF9800' : 
    '#9C27B0'};
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
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

const UsageValue = styled.span`
  color: #333;
  font-size: 13px;
  font-weight: 500;
`;

const UsageWarning = styled.span`
  color: #f44336;
  font-size: 12px;
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

export default Coupons;
