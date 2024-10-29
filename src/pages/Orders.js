import React, { useState } from 'react';
import { DataGrid } from "@material-ui/data-grid";
import { orderRows, userRows } from "../dummyData"; // Asegúrate de importar también los usuarios
import { TheList, EditButton, MyDeleteOutline, ViewButton } from "../styles/styled-elements";
import OrderDetails from './OrderDetails'; // Importa el componente OrderDetails
import styled from 'styled-components';

const OrderList = () => {
  const [data, setData] = useState(orderRows);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "customer",
      headerName: "Customer",
      width: 200,
      valueGetter: (params) => {
        const user = userRows.find(user => user.id === params.row.user_id);
        return user ? user.username : "Unknown";
      },
    },
    {
      field: "date",
      headerName: "Order Date",
      width: 200,
      valueGetter: (params) => new Date(params.row.order_date).toLocaleDateString(),
    },
    { field: "amount", headerName: "Amount", width: 200, valueGetter: (params) => `$${params.row.total.toFixed(2)}` },
    {
      field: "status",
      headerName: "Status",
      width: 200,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <ViewButton onClick={() => handleView(params.row.id)}>Ver</ViewButton>
            <EditButton primary>Edit</EditButton>
            <MyDeleteOutline onClick={() => handleDelete(params.row.id)} />
          </>
        );
      },
    },
  ];

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
    padding: 30px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
    position: relative;
    width: 90%;
    max-width: 700px;
    border-radius: 12px;
    animation: slideIn 0.3s ease-in-out;
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