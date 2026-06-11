// Config de axios con el token de autorización para los endpoints
// protegidos del backend. Uso: axios.get(url, authHeaders())
//                              axios.post(url, payload, authHeaders())
export const authHeaders = () => ({
  headers: { Authorization: `Bearer ${process.env.REACT_APP_API_TOKEN}` },
});
