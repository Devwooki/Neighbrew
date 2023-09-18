// main
import { styled } from "styled-components";
import DrinkCard from "../drinkpost/DrinkCard";
import { useState, useEffect } from "react";

import Footer from "../footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { callApi } from "../../utils/api";
import { Drink } from "../../Type/types";
import EmptyMsg from "../components/EmptyMsg.tsx";

const ShowcaseBody = styled.div`
  font-size: 14px;
  margin-left: 1vw;
`;

const DrinkPostUseInUser = () => {
  const { userid } = useParams();
  const [drinkList, setDrinkList] = useState<Drink[]>([]);
  const navigate = useNavigate();
  const toDrinkSearch = () => {
    navigate("/drinkpost/search");
  };
  const myDrinkHandler = () => {
    callApi("get", `api/drink/user/${userid}/review-drink`).then(res => {
      setDrinkList(res.data);
    });
  };
  useEffect(() => {
    myDrinkHandler();
  }, []);
  return (
    <>
      <ShowcaseBody>
        <div style={{ textAlign: "start" }}></div>
        {drinkList.length === 0 ? (
          <EmptyMsg
            title="술장이 비었습니다.🍾"
            contents="다양한 주종을 즐기고 후기를 남겨보세요!"
          />
        ) : (
          <div
            className="whole"
            style={{ display: "flex", flexWrap: "wrap", paddingBottom: "60px", marginLeft: "1px" }}
          >
            {drinkList.map(drink => (
              <DrinkCard key={drink.drinkId} drink={drink}></DrinkCard>
            ))}
          </div>
        )}

        <div
          style={{
            marginTop: "100px",
            height: "5px",
            backgroundColor: "--c-black",
          }}
        ></div>
      </ShowcaseBody>
      <Footer></Footer>
    </>
  );
};

export default DrinkPostUseInUser;
