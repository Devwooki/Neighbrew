import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import CocktailGlass from "../../assets/Loading/CocktailGlass.png";
import logoWhite from "../../assets/logoWhite.png";

const LoadingDiv = styled.div`
  background-color: var(--c-yellow);
  min-height: 80vh;
  padding-top: 20vh;
  color: white;
`;

const CircleDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 20rem;
  height: 9rem;
  width: 9rem;
  margin: 4rem auto 4rem auto;
`;

const SubText = styled.div<{ size: number }>`
  font-family: "NanumSquareNeo";
  font-size: ${(props) => props.size}px;
  margin: 0.5rem auto;
`;

const Button = styled.div`
  background-color: white;
  border-radius: 5px;
  color: var(--c-yellow);
  width: 15rem;
  margin: 1rem auto 0 auto;
  padding: 0.5rem;
  font-family: "NanumSquareNeoBold";
  font-size: 28px;
`;

const Main = () => {
  const navigate = useNavigate();
  const GotoMainHandler = () => {
    navigate("/");
  };
  return (
    <LoadingDiv>
      <SubText size={16}>술에 대한 정보와 경험을 공유하고</SubText>
      <SubText size={16}>취향 맞는 모임을 제공하는</SubText>
      <CircleDiv>
        <img src={CocktailGlass} />
      </CircleDiv>
      <img src={logoWhite} style={{ width: "60%" }} />
      <Button onClick={GotoMainHandler}>시작하기</Button>
    </LoadingDiv>
  );
};

export default Main;
