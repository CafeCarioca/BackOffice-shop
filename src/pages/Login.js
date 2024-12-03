import React from "react";
import styled from "styled-components";
import LoginComponent from "../components/Login";

const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
`;

const Login = ({ onLogin }) => {
    return (
        <LoginContainer>
            <LoginComponent onLogin={onLogin} />
        </LoginContainer>
    );
};

export default Login;
