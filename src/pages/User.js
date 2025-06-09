import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CalendarToday, LocationSearching, MailOutline, PermIdentity, PhoneAndroid } from "@mui/icons-material";
import { ItemContainer, ItemTitleContainer, ItemAddButton, ItemUpdateButton } from "../styles/styled-elements";
import styled from "styled-components";
import { API_ENDPOINTS } from "../apiConfig";

export default function User() {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = process.env.REACT_APP_API_TOKEN;
                const res = await axios.get(`${API_ENDPOINTS.getuser}/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(res.data);
            } catch (error) {
                setUser(null);
            }
        };
        fetchUser();
    }, [userId]);

    if (!user) return <div>Cargando...</div>;

    return (
        <ItemContainer>
            <ItemTitleContainer>
                <h1>Editar Usuario</h1>
            </ItemTitleContainer>
            <UserContainer>
                <ShowUser>
                    <ShowUserTop>
                        <ShowTopTitle>
                            <FontWeight bolder>{user.first_name} {user.last_name}</FontWeight>
                            <FontWeight>{user.username}</FontWeight>
                        </ShowTopTitle>
                    </ShowUserTop>
                    <ShowUserBottom>
                        <UserShowTitle>Detalles de la cuenta</UserShowTitle>
                        <UserShowInfo>
                            <PermIdentity className="showIcon" />
                            <span className="showInfoTitle">{user.username}</span>
                        </UserShowInfo>
                        <UserShowInfo>
                            <CalendarToday className="showIcon" />
                            <span className="showInfoTitle">{user.created_at?.substring(0, 10)}</span>
                        </UserShowInfo>
                        <UserShowInfo>
                            <span className="showInfoTitle">Documento: {user.document_type} {user.document_number}</span>
                        </UserShowInfo>
                        <UserShowTitle>Datos de contacto</UserShowTitle>
                        <UserShowInfo>
                            <PhoneAndroid className="showIcon" />
                            <span className="showInfoTitle">{user.phone}</span>
                        </UserShowInfo>
                        <UserShowInfo>
                            <MailOutline className="showIcon" />
                            <span className="showInfoTitle">{user.email}</span>
                        </UserShowInfo>
                        <UserShowInfo>
                            <LocationSearching className="showIcon" />
                            <span className="showInfoTitle">
                                {user.addresses && user.addresses.length > 0
                                    ? `${user.addresses[0].street}, ${user.addresses[0].city}, ${user.addresses[0].country}`
                                    : "Sin dirección"}
                            </span>
                        </UserShowInfo>
                    </ShowUserBottom>
                </ShowUser>
                <UpdateUser>
                    <UpdateTitle>Editar</UpdateTitle>
                    <UpdateForm>
                        <div>
                            <UpdateItem>
                                <label>Usuario</label>
                                <input
                                    type="text"
                                    defaultValue={user.username}
                                />
                            </UpdateItem>
                            <UpdateItem>
                                <label>Nombre completo</label>
                                <input
                                    type="text"
                                    defaultValue={`${user.first_name} ${user.last_name}`}
                                />
                            </UpdateItem>
                            <UpdateItem>
                                <label>Email</label>
                                <input
                                    type="text"
                                    defaultValue={user.email}
                                />
                            </UpdateItem>
                            <UpdateItem>
                                <label>Teléfono</label>
                                <input
                                    type="text"
                                    defaultValue={user.phone}
                                />
                            </UpdateItem>
                            <UpdateItem>
                                <label>Dirección principal</label>
                                <input
                                    type="text"
                                    defaultValue={
                                        user.addresses && user.addresses.length > 0
                                            ? `${user.addresses[0].street}, ${user.addresses[0].city}, ${user.addresses[0].country}`
                                            : ""
                                    }
                                />
                            </UpdateItem>
                        </div>
                        <UpdateRight>
                            <ItemUpdateButton>Actualizar</ItemUpdateButton>
                        </UpdateRight>
                    </UpdateForm>
                </UpdateUser>
            </UserContainer>
            <DataBox>
                <UserShowTitle style={{marginTop: 0}}>Direcciones</UserShowTitle>
                <StyledTable className="pretty-table">
                    <thead>
                        <tr>
                            <th>Calle</th>
                            <th>Número</th>
                            <th>Apartamento</th>
                            <th>Departamento</th>
                            <th>Ciudad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.addresses && user.addresses.length > 0 ? user.addresses.map(addr => (
                            <tr key={addr.id}>
                                <td>{addr.street}</td>
                                <td>{addr.door_number}</td>
                                <td>{addr.apartment}</td>
                                <td>{addr.department}</td>
                                <td>{addr.city}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: "center" }}>Sin direcciones</td>
                            </tr>
                        )}
                    </tbody>
                </StyledTable>

                <UserShowTitle>Pedidos</UserShowTitle>
                <StyledTable className="pretty-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Total</th>
                            <th>Tipo de envío</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.orders && user.orders.length > 0 ? user.orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.order_date?.substring(0, 10)}</td>
                                <td>{order.status}</td>
                                <td>${order.total}</td>
                                <td>{order.shipping_type}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} style={{ textAlign: "center" }}>Sin pedidos</td>
                            </tr>
                        )}
                    </tbody>
                </StyledTable>
            </DataBox>
        </ItemContainer>
    );
}

const UserContainer = styled.div`
    display: flex;
    margin-top: 20px;
    width: 100%;
    gap: 20px;
    align-items: flex-start;
    /* Permite que los hijos se achiquen */
    flex-wrap: wrap;
`
const ShowUser = styled.div`
    flex: 1 1 0;
    min-width: 0;
    padding: 20px;
    box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    /* Permite que la tabla se adapte */
    overflow-x: auto;
`
const UpdateUser = styled.div`
    flex: 2 1 0;
    min-width: 0;
    padding: 20px;
    box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    margin-left: 20px;
    max-width: 600px;
`
const ShowUserTop = styled.div`
    display: flex;
    align-items: center;
`
const ShowUserBottom = styled.div`
    margin-top: 20px;
`
const ShowTopTitle = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 20px;
`
const FontWeight = styled.span`
    font-weight: ${props => props.bolder ? "600" : "300"};
`
const UserShowTitle = styled.span`
    font-size: 14px;
    font-weight: 600;
    color: rgb(175, 170, 170);
    display: block;
    margin-top: 20px;
`
const UserShowInfo = styled.div`
    display: flex;
    align-items: center;
    margin: 20px 0px;
    color: #444;
    .showIcon{
        font-size: 16px !important;
    }
    .showInfoTitle{
        margin-left: 10px;
    }
`
const UpdateTitle = styled.span`
    font-size: 24px;
    font-weight: 600;
`
const UpdateForm = styled.form`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`
const UpdateItem = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
    label{
        margin-bottom: 5px;
        font-size: 14px;
    }
    input{
        border: none;
        width: 250px;
        height: 30px;
        border-bottom: 1px solid gray;
    }
`
const UpdateRight = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`
const StyledTable = styled.table`
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 18px 0 30px 0;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    border-radius: 8px;
    overflow: hidden;
    th, td {
        border-bottom: 1px solid #e0e0e0;
        padding: 10px 8px;
        font-size: 14px;
        white-space: nowrap;
    }
    th {
        background-color: #f7f7fa;
        font-weight: bold;
        text-align: left;
        color: #3d3d3d;
    }
    tr:last-child td {
        border-bottom: none;
    }
    tr:nth-child(even) {
        background-color: #fcfcfc;
    }
`;

// Nuevo cuadradito para datos
const DataBox = styled.div`
    margin-top: 30px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    border-radius: 8px;
    padding: 24px 20px 20px 20px;
    width: 100%;
    max-width: 900px;
    overflow-x: auto;
`;