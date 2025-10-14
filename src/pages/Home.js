import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Featured from "../components/Featured";
import RevenueBreakdown from "../components/RevenueBreakdown";
import Chart from "../components/Chart";
import LgWidget from "../components/LgWidget";
import SmWidget from "../components/SmWidget";
import TopProducts from "../components/TopProducts";
import { getSalesByMonth } from "../services/dashboardServices";

const HomeContainer = styled.div`
    flex: 4;
`

const HomeWidgets = styled.div`
    display: flex;
    margin: 20px;
`

const FullWidthWidget = styled.div`
    width: 100%;
`

const Home = () => {
    const [salesData, setSalesData] = useState([]);

    useEffect(() => {
        const loadSalesData = async () => {
            const data = await getSalesByMonth();
            setSalesData(data);
        };
        loadSalesData();
    }, []);

    return (
        <HomeContainer>
            <Featured />
            <RevenueBreakdown />
            <Chart data={salesData} title="Ventas del Año" grid dataKey="ventas"/>
            <HomeWidgets>
                <SmWidget />
                <LgWidget />
            </HomeWidgets>
            <FullWidthWidget>
                <TopProducts />
            </FullWidthWidget>
        </HomeContainer>
    )
}

export default Home