const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
 GET_ORDER: `${API_BASE_URL}/orders/get_order`,
 GET_PAIDORDERS: `${API_BASE_URL}/orders/get_paidorders`,
  DELETE_ORDER: `${API_BASE_URL}/orders/delete_order`,
  CHANGE_STATUS: `${API_BASE_URL}/orders/change_order_status`,
  SendEmailOntheWay: `${API_BASE_URL}/emails/sendonthewayemail`,

  // Agrega más endpoints según necesites
};