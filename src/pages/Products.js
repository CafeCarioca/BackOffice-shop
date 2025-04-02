
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TheList } from '../styles/styled-elements';
import EditProductModal from '../components/EditProductModal';

const Container = styled.div`
    flex: 1;
    padding: 2rem;
    overflow-y: auto;
    `;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.5rem;
    `;

const Card = styled.div`
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 1rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    `;

const Title = styled.h3`
    margin: 0;
    font-size: 1.2rem;
    `;

const Price = styled.p`
    font-weight: bold;
    margin: 0.5rem 0;
    `;

const Presentations = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0.5rem 0;
    font-size: 0.9rem;
    `;

const Tag = styled.span`
    display: inline-block;
    padding: 0.2rem 0.5rem;
    margin-top: 0.5rem;
    background-color: ${({ active }) => (active ? '#c5f3d3' : '#f9d6d5')};
    color: ${({ active }) => (active ? '#0a6640' : '#b91c1c')};
    border-radius: 5px;
    font-size: 0.8rem;
    `;

const Actions = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;

    button {
        font-size: 0.8rem;
        padding: 0.4rem 0.8rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    .edit {
        background-color: #e0e7ff;
        color: #1e3a8a;
    }

    .toggle {
        background-color: #fde68a;
        color: #92400e;
    }
    `;

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const url = process.env.BACKEND_URL || "http://localhost:3000/";
            try {
                const response = await fetch(`${url}products`);
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error('Error al cargar productos:', err);
            }
        };
        fetchProducts();
    }, []);

    const toggleAvailability = async (id, available) => {
        const url = process.env.BACKEND_URL || "http://localhost:3000/"
        await fetch(`${url}products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ available: !available })
        })
        .then(() => {
            setProducts(products =>
            products.map(p =>
                p.id === id ? { ...p, available: !available } : p
            )
            );
        })
        .catch(err => console.error('Error al cambiar disponibilidad:', err));
    };

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsEditing(true);
    };
    
    const handleCloseModal = () => {
        setIsEditing(false);
        setSelectedProduct(null);
    };

    return (
        <TheList>

        
        <Container>
        <h2>Productos</h2>
        {isEditing && selectedProduct && (
            <EditProductModal
                product={selectedProduct}
                onClose={handleCloseModal}
                onUpdate={(updated) => {
                setProducts(products.map(p => (p.id === updated.id ? updated : p)));
                handleCloseModal();
                }}
            />
            )}
        <Grid>
            {products.map((product) => (
                <Card key={product.id}>
                <Title>{product.name}</Title>
                <Price>
                {product.presentations?.length > 0
                    ? `Desde $${Math.min(...product.presentations.map(p => parseFloat(p.price))).toFixed(2)}`
                    : `${product.price}`
}
                </Price>
                <Presentations>
                {product.presentations?.map((p, idx) => (
                    <li key={idx}>{p.weight} - ${p.price}</li>
                    ))}
                </Presentations>

                <Tag active={product.available}>
                {product.available ? 'Disponible' : 'No disponible'}
                </Tag>

                <Actions>
                    <button className="edit" onClick={() => handleEdit(product)}>
                    Editar
                    </button>                
                    <button
                    className="toggle"
                    onClick={() => toggleAvailability(product.id, product.available)}
                    >
                    {product.available ? 'Desactivar' : 'Activar'}
                </button>
                </Actions>
            </Card>
            ))}
        </Grid>
        </Container>
    </TheList>
  );
};

export default Products;
