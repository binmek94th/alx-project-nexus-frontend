export const checkLogin = () => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    return !!(token && user);
}