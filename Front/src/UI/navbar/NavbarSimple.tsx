import { useNavigate } from "react-router-dom";
import { arrowLeftIcon } from "../../assets/AllIcon";
import styled from "styled-components";

const Title = styled.div`
  text-align: center;
  font-family: "JejuGothic";
  font-size: 20px;
  width: 60%;
`;

const ArrowBtn = styled.div`
  cursor: pointer;
  /* position: absolute; */
  top: 1rem;
  left: 1rem;
  padding-left: 1rem;

  text-align: start;
`;

/**
 * 상단바 간단한 버전.
 * 모임 관리, 모임 만들기, 술 정보 조회 등에 사용.
 * 뒤로 가기 버튼과 제목만 포함
 * @property {string} title 상단에 들어갈 제목
 */
const NavbarSimple = ({ title }: { title: string }) => {
  const ArrowLeftIcon = arrowLeftIcon("var(--c-black)");
  const navigate = useNavigate();

  const GoBackHandler = () => {
    navigate(-1);
  };
  return (
    <div
      style={{
        display: "flex",
        padding: "1rem 0rem 1rem 0rem",
        background: "white",
      }}
    >
      <div style={{ width: "20%" }}>
        <ArrowBtn onClick={GoBackHandler}>{ArrowLeftIcon}</ArrowBtn>
      </div>
      <Title>{title}</Title>
      <div style={{ width: "20%", visibility: "hidden", paddingRight: "0.5rem" }}></div>
    </div>
  );
};

export default NavbarSimple;
