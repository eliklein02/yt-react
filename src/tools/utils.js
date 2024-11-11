// const navigate = useNavigate();
export const fetchUser = async (token) => {
  if (!token) {
    return "not logged in";
  } else {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/secret`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      window.location.href = "/server_error";
    }
  }
};
