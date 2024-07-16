import axios from "axios";
import { toast } from "react-toastify";

const axiosJson = axios.create({
    baseURL: "https://localhost:7186/api",
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
    }
});

const axiosFormData = axios.create({
    baseURL: "https://localhost:7186/api",
    headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem("jwt")}`
    }
});

axiosJson.interceptors.response.use(
    (response) => {
        // Xử lý phản hồi thành công (200 OK)
        return response;
    },
    (error) => {
        if (error.response) {
            // Lỗi phản hồi từ server
            console.error('Response error:', error.response);
            const status = error.response.status;
            if (status === 403) {
                toast.error('Tài khoản của bạn đã bị khóa');
                // } else if (status === 404) {
                //     toast.error('Sai tên đăng nhập hoặc mật khẩu');
            } else if (status === 401) {
                toast.error('Không được phép truy cập');
            } else {
                toast.error(`Lỗi từ server: ${status}`);
            }
        } else if (error.request) {
            // Lỗi không nhận được phản hồi từ server
            console.error('Request error:', error.request);
            toast.error('Không thể kết nối đến server');
        } else {
            // Lỗi xảy ra khi thiết lập yêu cầu
            console.error('Error:', error.message);
            toast.error('Đã xảy ra lỗi khi đăng nhập');
        }
        return Promise.reject(error);
    }
);

axiosFormData.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(`Error! Status Code: ${error.response.status}`);
        return Promise.reject(error);
    }
);

export { axiosJson, axiosFormData };
