// 술장 기능을 위한 navbar입니다. 다른 파트분들은 신경쓰지 마세요.
import logo from "../../assets/logo.png";
import styled from "styled-components";
import { searchNavIcon, alertNavIcon } from "../../assets/AllIcon";
import { useNavigate } from "react-router-dom";

const NavCustom = styled.nav`
  display: flex;
  justify-content: space-between;
  padding: 2% 0;
  background-color: white;
  width: 100%;
`;

const BtnDiv = styled.div`
  width: 20%;
  max-width: 20%;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: end;
`;

const Button = styled.button`
  background-color: white;
  border: none;
`;

const Logo = styled.div`
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

type toDrinkpSearchProps = {
  toDrinkSearch: any;
};

const Navbar = (props: toDrinkpSearchProps) => {
  const searchButton = searchNavIcon();
  const alertButton = alertNavIcon();
  const navigate = useNavigate();
  //알림 클릭 시 알림 창으로 이동
  //TODO: 알림 페이지 작업 이후 네비게이터 링크 수정해야
  const GotoAlertHandler = () => {
    navigate(`/myPage/alarm`);
  };
  const GotoHomeHandler = () => {
    navigate("/");
  };

  return (
    <NavCustom>
      <BtnDiv></BtnDiv>
      <Logo onClick={GotoHomeHandler}>
        <img src={logo} width="50%" />
      </Logo>
      <BtnDiv style={{ paddingRight: "0.5rem" }}>
        <Button
          onClick={() => {
            props.toDrinkSearch();
          }}
        >
          {searchButton}
        </Button>
        <Button onClick={GotoAlertHandler}>{alertButton}</Button>
      </BtnDiv>
    </NavCustom>
  );
};

export default Navbar;
