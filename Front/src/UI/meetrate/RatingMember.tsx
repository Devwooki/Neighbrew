import { styled } from "styled-components";
import { MeetDetail } from "../../Type/types";
import { useEffect, useState } from "react";
import RatingDetail from "./RatingDetail";
import defaultImg from "../../assets/defaultImg.png";
import UserInfoItem from "../components/UserInfoItem";

// 라디오 버튼 컨테이너
const RadioContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 10px;
`;

// 라디오 버튼
// 눌리면 색깔 바뀌게 하기
const RadioButton = styled.button<{ selected: boolean }>`
  height: 35px;
  width: 30%;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  /* border: 1px solid black; */
  /* isSelect에 따라 border 제거 */
  border: ${({ selected }) => (selected ? "none" : "1px solid var(--c-gray)")};
  background-color: ${({ selected }) => (selected ? "var(--c-yellow)" : "white")};
  color: ${({ selected }) => (selected ? "white" : "black")};
`;

const RatingMember = ({ _user, onSelectButton }) => {
  const [selectedButton, setSelectButton] = useState(0);
  const [selectedDesc, setSelectedDesc] = useState("");

  useEffect(() => {
    onSelectButton(selectedButton, selectedDesc); //부모로 전달
  }, [selectedButton, selectedDesc]);

  return (
    // div width: 100%로 해서 가운데 정렬
    <div
      style={{
        width: "100%",
        margin: "0 auto 1rem auto",
        fontFamily: "NanumSquareNeoBold",
      }}
    >
      <UserInfoItem key={_user.userId} user={_user} isMaster={false} width={15} />

      <RadioContainer>
        <RadioButton selected={selectedButton === 1} onClick={() => setSelectButton(1)}>
          좋아요
        </RadioButton>
        <RadioButton selected={selectedButton === 2} onClick={() => setSelectButton(2)}>
          보통이에요
        </RadioButton>

        <RadioButton selected={selectedButton === 3} onClick={() => setSelectButton(3)}>
          아쉬워요
        </RadioButton>
      </RadioContainer>
      <RatingDetail ratingNum={selectedButton} getFunc={desc => setSelectedDesc(desc)} />
    </div>
  );
};

export default RatingMember;
