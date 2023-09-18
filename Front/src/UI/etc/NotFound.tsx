import styled from "styled-components";
import CocktailGlass from "../../assets/Loading/CocktailGlass.png";
import { useNavigate } from "react-router-dom";

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

const LoadingText = styled.div`
  font-family: "JejuGothic";
  font-size: 24px;
  margin: 1rem auto;
`;

const SubText = styled.div<{ size: number }>`
  font-family: "NanumSquareNeoBold";
  font-size: ${(props) => props.size}px;
  margin: 0.5rem auto;
`;

const Button = styled.div`
  background-color: white;
  border-radius: 5px;
  color: var(--c-yellow);
  width: 9rem;
  margin: 0 auto;
  padding: 0.5rem;
  font-family: "NanumSquareNeoBold";
`;

const NotFound = () => {
  const navigate = useNavigate();
  const GotoMainHandler = () => {
    navigate(`/`, { replace: true });
  };
  return (
    <LoadingDiv>
      <LoadingText>404 Not Found</LoadingText>
      <CircleDiv>
        <img src={CocktailGlass} />
      </CircleDiv>
      <SubText size={16}>존재하지 않는 페이지입니다</SubText>
      <Button onClick={GotoMainHandler}>메인으로 돌아가기</Button>
    </LoadingDiv>
  );
};

export default NotFound;
