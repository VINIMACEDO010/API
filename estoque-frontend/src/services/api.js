import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost/api/public/index.php',
  headers: { 'Content-Type': 'application/json' }
});
