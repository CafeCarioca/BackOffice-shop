import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getRecentOrders } from "../services/dashboardServices";

const LgWidget = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const loadOrders = async () => {
            const data = await getRecentOrders(5);
            setOrders(data);
        };
        loadOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch(status.toLowerCase()) {
            case 'approved':
            case 'completada':
                return { bgColor: "#e5faf2", fdColor: "#3bb077" };
            case 'pending':
            case 'pendiente':
                return { bgColor: "#fff4e5", fdColor: "#e09f3e" };
            case 'cancelled':
            case 'cancelada':
                return { bgColor: "#ffe5e5", fdColor: "#d32f2f" };
            default:
                return { bgColor: "#ebf1fe", fdColor: "#2a7ade" };
        }
    };

    return (
        <LgWidgetContainer>
            <LgWidgetTitle>Últimas Órdenes</LgWidgetTitle>
            <LgWidgetTable>
                <thead>
                    <tr>
                        <LgWidgetTh>Cliente</LgWidgetTh>
                        <LgWidgetTh>Fecha</LgWidgetTh>
                        <LgWidgetTh>Monto</LgWidgetTh>
                        <LgWidgetTh>Estado</LgWidgetTh>
                    </tr>
                </thead>
                <tbody>
                    {orders && orders.map(order => {
                        const statusStyle = getStatusStyle(order.status);
                        return (
                            <tr key={order.id}>
                                <LgWidgetUser>
                                    <LgWidgetImg 
                                        src={`https://ui-avatars.com/api/?name=${order.user_name}&background=random`}
                                        alt={order.user_name}
                                    />
                                    <span>{order.user_name}</span>
                                </LgWidgetUser>
                                <LightTd>{new Date(order.order_date).toLocaleDateString('es-ES')}</LightTd>
                                <LightTd>${parseFloat(order.total).toFixed(2)}</LightTd>
                                <td>
                                    <LgWidgetButton 
                                        bgcolor={statusStyle.bgColor} 
                                        fdcolor={statusStyle.fdColor}
                                    >
                                        {order.status}
                                    </LgWidgetButton>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </LgWidgetTable>
        </LgWidgetContainer>
    )
}

export default LgWidget

const LgWidgetContainer = styled.div`
    flex: 2;
    -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    padding: 20px;
`
const LgWidgetTitle = styled.h3`
    font-size: 22px;
    font-weight: 600;
`
const LgWidgetButton = styled.button`
    padding: 5px 7px;
    border: none;
    border-radius: 10px;
    background-color:${props => props.bgColor || "#ebf1fe"};
    color:${props => props.fdColor || "#2a7ade"};
`
const LgWidgetTable = styled.table`
    width: 100%;
    border-spacing: 20px;
`
const LgWidgetTh = styled.th`
    text-align: left;
`
const LgWidgetUser = styled.td`
    display: flex;
    align-items: center;
    font-weight: 600;
`
const LgWidgetImg = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
`
const LightTd = styled.td`
    font-weight: 300;
`