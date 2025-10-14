import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { getFeaturedStats, getTopProducts } from "../services/dashboardServices";

const Featured = () => {
    const [stats, setStats] = useState(null);
    const [topProduct, setTopProduct] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const statsData = await getFeaturedStats();
            const topProductsData = await getTopProducts(1);
            
            setStats(statsData);
            setTopProduct(topProductsData[0] || null);
        };
        loadData();
    }, []);

    if (!stats) return <FeaturedContainer>Cargando...</FeaturedContainer>;

    const featuredData = [
        {
            title: "Ganancias del Mes",
            money: `$${stats.totalRevenue.toFixed(2)}`,
            moneyRate: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}%`,
            isPositive: stats.revenueChange >= 0
        },
        {
            title: "Órdenes del Mes",
            money: stats.totalOrders,
            moneyRate: `${stats.ordersChange >= 0 ? '+' : ''}${stats.ordersChange}%`,
            isPositive: stats.ordersChange >= 0
        },
        {
            title: "Top Producto del Mes",
            money: topProduct ? topProduct.name : "Sin ventas",
            moneyRate: topProduct ? `${topProduct.total_quantity} unidades` : "0",
            isPositive: true,
            isProduct: true
        }
    ];

    return (
        <FeaturedContainer>
            {featuredData.map((item, index) => (
                <FeaturedItem key={index}>
                    <FeaturedTitle>{item.title}</FeaturedTitle>
                    <FeaturedMoneyContainer>
                       <span className={item.isProduct ? "featuredProduct" : "featuredMoney"}>
                           {item.money}
                       </span>
                       {!item.isProduct && (
                          <span className="featuredMoneyRate">
                            {item.moneyRate} 
                            {item.isPositive ? 
                                <ArrowUpward className="featuredIcon"/> : 
                                <ArrowDownward className="featuredIcon negative"/>
                            }
                          </span>
                       )}
                    </FeaturedMoneyContainer>
                    <FeaturedSub>
                        {item.isProduct ? item.moneyRate : "Comparación con mes anterior"}
                    </FeaturedSub>
                </FeaturedItem>
            ))}
        </FeaturedContainer>
    )
}

export default Featured

const FeaturedContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
`
const FeaturedItem = styled.div`
    flex: 1;
    margin: 0px 20px;
    padding: 30px;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
`
const FeaturedTitle = styled.span`
    font-size: 20px;
`
const FeaturedMoneyContainer = styled.div`
    margin: 10px 0px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    
    .featuredMoney{
        font-size: 30px;
        font-weight: 600;
    }
    
    .featuredProduct{
        font-size: 22px;
        font-weight: 600;
        color: #483D8B;
        max-width: 100%;
        word-wrap: break-word;
    }
    
    .featuredMoneyRate{
        display: flex;
        align-items: center;
        margin-left: 20px;
    }
    
    .featuredIcon{
        font-size: 14px;
        margin-left: 5px;
        color: green;
    }
    
    .featuredIcon.negative{
        color: red;
    }
`
const FeaturedSub = styled.span`
    font-size: 15px;
    color: gray;
`