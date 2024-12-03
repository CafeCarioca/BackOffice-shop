import React, { useState } from "react";
import { useHistory } from "react-router-dom"; // Importa useHistory
import styled from "styled-components";
import { ItemContainer, ItemTitleContainer, ViewButton } from "../styles/styled-elements";

const LoginComponent = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory(); // Hook para redireccionar

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("Usuario:", username, "Contraseña:", password);

        if (username && password) {
            onLogin(); // Cambia el estado de autenticación
            history.push("/"); // Redirige a la raíz
        } else {
            alert("Por favor, ingrese usuario y contraseña.");
        }
    };

    return (
        <LoginContainer>
            <LoginTitleContainer>
                <LoginTitle>Iniciar Sesión</LoginTitle>
            </LoginTitleContainer>
            <LoginForm onSubmit={handleSubmit}>
                <LoginInput 
                    type="text" 
                    placeholder="Usuario" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <LoginInput 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <ViewButton type="submit">Ingresar</ViewButton>
            </LoginForm>
        </LoginContainer>
    );
};

export default LoginComponent;

// Estilos reutilizados y nuevos
const LoginContainer = styled(ItemContainer)`
    max-width: 400px;
    margin: auto;
    -webkit-box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    border-radius: 10px;
    background-color: #fff;
`;

const LoginTitleContainer = styled(ItemTitleContainer)`
    margin-bottom: 20px;
`;

const LoginTitle = styled.h3`
    font-size: 22px;
    font-weight: 600;
`;

const LoginForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const LoginInput = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    width: 100%;
`;
