import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../etc/Loading";

const GoogleLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const GoogleloginHandler = async () => {
    const temcode = location.search.split("=")[1];
    const code = temcode.split("&")[0];
    axios
      .post("/api/auth/google", {
        code: code,
      })
      .then(res => {
        localStorage.setItem("token", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("myId", JSON.stringify(res.data.userId));
      })
      .then(() => {
        navigate("/drinkpost");
      });
  };
  useEffect(() => {
    GoogleloginHandler();
  }, []);
  return <Loading />;
};
export default GoogleLogin;
