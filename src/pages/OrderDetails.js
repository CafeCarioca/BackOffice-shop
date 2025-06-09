import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchOrder } from '../services/orderservices';

const OrderDetails = ({ orderId }) => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrderDetails = async () => {
      try {
        const order = await fetchOrder(orderId);

        if (!order) {
          throw new Error("Pedido no encontrado");
        }

        const filteredData = {
          orderId: order.id,
          orderDate: order.order_date,
          status: order.status,
          total: parseFloat(order.total).toFixed(2),
          shippingType: order.shipping_type,
          user: {
            username: order.user.username,
            email: order.user.email,
            firstName: order.user.first_name,
            lastName: order.user.last_name,
            documentType: order.user.document_type,
            documentNumber: order.user.document_number,
            phone: order.user.phone,
            facturaConRut: order.user.factura_con_rut,
            razonSocial: order.user.razon_social,
            rut: order.user.rut,
            recipient: order.user.recipient,
            remarks: order.user.remarks,
            createdAt: order.user.created_at,
          },
          address: order.address ? {
            street: order.address.street,
            doorNumber: order.address.door_number,
            apartment: order.address.apartment,
            department: order.address.department,
            city: order.address.city,
            state: order.address.state,
            postalCode: order.address.postal_code,
            country: order.address.country,
            latitude: order.address.latitude,
            longitude: order.address.longitude,
          } : null,
          products: order.products.map(product => ({
            name: product.name,
            price: parseFloat(product.price).toFixed(2),
            grams: product.grams,
            quantity: product.quantity,
            grind: product.grind,
          }))
        };

        setOrderData(filteredData);
      } catch (error) {
        setError("Error al cargar los detalles del pedido.");
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!orderData) {
    return <div>Pedido no encontrado</div>;
  }

  const { user, address, products } = orderData;

  return (
    <OrderDetailsContainer>
      <h2>Detalles del Pedido</h2>
      <DetailsGrid>
        <div>
          <Section>
            <h3>Información del Cliente</h3>
            <p>Nombre de usuario: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Nombre: {user.firstName} {user.lastName}</p>
            <p>Documento: {user.documentType} {user.documentNumber}</p>
            <p>Teléfono: {user.phone}</p>
          </Section>
          {orderData.shippingType !== 'takeaway' && address && (
            <AddressSection>
              <h3>Dirección de Envío</h3>
              <AddressGrid>
                <p><strong>Calle:</strong> {address.street}</p>
                <p><strong>Número de puerta:</strong> {address.doorNumber}</p>
                <p><strong>Apartamento:</strong> {address.apartment}</p>
                <p><strong>Departamento:</strong> {address.department}</p>
                <p><strong>Ciudad:</strong> {address.city}</p>
                <p><strong>Estado:</strong> {address.state}</p>
                <p><strong>Código Postal:</strong> {address.postalCode}</p>
                <p><strong>País:</strong> {address.country}</p>
                <p><strong>Observaciones:</strong> {user.remarks || 'Ninguna'}</p>
              </AddressGrid>
            </AddressSection>
          )}
          <Section>
            <h3>Detalles del Pedido</h3>
            <p>Fecha del pedido: {new Date(orderData.orderDate).toLocaleDateString()}</p>
            <p>Estado: {orderData.status}</p>
            <p>Total: ${orderData.total}</p>
            <p>Tipo de Envío: {orderData.shippingType}</p>

          </Section>
        </div>
        <ProductSection>
          <h3>Productos en el Pedido</h3>
          <ul>
            {products.map((item, index) => (
              <li key={index}>
                {item.name} - Cantidad: {item.quantity} - Precio: ${item.price} - Grind: {item.grind} - Gramos: {item.grams}
              </li>
            ))}
          </ul>
        </ProductSection>
      </DetailsGrid>
    </OrderDetailsContainer>
  );
}

export default OrderDetails;

const OrderDetailsContainer = styled.div`
  padding: 20px;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  margin: 20px;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const AddressSection = styled(Section)`
  display: flex;
  flex-direction: column;
`;

const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
`;

const ProductSection = styled.div`
  margin-bottom: 20px;
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    margin-bottom: 10px;
  }
`;