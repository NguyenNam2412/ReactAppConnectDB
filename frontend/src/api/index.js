import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const fetchTableData = (table, params) => {
  return api.post(`/${table}`, params);
};

export default fetchTableData;
