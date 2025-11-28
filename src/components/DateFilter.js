import React from 'react';
import styled from 'styled-components';

const DateFilter = ({ selectedMonth, selectedYear, onMonthChange, onYearChange }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  
  const months = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
  ];

  return (
    <Container>
      <Label>Filtrar por período:</Label>
      <Select value={selectedMonth} onChange={(e) => onMonthChange(parseInt(e.target.value))}>
        {months.map(month => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </Select>
      <Select value={selectedYear} onChange={(e) => onYearChange(parseInt(e.target.value))}>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </Select>
    </Container>
  );
};

export default DateFilter;

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
  border-radius: 10px;
  margin: 20px;
`;

const Label = styled.span`
  font-weight: 500;
  color: #555;
`;

const Select = styled.select`
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;
