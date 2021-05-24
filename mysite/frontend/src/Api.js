import axios from 'axios';

let APIbaseURL;

if (process.env.NODE_ENV === 'production') {
    APIbaseURL = window.location.origin + /api/;
} else {
    APIbaseURL = process.env.REACT_APP_API_URL;
}

const axiosInstance = axios.create({
    baseURL: APIbaseURL,
    timeout: 5000,
    headers: {
        Authorization: 'JWT ' + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        console.error(error);
        // handle network error first
        if (error.message === 'Network Error') {
            if (window.location.pathname !== '/networkError/') {
                window.location.href = `/networkError/?next=${window.location.pathname}`;
            }
            return Promise.reject(error);
        }
        // Prevent infinite loops
        if (error.response.status === 401 && originalRequest.url === '/auth/token/refresh/') {
            localStorage.removeItem('username');
            window.location.href = `/account/login/?next=${window.location.pathname}`;
            return Promise.reject(error);
        }

        if (error.response.data.code === 'token_not_valid' && error.response.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

                // exp date in token is expressed in seconds, while now() returns milliseconds:
                const now = Math.ceil(Date.now() / 1000);
                console.log(tokenParts.exp);

                if (tokenParts.exp > now) {
                    return axiosInstance
                        .post('/auth/token/refresh/', { refresh: refreshToken })
                        .then((response) => {
                            localStorage.setItem('access_token', response.data.access);
                            localStorage.setItem('refresh_token', response.data.refresh);

                            axiosInstance.defaults.headers['Authorization'] = 'JWT ' + response.data.access;
                            originalRequest.headers['Authorization'] = 'JWT ' + response.data.access;

                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                } else {
                    console.error('Refresh token is expired', tokenParts.exp, now);
                    localStorage.removeItem('username');
                    window.location.href = `/account/login/?next=${window.location.pathname}`;
                }
            } else {
                console.error('Refresh token not available.');
                localStorage.removeItem('username');
                window.location.href = `/account/login/?next=${window.location.pathname}`;
            }
        }

        // specific error handling done elsewhere
        return Promise.reject(error);
    }
);

export default axiosInstance;
