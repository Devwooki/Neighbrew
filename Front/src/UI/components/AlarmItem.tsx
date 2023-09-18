import styled from "styled-components";
import defaultImg from "../../assets/defaultImg.png";
import { AlarmLog } from "../../Type/types";
// 임시 타입입니다. 후에 api를 받아오고 형식이 정해지면 types에 interface로 만들겠습니다.

const ItemDiv = styled.div`
  display: flex;
  margin: 0.5rem 1rem 0.5rem 1rem;
`;

const ProfileDiv = styled.div`
  width: 100%;
  height: 100%;
  aspect-ratio: 1/1;
  border-radius: 30px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const AlarmContent = styled.div`
  // 폰트 맘에 드는거 비교해보라고 둘 다 해놨습니다.
  font-family: "NanumSquareNeo";
  word-break: break-all;
  text-align: start;
`;

const alarmItem = ({ alarm }: { alarm: AlarmLog }) => {
  return (
    <>
      <ItemDiv>
        <div style={{ width: "3rem", height: "3rem", marginRight: "12px" }}>
          <ProfileDiv
            style={{
              backgroundImage: `url(${
                alarm.sender.profile !== "no image" ? alarm.sender.profile : defaultImg
              })`,
            }}
          ></ProfileDiv>
        </div>
        <AlarmContent>{alarm.content}</AlarmContent>
      </ItemDiv>
    </>
  );
};
export default alarmItem;
