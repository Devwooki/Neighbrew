/*
[PeopleNumInfo.tsx]
모임 리스트와 상세 페이지에 모임 인원 정보 출력
- ListInfoItem에 props로 전달되어 numberInfo 내부에 들어감
- 모임 상세 페이지 상단에, 하단 참여인원 정보에 들어감
자세한 props는 type PeopleNumProps 참고
*/
import { personIcon } from "../../assets/AllIcon";
import React from "react";

type PeopleNumProps = {
  now: number; //현재 인원
  max: number; //최대 인원
  color: string; //아이콘의 색
  size: number; //폰트 사이즈와 아이콘의 높이
};

const PeopleNumInfo = (props: PeopleNumProps) => {
  const personImg = personIcon(props.color, props.size);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        color: `${props.color}`,
      }}
    >
      {personImg}
      <div
        style={{
          fontFamily: "Noto Sans KR",
          fontSize: `${props.size}px`,
          margin: "0 3px",
        }}
      >
        {props.now}/{props.max}
      </div>
    </div>
  );
};
export default React.memo(PeopleNumInfo);
