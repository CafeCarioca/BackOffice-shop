import axios from 'axios';
import { API_ENDPOINTS } from "../apiConfig";

const sendEmailOnTheWay = async (orderId) => {
    const apiUrl = `${API_ENDPOINTS.SendEmailOntheWay}`;
    const requestBody = {
        orderId: orderId,
        newStatus: "En Camino"
    };
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_API_TOKEN}` // Replace with your actual token
    };
    try {
        const response = await axios.post(apiUrl, requestBody, { headers });
        console.log("Email sent:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending email:", error);
        return null;
    }
}

export { sendEmailOnTheWay };