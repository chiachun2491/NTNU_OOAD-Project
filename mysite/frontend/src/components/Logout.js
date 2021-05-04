import axiosInstance from "../Api";


function handleLogout() {
    try {
        const response = axiosInstance.post('/auth/blacklist/', {
            "refresh_token": localStorage.getItem("refresh_token")
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        axiosInstance.defaults.headers['Authorization'] = null;
        console.log('Logout successful');
        window.location.href = '/';
    }
    catch (e) {
        console.log(e);
    }
}

export default handleLogout;
