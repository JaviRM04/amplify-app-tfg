import axios from 'axios';

const api = axios.create({
  baseURL: 'https://p5r9b8qtui.execute-api.eu-central-1.amazonaws.com',
  headers: {
    'Authorization': 'abc123'
  }
});

export default api;
