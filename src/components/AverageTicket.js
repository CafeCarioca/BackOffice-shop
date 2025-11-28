import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const AverageTicket = ({ month, year }) => {
  const [data, setData] = useState({ average_ticket: 0, total_orders: 0 });

  useEffect(() => {
    fetchAverageTicket();
  }, [month, year]);

  const fetchAverageTicket = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
      const API_TOKEN = process.env.REACT_APP_API_TOKEN;
      
      const response = await fetch(`${API_URL}/dashboard/average-ticket?month=${month}&year=${year}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching average ticket:', error);
    }
  };

  return (
    <Container>
      <Title>Ticket Promedio</Title>
      <Amount>${parseFloat(data.average_ticket).toFixed(2)}</Amount>
      <Subtitle>Basado en {data.total_orders} órdenes pagadas</Subtitle>
    </Container>
  );
};

export default AverageTicket;

const Container = styled.div`
  flex: 1;
  padding: 20px;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  border-radius: 10px;
  background: white;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #555;
  margin-bottom: 10px;
`;

const Amount = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: #2ecc71;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #999;
  margin-top: 10px;
`;
