// import { useNavigate } from "react-router-dom";

export const useFetchApi = () => {
  // const navigate = useNavigate();

  return async (url, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return (window.location.href = "/login");
    }
    options.headers = {
      Authorization: `Bearer: ${token}`,
      ...(options.headers || {}),
    };
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
};
