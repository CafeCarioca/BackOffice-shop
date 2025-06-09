import React, { useState, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { API_ENDPOINTS } from "../apiConfig";
import { Link } from "react-router-dom";
import { TheList, EditButton, MyDeleteOutline } from "../styles/styled-elements";

const UserList = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = process.env.REACT_APP_API_TOKEN;
            try {
                const res = await axios.get(API_ENDPOINTS.getusers, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                setData(res.data);
            } catch (error) {
                console.error(error);
                setData([]);
            }
        };
        fetchData();
    }, []);

    const handleDelete = (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            return;
        }
        setData(data.filter((item) => item.id !== id));
        const token = process.env.REACT_APP_API_TOKEN;
        // Aquí podrías agregar la llamada a la API para borrar si lo necesitas
        axios.delete(`${API_ENDPOINTS.deleteuser}/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "first_name", headerName: "Nombre", width: 130 },
        { field: "last_name", headerName: "Apellido", width: 130 },
        { field: "phone", headerName: "Teléfono", width: 130 },

        {
            field: "action",
            headerName: "Acción",
            width: 150,
            renderCell: (params) => (
                <>
                    <Link to={"/user/" + params.row.id}>
                        <EditButton primary>Ver</EditButton>
                    </Link>
                    <MyDeleteOutline
                        onClick={() => handleDelete(params.row.id)}
                    />
                </>
            ),
        },
    ];

    return (
        <TheList>
            <DataGrid
                rows={data}
                disableSelectionOnClick
                columns={columns}
                pageSize={10}
                checkboxSelection
            />
        </TheList>
    );
};

export default UserList;