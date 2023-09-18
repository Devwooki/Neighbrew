import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { Drink } from "../../Type/types";
import backIcon from "../../assets/backIcon.svg";
import { callApi } from "../../utils/api";
import SearchBox from "./../components/SearchBox";
import DrinkCard from "./DrinkCard";
import DrinkCategory from "../drinkCategory/DrinkCategory";

const Body = styled.div`
  background-color: white;
  height: 800px;
`;

const SearchDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  background: var(--c-lightgray);
  border-radius: 20px;
`;

const CateDiv = styled.div`
  height: 10rem;
  margin-top: 1rem;
  background: white;
  border-bottom: 1px solid var(--c-borderline);
  div {
    margin: 0;
  }
  .first,
  .second {
    display: flex;
    justify-content: space-around;
    margin-top: 0.5rem;
  }
`;

const ShowcaseBody = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: start;
`;

const DrinkpostSearch = () => {
  const navigate = useNavigate();
  const [searchResult, setSearchResult] = useState<Drink[]>([]);
  //주종 카테고리 선택
  const [selectedCategory, setSelectedCategory] = useState(0);
  const getDrinkCategory = (tagId: number) => {
    setSelectedCategory(tagId);
  };
  const [inputText, setInputText] = useState("");

  //inputText로 술장 검색 api
  useEffect(() => {
    const promise = callApi("get", `api/drink/search?tagId=${selectedCategory}&name=${inputText}`);
    promise.then(res => {
      setSearchResult(res.data.content);
    });
  }, [inputText, selectedCategory]);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          margin: "15px 10px 0px 10px",
        }}
      >
        <div onClick={() => navigate(-1)}>
          <img src={backIcon} alt="" />
        </div>
        <div style={{ width: "85%" }}>
          <SearchDiv>
            <SearchBox
              placeholder="검색어를 입력하세요."
              changeFunc={(inputTxt: string) => {
                setInputText(inputTxt);
              }}
            ></SearchBox>
          </SearchDiv>
        </div>
      </div>
      <CateDiv>
        <DrinkCategory getFunc={getDrinkCategory} />
      </CateDiv>
      <h3
        style={{
          display: "flex",
          justifyContent: "start",
          margin: "20px 0px 0px 20px",
        }}
      >
        검색결과
      </h3>
      <Body className="searchList">
        <ShowcaseBody>
          <div
            className="whole"
            style={{
              display: "flex",
              flexWrap: "wrap",
              paddingBottom: "60px",
            }}
          >
            {searchResult.map(drink => {
              return <DrinkCard key={drink.drinkId} drink={drink}></DrinkCard>;
            })}
          </div>
        </ShowcaseBody>
      </Body>
    </>
  );
};
export default DrinkpostSearch;
