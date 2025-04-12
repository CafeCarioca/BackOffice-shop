import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TheList, EditButton, MyDeleteOutline, ViewButton } from "../styles/styled-elements";
import OrderDetails from './OrderDetails';
import { fetchOrdersByDateRange, fetchOrders, deleteOrder, changeOrderStatus } from '../services/orderservices';
import { sendEmailOnTheWay } from '../services/emailservices';
import styled from 'styled-components';

const OrderList = () => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    shippingType: '',
    customerName: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const orders = await fetchOrders();
        const processedData = orders.map(order => ({
          ...order,
          name: `${order.first_name} ${order.last_name}`,
          formattedDate: new Date(order.order_date).toLocaleDateString(),
          formattedTotal: `$${parseFloat(order.total).toFixed(2)}`
        }));

        setData(processedData);
        setFilteredData(processedData);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const applyFilters = () => {
    let filtered = data;

    if (filters.status) {
      filtered = filtered.filter(order => order.status === filters.status);
    }
    if (filters.shippingType) {
      filtered = filtered.filter(order => order.shipping_type === filters.shippingType);
    }
    if (filters.customerName) {
      filtered = filtered.filter(order => order.name.toLowerCase().includes(filters.customerName.toLowerCase()));
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters.status, filters.shippingType, filters.customerName]);

  const fetchFilteredData = async () => {
    if (filters.startDate && filters.endDate) {
      setLoading(true);
      try {
        const orders = await fetchOrdersByDateRange(filters.startDate, filters.endDate);
        const processedData = orders.map(order => ({
          ...order,
          name: `${order.first_name} ${order.last_name}`,
          formattedDate: new Date(order.order_date).toLocaleDateString(),
          formattedTotal: `$${parseFloat(order.total).toFixed(2)}`
        }));
        setData(processedData);
        setFilteredData(processedData);
      } catch (error) {
        console.error("Error fetching orders by date range:", error);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Por favor, seleccione ambas fechas: inicio y fin.");
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Seguro que deseas borrar el pedido?")) {
      return;
    }
    deleteOrder(id);
    setData(data.filter((item) => item.id !== id));
  };

  const handleView = (id) => {
    setSelectedOrderId(id);
  };

  const handleClose = () => {
    setSelectedOrderId(null);
  };

  const handleChangeOrderStatus = (id, status) => {
    if (!window.confirm("Seguro que deseas cambiar el estado del pedido? Esto le notificará al cliente.")) {
      return;
    }
    changeOrderStatus(id, status).then(() => {
      setData(data.map(order => 
        order.id === id ? { ...order, status: status } : order
      ));
      alert(`Estado del pedido actualizado a: ${status}`);
      if (status === "En Camino") {
        sendEmailOnTheWay(id);
      }
    }).catch(error => {
      console.error("Error changing order status:", error);
    });
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
          <MyDeleteOutline
            onClick={() => {
              if (
                params.row.status !== "Pagado" &&
                params.row.status !== "En Camino" &&
                params.row.status !== "Entregado"
              ) {
                handleDelete(params.row.id);
              }
            }}
            disabled={
              params.row.status === "Pagado" ||
              params.row.status === "En Camino" ||
              params.row.status === "Entregado"
            }
            title={
              params.row.status === "Pagado" ||
              params.row.status === "En Camino" ||
              params.row.status === "Entregado"
                ? "No se puede borrar un pedido en este estado"
                : ""
            }
            style={
              params.row.status === "Pagado" ||
              params.row.status === "En Camino" ||
              params.row.status === "Entregado"
                ? { cursor: "not-allowed", opacity: 0.5 }
                : {}
            }
          />
        </>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <TheList>
      <FilterContainer>
        <FilterRow>
          <FilterGroup>
            <FilterLabel>Estado del Pedido:</FilterLabel>
            <Select name="status" onChange={handleFilterChange}>
              <option value="">Todos los Estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="En Camino">En Camino</option>
              <option value="Entregado">Entregado</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Tipo de Envío:</FilterLabel>
            <Select name="shippingType" onChange={handleFilterChange}>
              <option value="">Todos los Tipos de Envío</option>
              <option value="delivery">Delivery</option>
              <option value="takeaway">Takeaway</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Nombre del Cliente:</FilterLabel>
            <Input type="text" name="customerName" placeholder="Nombre del Cliente" onChange={handleFilterChange} />
          </FilterGroup>
        </FilterRow>

        <FilterRow>
          <FilterGroup>
            <FilterLabel>Fecha de Inicio:</FilterLabel>
            <Input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Fecha de Fin:</FilterLabel>
            <Input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </FilterGroup>

          <Button 
            onClick={fetchFilteredData} 
            disabled={!filters.startDate || !filters.endDate}
          >
            Filtrar por fecha
          </Button>
        </FilterRow>
      </FilterContainer>

      <DataGrid
        rows={filteredData}
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
            <div>
              <EditButton onClick={() => handleChangeOrderStatus(selectedOrderId, "En Camino")} style={{ backgroundColor: 'orange' }}>
                En Camino
              </EditButton>
              <EditButton onClick={() => handleChangeOrderStatus(selectedOrderId, "Entregado")} style={{ backgroundColor: 'green', marginLeft: '10px' }}>
                Entregado
              </EditButton>
            </div>
          </ModalContent>
        </Modal>
      )}
    </TheList>
  );
}

export default OrderList;

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FilterLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  outline: none;

  &:focus {
    border-color: #007BFF;
  }
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  outline: none;

  &:focus {
    border-color: #007BFF;
  }
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 22px;
  transition: background-color 0.3s;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }
`;

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

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
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
`;