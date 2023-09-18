// 모임, 술장 등 주요 기능에서 사용되는 주종 카테고리를 나타내는 컴포넌트입니다.
// 이미지 소스는 Front/src/assets/AllDrinkCategories 경로에 tsx파일 형태로 있습니다.
// app.tsx는 충돌이 나기 쉬우므로 라우터 설정을 지워놓았습니다.
// 컴포넌트의 확인은 Front/App.tsx에 라우터 설정을 한 뒤 확인하시면 됩니다.

// 이 외 추가사항 : 전통주인 Tradition의 소스 파일인 'assets/AllDrinkCategories/Tradition.tsx에 오류 출력이 되는데 기능상 문제는 없어보입니다.

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { TotalDrink } from "../../assets/AllDrinkCategories/TotalDrink";
import { Whiskey } from "../../assets/AllDrinkCategories/Whiskey";
import { Tradition } from "../../assets/AllDrinkCategories/Tradition";
import { Cocktail } from "../../assets/AllDrinkCategories/Cocktail";
import { Wine } from "../../assets/AllDrinkCategories/Wine";
import { Sake } from "../../assets/AllDrinkCategories/Sake";
import { CraftBeer } from "../../assets/AllDrinkCategories/CraftBeer";
import { SojuBeer } from "../../assets/AllDrinkCategories/SojuBeer";

const CategoryDiv = styled.div<{ $canClick: boolean }>`
  display: inline-block;
  border: none;
  margin: 6px;
  pointer-events: ${(props) => (props.$canClick ? "auto" : "none")};
`;

type DrinkCategoryProps = {
  getFunc: (tagId: number) => void;
  selectedId?: number;
  isSearch?: boolean;
};

/**
 * 주종 카테고리 선택 컴포넌트
 * @property {function} getFunc 태그 아이디 넘겨주는 함수
 * @property {number} selectedId 선택된 카테고리 아이디
 * @property {boolean} isSearch 검색용인지 입력폼인지.디폴트는 true
 */
const DrinkCategory = (props: DrinkCategoryProps) => {
  const [chooseCategoryDiv, setChooseCategoryDiv] = useState(
    props.selectedId ?? 0
  );
  //선택한 태그의 아이디를 부모로 넘김
  useEffect(() => {
    props.getFunc(chooseCategoryDiv);
  }, [chooseCategoryDiv]);

  //선택할 수 없으면 회색으로
  const bgColorSelector = () => {
    if (chooseCategoryDiv === 0) return "var(--c-yellow)";
    else if (props.isSearch ?? true) {
      return "var(--c-lightgray)";
    } else return "var(--c-gray)";
  };

  const totalDrink = TotalDrink(bgColorSelector());
  const whiskey = Whiskey(
    chooseCategoryDiv === 1 ? "var(--c-yellow)" : "var(--c-lightgray)"
  );
  const tradition = Tradition(
    chooseCategoryDiv === 2 ? "var(--c-yellow)" : "var(--c-lightgray)"
  );
  const cocktail = Cocktail(
    chooseCategoryDiv === 3 ? "var(--c-yellow)" : "var(--c-lightgray)"
  );
  const sake = Sake(
    chooseCategoryDiv === 4 ? "var(--c-yellow)" : "var(--c-lightgray)"
  );
  const wine = Wine(
    chooseCategoryDiv === 5 ? "var(--c-yellow)" : "var(--c-lightgray)"
  );
  const craftBeer = CraftBeer(
    chooseCategoryDiv === 6 ? "var(--c-yellow)" : "var(--c-lightgray)"
  );
  const sojuAndBeer = SojuBeer(
    chooseCategoryDiv === 7 ? "var(--c-yellow)" : "var(--c-lightgray)"
  );

  return (
    <div className="drinkCategories">
      <div className="first" style={{ width: "100%" }}>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(0);
          }}
          $canClick={props.isSearch ?? true ? true : false}
          autoFocus
        >
          {totalDrink}
        </CategoryDiv>

        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(1);
          }}
          $canClick={true}
        >
          {whiskey}
        </CategoryDiv>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(2);
          }}
          $canClick={true}
        >
          {tradition}
        </CategoryDiv>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(3);
          }}
          $canClick={true}
        >
          {cocktail}
        </CategoryDiv>
      </div>
      <div className="second" style={{ width: "100%" }}>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(4);
          }}
          $canClick={true}
        >
          {sake}
        </CategoryDiv>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(5);
          }}
          $canClick={true}
        >
          {wine}
        </CategoryDiv>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(6);
          }}
          $canClick={true}
        >
          {craftBeer}
        </CategoryDiv>
        <CategoryDiv
          onClick={() => {
            setChooseCategoryDiv(7);
          }}
          $canClick={true}
        >
          {sojuAndBeer}
        </CategoryDiv>
      </div>
    </div>
  );
};
export default React.memo(DrinkCategory);
