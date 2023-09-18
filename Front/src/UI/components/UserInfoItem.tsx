import { useNavigate } from "react-router-dom";
import React from "react";
import styled from "styled-components";
import { User } from "../../Type/types";
import defaultImg from "../../assets/defaultImg.png";

const UserProfileImg = styled.div<{ src: string }>`
  background: url(${props => props.src}) no-repeat center;
  background-size: cover;
  min-width: 4rem;
  border-radius: 100px;
  padding-bottom: 4rem;
`;

type UserInfoItemProps = {
  user: User; // 유저객체
  isMaster?: boolean; //유저가 모임의 주최자인지 아닌지
  width?: number; //텍스트 영역이 가질 너비(단위rem)
};

/**
 * 유저의 이름과 한마디만을 포함해 보여주는 요소.
 * 모임, 팔팔 목록 등 각종 유저 목록에 이용 됨
 * @property {User} user //유저 객체
 * @property {boolean} isMaster [Optional] 유저가 모임의 주최자인지 아닌지
 * @property {number} width [Optional] 텍스트 영역이 가질 너비(단위rem, 기본 15)
 * @todo userId를 받으면 name, intro, imgSrc는 props로 안받아도 될듯?!
 */
const UserInfoItem = (props: UserInfoItemProps) => {
  const navigate = useNavigate();
  //   라우팅 링크는 추후 변경될 수 있음
  const GotoUserDetailHandler = (userId: number) => {
    navigate(`/myPage/${userId}`);
  };
  const width = props.width ? props.width : 15;

  return (
    <div
      style={{
        display: "flex",
        marginTop: "0.5rem",
      }}
      onClick={() => GotoUserDetailHandler(props.user.userId)}
    >
      <UserProfileImg src={props.user.profile === "no image" ? defaultImg : props.user.profile} />
      <div style={{ margin: "auto 0 auto 0.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ fontFamily: "JejuGothic", fontSize: "15px" }}>{props.user.nickname}</div>
          {props.isMaster && <img src="/src/assets/star.svg" />}
        </div>
        <div
          style={{
            fontFamily: "NanumSquareNeo",
            fontSize: "15px",
            color: "var(--c-gray)",
            width: `${width}rem`,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "left",
          }}
        >
          {props.user.intro}
        </div>
      </div>
    </div>
  );
};
export default React.memo(UserInfoItem);
