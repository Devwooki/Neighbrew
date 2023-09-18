import axios from "axios";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../etc/Loading";

const NaverLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const NaverloginHandler = async () => {
    const temcode = location.search.split("=")[1];
    const code = temcode.split("&")[0];
    const state = location.search.split("=")[2];
    axios
      .post("/api/auth/naver", {
        authorizationCode: code,
        state: state,
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
    NaverloginHandler();
  }, []);
  return <Loading />;
};
export default NaverLogin;
