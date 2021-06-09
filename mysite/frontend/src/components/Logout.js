import axiosInstance from '../api/Api';

function handleLogout() {
    try {
        axiosInstance
            .post('/auth/blacklist/', {
                refresh_token: localStorage.getItem('refresh_token'),
            })
            .then(() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('username');
                axiosInstance.defaults.headers['Authorization'] = null;
                window.location.href = '/';
            });
    } catch (e) {
        console.error(e);
    }
}

export default handleLogout;
