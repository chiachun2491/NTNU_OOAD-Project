function getUserName() {
    const token = localStorage.getItem('access_token');
    if (token) {
        return JSON.parse(atob(token.split('.')[1])).username;
    } else {
        return undefined;
    }
}

export default getUserName;
