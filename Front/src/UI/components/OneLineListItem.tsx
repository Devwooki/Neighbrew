/*
[OneLineListItem.tsx]
모임 생성 시 주류 검색, 또는 유저 평가 세부 항목에 들어가는 컴포넌트
요소 별 구분을 위한 밑줄이 포함되어 있음
자세한 props는 type ListInfoItemProps 참고
*/
import React from "react";
import styled from "styled-components";

const ItemDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  margin: 0 auto;
  padding: 0.5rem;
  border-bottom: 0.5px solid var(--c-gray);
  font-family: "NanumSquareNeo";
  font-size: 14px;
`;

const Desc = styled.div`
  text-align: left;
  margin-right: 0.5rem;
  width: 14rem;
`;

const Tag = styled.div`
  font-family: "NanumSquareNeoBold";
  background: var(--c-yellow);
  padding: 1.5% 3%;
  font-size: 10px;
  border-radius: 10px;
  width: 3rem;
`;

type OneLineListItemProps = {
  content: string; //항목의 이름
  tag: string; //항목이 해당하는 태그(주종, 좋아요/보통/아쉬워요 등)
};

/**
 * 모임 생성 시 주류 검색, 또는 유저 평가 세부 항목에 들어가는 컴포넌트.
 * 요소 별 구분을 위한 밑줄이 포함되어 있음
 * @property {string} content 항목의 이름
 * @property {string} tag 항목이 해당하는 태그(주종, 좋아요/보통/아쉬워요 등)
 */
const OneLineListItem = (props: OneLineListItemProps) => {
  return (
    <ItemDiv onClick={() => {}}>
      <Desc>{props.content}</Desc>
      <Tag>{props.tag}</Tag>
    </ItemDiv>
  );
};
export default React.memo(OneLineListItem);
