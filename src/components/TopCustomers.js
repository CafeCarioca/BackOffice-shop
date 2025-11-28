import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TopCustomers = ({ month, year }) => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchTopCustomers();
  }, [month, year]);

  const fetchTopCustomers = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
      const API_TOKEN = process.env.REACT_APP_API_TOKEN;
      
      const response = await fetch(`${API_URL}/dashboard/top-customers?limit=5&month=${month}&year=${year}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setCustomers(result);
      }
    } catch (error) {
      console.error('Error fetching top customers:', error);
    }
  };

  return (
    <Container>
      <Title>Top Clientes del Mes</Title>
      <Table>
        <thead>
          <tr>
            <Th>Cliente</Th>
            <Th>Órdenes</Th>
            <Th>Total Gastado</Th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer.id}>
              <Td>
                <Rank>#{index + 1}</Rank>
                <CustomerInfo>
                  <CustomerName>{customer.first_name} {customer.last_name}</CustomerName>
                  <CustomerEmail>{customer.email}</CustomerEmail>
                </CustomerInfo>
              </Td>
              <Td>{customer.order_count}</Td>
              <Td><Amount>${parseFloat(customer.total_spent).toFixed(2)}</Amount></Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TopCustomers;

const Container = styled.div`
  flex: 2;
  padding: 20px;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  border-radius: 10px;
  background: white;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #555;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  color: #999;
  font-weight: 500;
  font-size: 14px;
  border-bottom: 1px solid #eee;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f5f5f5;
`;

const Rank = styled.span`
  display: inline-block;
  width: 30px;
  height: 30px;
  background: #f0f0f0;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
  font-weight: 600;
  color: #666;
  margin-right: 10px;
`;

const CustomerInfo = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

const CustomerName = styled.div`
  font-weight: 500;
  color: #333;
`;

const CustomerEmail = styled.div`
  font-size: 12px;
  color: #999;
`;

const Amount = styled.span`
  font-weight: 600;
  color: #2ecc71;
`;
