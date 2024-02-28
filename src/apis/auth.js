export const getJwtToken = () => localStorage.getItem('jwt_token');
export const setJwtToken = (token) => localStorage.setItem('jwt_token', token);
