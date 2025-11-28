import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Featured from "../components/Featured";
import RevenueBreakdown from "../components/RevenueBreakdown";
import Chart from "../components/Chart";
import LgWidget from "../components/LgWidget";
import SmWidget from "../components/SmWidget";
import TopProducts from "../components/TopProducts";
import AverageTicket from "../components/AverageTicket";
import ShippingBreakdown from "../components/ShippingBreakdown";
import TopCustomers from "../components/TopCustomers";
import DateFilter from "../components/DateFilter";
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
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const loadSalesData = async () => {
            const data = await getSalesByMonth();
            setSalesData(data);
        };
        loadSalesData();
    }, []);

    return (
        <HomeContainer>
            <DateFilter 
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                onMonthChange={setSelectedMonth}
                onYearChange={setSelectedYear}
            />
            <Featured month={selectedMonth} year={selectedYear} />
            <RevenueBreakdown month={selectedMonth} year={selectedYear} />
            <Chart data={salesData} title="Ventas del Año" grid dataKey="ventas"/>
            <HomeWidgets>
                <SmWidget />
                <LgWidget />
            </HomeWidgets>
            <HomeWidgets>
                <AverageTicket month={selectedMonth} year={selectedYear} />
                <ShippingBreakdown month={selectedMonth} year={selectedYear} />
            </HomeWidgets>
            <FullWidthWidget>
                <TopCustomers month={selectedMonth} year={selectedYear} />
            </FullWidthWidget>
            <FullWidthWidget>
                <TopProducts month={selectedMonth} year={selectedYear} />
            </FullWidthWidget>
        </HomeContainer>
    )
}

export default Home