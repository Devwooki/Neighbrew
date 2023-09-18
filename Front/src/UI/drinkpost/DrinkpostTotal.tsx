// main
import { styled } from "styled-components";
import DrinkCard from "./DrinkCard";
import { useState, useEffect } from "react";
import Navbar from "../navbar/NavbarForDrinkpost";
import Footer from "../footer/Footer";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { useNavigate } from "react-router-dom";
import { callApi } from "../../utils/api";
import { Drink } from "../../Type/types";
import plusButton from "../../assets/plusButton.svg";
import NavbarSimple from "../navbar/NavbarSimple";

const ShowcaseBody = styled.div`
  font-size: 14px;
  margin-left: 1vw;
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

// 무한 스크롤

const drinkpostTotal = () => {
  const [page, setPage] = useState(0);
  const [drinkList, setDrinkList] = useState<Drink[]>([]);
  const navigate = useNavigate();
  // const navigate = useNavigate();

  const onIntersect: IntersectionObserverCallback = ([{ isIntersecting }]) => {
    // isIntersecting이 true면 감지했다는 뜻임
    if (isIntersecting) {
      if (page < 10) {
        setTimeout(() => {
          callApi("get", `api/drink?page=${page}&size=12`).then(res => {
            setDrinkList(prev => [...prev, ...res.data.content]);
            setPage(prev => prev + 1);
          });
        }, 100);
      }
    }
  };
  const { setTarget } = useIntersectionObserver({ onIntersect });
  // 위의 두 변수로 검사할 요소를 observer로 설정
  const toDrinkSearch = () => {
    navigate("/drinkpost/search");
  };
  return (
    <>
      <Navbar toDrinkSearch={toDrinkSearch}></Navbar>
      <NavbarSimple title="네이브루의 술장" />
      <ShowcaseBody>
        <div
          className="whole"
          style={{
            display: "flex",
            flexWrap: "wrap",
            paddingBottom: "60px",
            marginLeft: "1px",
          }}
        >
          {drinkList.map(drink => {
            return <DrinkCard key={drink.drinkId} drink={drink}></DrinkCard>;
          })}
        </div>
        <div
          ref={setTarget}
          style={{
            marginTop: "100px",
            height: "5px",
            backgroundColor: "--c-black",
          }}
        ></div>
      </ShowcaseBody>
      <RoundBtn onClick={() => navigate("/drinkpost/create")}>
        <img src={plusButton} width="25rem" />
      </RoundBtn>
      <Footer></Footer>
    </>
  );
};

export default drinkpostTotal;
