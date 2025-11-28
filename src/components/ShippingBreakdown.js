import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const ShippingBreakdown = ({ month, year }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchShippingBreakdown();
  }, [month, year]);

  const fetchShippingBreakdown = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
      const API_TOKEN = process.env.REACT_APP_API_TOKEN;
      
      const response = await fetch(`${API_URL}/dashboard/shipping-breakdown?month=${month}&year=${year}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        const formattedData = result.map(item => ({
          name: item.shipping_type === 'delivery' ? 'Delivery' : 'Takeaway',
          value: item.count,
          revenue: parseFloat(item.revenue)
        }));
        setData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching shipping breakdown:', error);
    }
  };

  const COLORS = ['#3498db', '#e74c3c'];

  return (
    <Container>
      <Title>Órdenes por Tipo de Envío</Title>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name, props) => [`${value} órdenes ($${props.payload.revenue.toFixed(2)})`, props.payload.name]} />
        </PieChart>
      </ResponsiveContainer>
      <Stats>
        {data.map((item, index) => (
          <StatItem key={index}>
            <ColorDot color={COLORS[index]} />
            <StatText>
              <strong>{item.name}:</strong> {item.value} órdenes - ${item.revenue.toFixed(2)}
            </StatText>
          </StatItem>
        ))}
      </Stats>
    </Container>
  );
};

export default ShippingBreakdown;

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
  margin-bottom: 20px;
`;

const Stats = styled.div`
  margin-top: 20px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ColorDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 10px;
`;

const StatText = styled.span`
  font-size: 14px;
  color: #666;
`;
