import axios from 'axios';
import { API_ENDPOINTS } from "../apiConfig";

const sendEmailOnTheWay = async (orderId) => {
    const apiUrl = `${API_ENDPOINTS.SendEmailOntheWay}`;
    const requestBody = {
        orderId: orderId,
        newStatus: "En Camino"
    };
    try {
        const response = await axios.post(apiUrl, requestBody);
        console.log("Email sent:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending email:", error);
        return null;
    }
}

export { sendEmailOnTheWay };