// orderService.js
import axios from 'axios';
import { API_ENDPOINTS } from "../apiConfig";

const fetchOrders = async () => {
    const apiUrl = API_ENDPOINTS.GET_PAIDORDERS;
    try {
      const response = await axios.get(apiUrl);
      const orders = response.data.orders;
      if (!Array.isArray(orders)) {
        console.error("Error: La propiedad 'orders' no es un array:", orders);
        return [];
      }
      return orders; // Devuelve un array vacío si no cumple
    } catch (error) {
      console.error("Error fetching orders:", error);
      return []; // Devuelve un array vacío si hay error
    }
  };

  const fetchOrder = async (orderId) => {
    const apiUrl = `${API_ENDPOINTS.GET_ORDER}/${orderId}`;
    console.log("Fetching order:", orderId);
    console.log("API URL:", apiUrl);
    try {
      const response = await axios.get(apiUrl);
      const order = response.data.order;
      console.log("Fetched order:", order);
      return order;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  }

  export { fetchOrders, fetchOrder };