import React from 'react';
import { orderRows, userRows, productRows, addressRows } from "../dummyData"; // Importa también las direcciones
import styled from 'styled-components';

const OrderDetails = ({ orderId }) => {
  // Encuentra el pedido específico
  const order = orderRows.find(o => o.id === orderId);

  if (!order) {
    return <div>Pedido no encontrado</div>;
  }

  // Encuentra el usuario asociado
  const user = userRows.find(u => u.id === order.user_id);

  // Encuentra la dirección asociada
  const address = addressRows.find(a => a.id === order.address_id);

  // Encuentra los productos asociados
  const orderItems = order.items.map(itemId => {
    const item = productRows.find(p => p.id === itemId.product_id);
    return {
      ...item,
      quantity: itemId.quantity,
      price: itemId.price,
    };
  });

  return (
    <OrderDetailsContainer>
      <h2>Detalles del Pedido</h2>
      <Section>
        <h3>Información del Cliente</h3>
        <p>Nombre de usuario: {user?.username}</p>
        <p>Email: {user?.email}</p>
      </Section>
      <Section>
        <h3>Dirección de Envío</h3>
        <p>Calle: {address?.street}</p>
        <p>Ciudad: {address?.city}</p>
        <p>Estado: {address?.state}</p>
        <p>Código Postal: {address?.postal_code}</p>
        <p>País: {address?.country}</p>
      </Section>
      <Section>
        <h3>Productos en el Pedido</h3>
        <ul>
          {orderItems.map(item => (
            <li key={item.id}>
              {item.name} - Cantidad: {item.quantity} - Precio: ${item.price.toFixed(2)}
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <h3>Detalles del Pedido</h3>
        <p>Fecha del pedido: {new Date(order.order_date).toLocaleDateString()}</p>
        <p>Estado: {order.status}</p>
        <p>Total: ${order.total.toFixed(2)}</p>
      </Section>
    </OrderDetailsContainer>
  );
}

export default OrderDetails;

const OrderDetailsContainer = styled.div`
  padding: 20px;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  margin: 20px;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;