import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/api/public/index.php',
  headers: { 'Content-Type': 'application/json' }
});

export default api;
