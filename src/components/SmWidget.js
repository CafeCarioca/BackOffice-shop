import { Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { getRecentUsers } from "../services/dashboardServices";
import styled from "styled-components";

const SmWidget = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            const data = await getRecentUsers(5);
            setUsers(data);
        };
        loadUsers();
    }, []);

    return (
        <SmWidgetContainer>
            <SmWidgetTitle>Nuevos Usuarios</SmWidgetTitle>
            <SmWidgetList>
                {users && users.map(user => (
                    <li key={user.id} className="SmWidgetListItem">
                        <SmWidgetImg src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`} alt={user.username} />
                        <SmWidgetUser>
                            <span className="SmWidgetUsername">{user.first_name} {user.last_name}</span>
                            <span className="SmWidgetUserTitle">{user.email}</span>
                        </SmWidgetUser>
                        <SmWidgetButton>
                            <Visibility className="SmWidgetIcon" />
                            Ver
                        </SmWidgetButton>
                    </li>
                ))}
                    
            </SmWidgetList>
        </SmWidgetContainer>
    )
}

export default SmWidget

const SmWidgetContainer = styled.div`
    flex: 1;
    box-shadow: 0px 0px 15px -10px rgba(0, 0, 0, 0.75);
    padding: 20px;
    margin-right: 20px;
`
const SmWidgetTitle = styled.span`
    font-size: 22px;
    font-weight: 600;
`
const SmWidgetImg = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
`
const SmWidgetList = styled.ul`
    margin: 0;
    padding: 0;
    list-style: none;
    .SmWidgetListItem{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0px;
    }
`
const SmWidgetUser = styled.div`
    display: flex;
    flex-direction: column;
    .SmWidgetUsername{
        font-weight: 600;
    }
.SmWidgetUserTitle{
        font-weight: 300;
    }
`
const SmWidgetButton = styled.button`
    display: flex;
    align-items: center;
    border: none;
    border-radius: 10px;
    padding: 7px 10px;
    background-color: #eeeef7;
    color: #555;
    cursor: pointer;
    .SmWidgetIcon{
        font-size: 16px !important;
        margin-right: 5px;
    }
`
