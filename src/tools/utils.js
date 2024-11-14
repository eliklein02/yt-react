// const navigate = useNavigate();
export const fetchUser = async (token) => {
  console.log(token);
  if (!token) {
    return "not logged in";
  } else {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/secret`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      });
      if (response.ok) {
        console.log("oksy");
      }
      console.log(response);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      // window.location.href = "/server_error";
      console.log(error);
    }
  }
};
