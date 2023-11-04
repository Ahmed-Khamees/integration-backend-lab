import axios from "axios";

export const axiosInstance = axios.create(
    {
        baseURL: "http://localhost:3000",
        Headers: {
            "Content-Type": "application/json",
        }
    }
)

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth");
        if (token) {
            config.headers["Authorization"] = token;
        }
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);