import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TheList, EditButton, MyDeleteOutline, ViewButton } from "../styles/styled-elements";
import OrderDetails from './OrderDetails';
import { fetchOrders } from '../services/orderservices';
import styled from 'styled-components';

const OrderList = () => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const orders = await fetchOrders();

        // Procesa los datos aquí para añadir los campos calculados
        const processedData = orders.map(order => ({
          ...order,
          name: `${order.first_name} ${order.last_name}`,
          formattedDate: new Date(order.order_date).toLocaleDateString(),
          formattedTotal: `$${parseFloat(order.total).toFixed(2)}`
        }));

        setData(processedData);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const handleView = (id) => {
    setSelectedOrderId(id);
  };

  const handleClose = () => {
    setSelectedOrderId(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 40 },
    { field: "name", headerName: "Nombre Completo", width: 200 },
    { field: "shipping_type", headerName: "Tipo de Envío", width: 150 },
    { field: "formattedDate", headerName: "Fecha de Orden", width: 150 },
    { field: "status", headerName: "Estado", width: 120 },
    { field: "formattedTotal", headerName: "Total", width: 120 },
    {
      field: "action",
      headerName: "Acción",
      width: 200,
      renderCell: (params) => (
        <>
          <ViewButton onClick={() => handleView(params.row.id)}>Ver</ViewButton>
          <EditButton primary>Editar</EditButton>
          <MyDeleteOutline onClick={() => handleDelete(params.row.id)} />
        </>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <TheList>
      <DataGrid
        rows={data}
        disableSelectionOnClick
        columns={columns}
        pageSize={10}
        checkboxSelection
      />
      {selectedOrderId !== null && (
        <Modal>
          <ModalContent>
            <CloseButton onClick={handleClose}>✖</CloseButton>
            <OrderDetails orderId={selectedOrderId} />
          </ModalContent>
        </Modal>
      )}
    </TheList>
  );
}

export default OrderList;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out; 

`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  border-radius: 12px;
  animation: slideIn 0.3s ease-in-out;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  transition: color 0.2s;

  &:hover {
      color: #ff0000;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideIn {
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