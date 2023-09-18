import React from "react";
import styled from "styled-components";
import { Meeting } from "../../Type/types";
import defaultImg from "../../assets/defaultImg.png";
import Whiskey from "../../assets/Category/Whiskey.svg";
import Cocktail from "../../assets/Category/Cocktail.svg";
import CraftBeer from "../../assets/Category/CraftBeer.svg";
import Sake from "../../assets/Category/Sake.png";
import SojuBeer from "../../assets/Category/SojuBeer.svg";
import Tradition from "../../assets/Category/Tradition.png";
import Wine from "../../assets/Category/Wine.svg";

const InnerText = styled.div<{ $widthRem: number }>`
  width: ${(props) => props.$widthRem}rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CircleImg = styled.div<{ src: string }>`
  background: url(${(props) => props.src}) no-repeat center;
  width: 1rem;
  padding-bottom: 1rem;
  border-radius: 100px;
  margin-right: 0.2rem;
`;

const UserProfileImg = styled(CircleImg)`
  background-size: cover;
`;

const DrinkCate = styled(CircleImg)`
  background-size: contain;
  background-color: var(--c-pink);
`;

/**
 * 모임 리스트에 모임에 대한 간략 정보를 출력하는 부분.
 * ListInfoItem에 props로 전달되어 content 내부에 들어감
 */
const meetingDetail = ({ meetData }: { meetData: Meeting }) => {
  function formateDate(dateData: string) {
    const date = new Date(dateData);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${month}월 ${day}일 ${hour}시 ${minute}분`;
  }

  const position = `${meetData.sido.sidoName} ${meetData.gugun.gugunName}`;
  const formattedDate = formateDate(meetData.meetDate);

  return (
    <div
      style={{
        fontFamily: "NanumSquareNeo",
        fontSize: "12px",
        lineHeight: "150%",
      }}
    >
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", alignContent: "center", width: "50%" }}>
          <img src="/src/assets/mapPin.svg" width="10rem"></img>
          <InnerText $widthRem={5}>{position}</InnerText>
        </div>
        <div style={{ display: "flex", alignContent: "center" }}>
          <img src="/src/assets/calendar.svg" width="10rem" />
          <InnerText $widthRem={8}>{formattedDate}</InnerText>
        </div>
      </div>
      <InnerText $widthRem={12}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <UserProfileImg
            src={
              meetData.host.profile === "no image"
                ? defaultImg
                : meetData.host.profile
            }
          />
          <div>{meetData.host.nickname}</div>
        </div>
      </InnerText>
      <InnerText $widthRem={12}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {meetData.tagId === 1 && <DrinkCate src={Whiskey} />}
          {meetData.tagId === 2 && <DrinkCate src={Tradition} />}
          {meetData.tagId === 3 && <DrinkCate src={Cocktail} />}
          {meetData.tagId === 4 && <DrinkCate src={Sake} />}
          {meetData.tagId === 5 && <DrinkCate src={Wine} />}
          {meetData.tagId === 6 && <DrinkCate src={CraftBeer} />}
          {meetData.tagId === 7 && <DrinkCate src={SojuBeer} />}
          {meetData.drink.name}
        </div>
      </InnerText>
    </div>
  );
};
export default React.memo(meetingDetail);
