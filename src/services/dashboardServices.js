const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const API_TOKEN = process.env.REACT_APP_API_TOKEN;

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_TOKEN}`
};

// Obtener estadísticas principales
export const getFeaturedStats = async (month, year) => {
  try {
    const params = month && year ? `?month=${month}&year=${year}` : '';
    const response = await fetch(`${API_URL}/dashboard/stats${params}`, { headers });
    if (!response.ok) throw new Error('Error al obtener estadísticas');
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured stats:', error);
    return {
      totalRevenue: 0,
      totalSales: 0,
      totalOrders: 0,
      revenueChange: 0,
      salesChange: 0,
      ordersChange: 0
    };
  }
};

// Obtener ventas por mes
export const getSalesByMonth = async () => {
  try {
    const response = await fetch(`${API_URL}/dashboard/sales-by-month`, { headers });
    if (!response.ok) throw new Error('Error al obtener ventas mensuales');
    return await response.json();
  } catch (error) {
    console.error('Error fetching sales by month:', error);
    return [];
  }
};

// Obtener últimos usuarios registrados
export const getRecentUsers = async (limit = 5) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/recent-users?limit=${limit}`, { headers });
    if (!response.ok) throw new Error('Error al obtener usuarios recientes');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent users:', error);
    return [];
  }
};

// Obtener últimas órdenes
export const getRecentOrders = async (limit = 5) => {
  try {
    const response = await fetch(`${API_URL}/dashboard/recent-orders?limit=${limit}`, { headers });
    if (!response.ok) throw new Error('Error al obtener órdenes recientes');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    return [];
  }
};

// Obtener productos más vendidos
export const getTopProducts = async (limit = 5, month, year) => {
  try {
    const params = month && year ? `&month=${month}&year=${year}` : '';
    const response = await fetch(`${API_URL}/dashboard/top-products?limit=${limit}${params}`, { headers });
    if (!response.ok) throw new Error('Error al obtener productos más vendidos');
    return await response.json();
  } catch (error) {
    console.error('Error fetching top products:', error);
    return [];
  }
};
