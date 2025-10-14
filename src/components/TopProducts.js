import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getTopProducts } from "../services/dashboardServices";

const TopProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await getTopProducts(5);
            setProducts(data);
        };
        loadProducts();
    }, []);

    return (
        <Container>
            <Title>Top 5 Productos del Mes</Title>
            <ProductList>
                {products.map((product, index) => (
                    <ProductItem key={product.id}>
                        <Rank>{index + 1}</Rank>
                        <ProductInfo>
                            <ProductName>{product.name}</ProductName>
                            <ProductStats>
                                {product.total_quantity} unidades vendidas · ${parseFloat(product.total_revenue).toFixed(2)}
                            </ProductStats>
                        </ProductInfo>
                    </ProductItem>
                ))}
                {products.length === 0 && (
                    <EmptyMessage>No hay ventas este mes</EmptyMessage>
                )}
            </ProductList>
        </Container>
    );
};

export default TopProducts;

const Container = styled.div`
    flex: 1;
    box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    padding: 20px;
    margin: 20px;
    border-radius: 10px;
    background: white;
`;

const Title = styled.h3`
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
`;

const ProductList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const ProductItem = styled.li`
    display: flex;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
        border-bottom: none;
    }
`;

const Rank = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 18px;
    margin-right: 15px;
    flex-shrink: 0;
`;

const ProductInfo = styled.div`
    flex: 1;
    min-width: 0;
`;

const ProductName = styled.div`
    font-weight: 600;
    font-size: 16px;
    color: #333;
    margin-bottom: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ProductStats = styled.div`
    font-size: 14px;
    color: #666;
`;

const EmptyMessage = styled.div`
    text-align: center;
    padding: 40px 20px;
    color: #999;
    font-size: 16px;
`;
