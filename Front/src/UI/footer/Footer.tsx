import styled from "styled-components";
import {
  breweryFooterIcon,
  chatFooterIcon,
  meetingFooterIcon,
  myPageFooterIcon,
} from "../../assets/AllIcon";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Button = styled.button`
  width: 40%;
  display: inline-block;
  height: 3.5rem;
  background-color: white;
  border: none;
  margin: 0 auto 2px auto;
`;

const Footer = () => {
  const [chooseMenu, setChooseMenu] = useState(0);
  const breweryIcon = breweryFooterIcon(chooseMenu === 0 ? "black" : "#AAAAAA");
  const meetingIcon = meetingFooterIcon(chooseMenu === 1 ? "black" : "#AAAAAA");
  const chatIcon = chatFooterIcon(chooseMenu === 2 ? "black" : "#AAAAAA");
  const myIcon = myPageFooterIcon(chooseMenu === 3 ? "black" : "#AAAAAA");
  const navigate = useNavigate();
  const userid = localStorage.getItem("myId");
  const chooseMenuHandler = (num: number) => {
    setChooseMenu(num);
    localStorage.setItem("chooseMenu", num.toString());
  };

  useEffect(() => {
    setChooseMenu(parseInt(localStorage.getItem("chooseMenu") ?? "0"));
  }, []);
  return (
    <footer
      className="footer"
      style={{
        borderTop: "1px solid var(--c-borderline)",
        position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <Button
        onClick={() => {
          chooseMenuHandler(0);
          navigate("/drinkpost");
        }}
      >
        {breweryIcon}
      </Button>
      <Button
        onClick={() => {
          chooseMenuHandler(1);
          navigate("/meet");
        }}
      >
        {meetingIcon}
      </Button>

      <Button
        onClick={() => {
          chooseMenuHandler(2);
          navigate("/chatList");
        }}
      >
        {chatIcon}
      </Button>
      <Button
        onClick={() => {
          chooseMenuHandler(3);
          navigate(`/myPage/${userid}`);
        }}
      >
        {myIcon}
      </Button>
    </footer>
  );
};
export default Footer;
