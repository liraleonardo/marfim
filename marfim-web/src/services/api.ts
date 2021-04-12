import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8082',
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // TODO: redirect to signin page when error is 401 unauthorized
    // if (error.response.status === 401) {
    //   // equivalent to logout
    //   localStorage.clear();
    //   window.location.pathname = '/signin';
    // }
    return Promise.reject(error);
  },
);

export default api;
