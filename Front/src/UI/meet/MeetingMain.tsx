/*
[MeetingMain.tsx]
모임 메인 페이지. 상단 탭에서 모임 찾기와 내 모임으로 전환 가능
*/
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MeetingMy from "./MeetingMy";
import MeetingFind from "./MeetingFind";
import NavbarWithoutSearch from "../navbar/NavbarWithoutSearch";
import Footer from "../footer/Footer";

const TopMenu = styled.div`
  height: 2rem;
  display: flex;
  margin: 0 0.5rem 0 0.5rem;
  background-color: white;
  border-bottom: 1px solid var(--c-borderline);
`;

const TopMenuDetail = styled.button<{ isfocused: string }>`
  color: var(
    --${(props) => (props.isfocused === "true" ? "c-black" : "c-gray")}
  );
  font-family: "JejuGothic";
  font-size: 20px;
  line-height: 150%;
  padding: 0 1rem;
  outline: none;
  border: none;
  border-bottom: ${(props) =>
    props.isfocused === "true" ? "2px solid var(--c-black);" : "none;"};
  background: white;
`;

const MainDiv = styled.div`
  padding-bottom: 25vh;
  background: white;
  min-height: 80vh;
`;

const RoundBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 10%;

  background: var(--c-yellow);
  width: 4rem;
  height: 4rem;
  border-radius: 100px;
  z-index: 10;

  @media (max-width: 430px) {
    right: 5%;
  }
  @media (min-width: 431px) {
    left: 350px;
  }
`;

const meetingMain = () => {
  const [selectedMenu, setSelectedMenu] = useState("find");
  const navigate = useNavigate();
  //모임 생성 페이지로 이동
  const GotoCreateHandler = () => {
    navigate(`/meet/create`);
  };

  return (
    <div>
      <header>
        <NavbarWithoutSearch />
      </header>
      <TopMenu>
        <TopMenuDetail
          isfocused={selectedMenu === "find" ? "true" : "false"}
          onClick={() => setSelectedMenu("find")}
        >
          모임찾기
        </TopMenuDetail>
        <TopMenuDetail
          isfocused={selectedMenu === "my" ? "true" : "false"}
          onClick={() => setSelectedMenu("my")}
        >
          내모임
        </TopMenuDetail>
      </TopMenu>
      <MainDiv>
        {selectedMenu === "find" ? <MeetingFind /> : <MeetingMy />}
      </MainDiv>
      <footer>
        <RoundBtn onClick={GotoCreateHandler}>
          <img src="/src/assets/plusButton.svg" width="25rem" />
        </RoundBtn>
        <Footer />
      </footer>
    </div>
  );
};
export default meetingMain;
