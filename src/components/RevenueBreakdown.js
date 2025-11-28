import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getFeaturedStats } from "../services/dashboardServices";
import { TrendingUp, AccountBalance, AttachMoney } from "@mui/icons-material";

const RevenueBreakdown = ({ month, year }) => {
    const [stats, setStats] = useState(null);
    const MP_COMMISSION = 0.0609; // 6.09% comisión Mercado Pago

    useEffect(() => {
        const loadStats = async () => {
            const data = await getFeaturedStats(month, year);
            setStats(data);
        };
        loadStats();
    }, [month, year]);

    if (!stats) return <Container>Cargando...</Container>;

    const grossRevenue = stats.totalRevenue;
    const mpCommission = grossRevenue * MP_COMMISSION;
    const netRevenue = grossRevenue - mpCommission;

    return (
        <Container>
            <Title>💰 Análisis de Ingresos del Mes</Title>
            
            <BreakdownGrid>
                <Card color="#4CAF50">
                    <IconWrapper color="#4CAF50">
                        <TrendingUp />
                    </IconWrapper>
                    <CardContent>
                        <Label>Ingresos Brutos</Label>
                        <Amount>${grossRevenue.toFixed(2)}</Amount>
                        <Sublabel>Total facturado</Sublabel>
                    </CardContent>
                </Card>

                <Card color="#FF9800">
                    <IconWrapper color="#FF9800">
                        <AccountBalance />
                    </IconWrapper>
                    <CardContent>
                        <Label>Comisión Mercado Pago</Label>
                        <Amount negative>-${mpCommission.toFixed(2)}</Amount>
                        <Sublabel>6.09% por transacción</Sublabel>
                    </CardContent>
                </Card>

                <Card color="#2196F3" highlight>
                    <IconWrapper color="#2196F3">
                        <AttachMoney />
                    </IconWrapper>
                    <CardContent>
                        <Label>Ganancias Netas</Label>
                        <Amount large>${netRevenue.toFixed(2)}</Amount>
                        <Sublabel>Lo que realmente recibís</Sublabel>
                    </CardContent>
                </Card>
            </BreakdownGrid>

            <Summary>
                <SummaryItem>
                    <SummaryLabel>Margen efectivo:</SummaryLabel>
                    <SummaryValue>{(100 - MP_COMMISSION * 100).toFixed(2)}%</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                    <SummaryLabel>Comisión promedio por orden:</SummaryLabel>
                    <SummaryValue>
                        ${stats.totalOrders > 0 ? (mpCommission / stats.totalOrders).toFixed(2) : '0.00'}
                    </SummaryValue>
                </SummaryItem>
            </Summary>
        </Container>
    );
};

export default RevenueBreakdown;

const Container = styled.div`
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #333;
`;

const BreakdownGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
`;

const Card = styled.div`
    background: ${props => props.highlight ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white'};
    border: ${props => props.highlight ? 'none' : `2px solid ${props.color}20`};
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: transform 0.2s, box-shadow 0.2s;
    color: ${props => props.highlight ? 'white' : '#333'};

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    }
`;

const IconWrapper = styled.div`
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: ${props => props.color}20;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
        font-size: 32px;
        color: ${props => props.color};
    }
`;

const CardContent = styled.div`
    flex: 1;
`;

const Label = styled.div`
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    opacity: 0.9;
`;

const Amount = styled.div`
    font-size: ${props => props.large ? '32px' : '28px'};
    font-weight: 700;
    margin-bottom: 4px;
    color: ${props => props.negative ? '#f44336' : 'inherit'};
`;

const Sublabel = styled.div`
    font-size: 12px;
    opacity: 0.7;
`;

const Summary = styled.div`
    display: flex;
    justify-content: space-around;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 8px;
    margin-top: 20px;
`;

const SummaryItem = styled.div`
    text-align: center;
`;

const SummaryLabel = styled.div`
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
`;

const SummaryValue = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #333;
`;
