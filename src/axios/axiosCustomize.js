import axios from "axios";

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
    (response) => response,
    (error) => {
        console.error(`Error! Status Code: ${error.response.status}`);
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
