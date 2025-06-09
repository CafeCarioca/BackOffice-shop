const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const API_ENDPOINTS = {
 GET_ORDER: `${API_BASE_URL}/orders/get_order`,
 GET_PAIDORDERS: `${API_BASE_URL}/orders/get_paidorders`,
 GET_ORDERS_BY_DATE: `${API_BASE_URL}/orders/get_ordersbyDateRange`,
  DELETE_ORDER: `${API_BASE_URL}/orders/delete_order`,
  CHANGE_STATUS: `${API_BASE_URL}/orders/change_order_status`,
  SendEmailOntheWay: `${API_BASE_URL}/emails/sendonthewayemail`,
  getusers: `${API_BASE_URL}/users/get_users`,
  getuser: `${API_BASE_URL}/users/get_user`,
  deleteuser: `${API_BASE_URL}/users/delete_user`,
  getLastOrders: `${API_BASE_URL}/orders/get_last_orders`,

  // Agrega más endpoints según necesites
};