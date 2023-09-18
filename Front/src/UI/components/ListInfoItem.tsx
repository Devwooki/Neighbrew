import styled from "styled-components";
import React from "react";

const ItemDiv = styled.div<{ $outline: boolean }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 6rem;
  background: white;
  margin: 0.5rem 0;
  border-radius: 20px;
  padding: 0.5rem;
  border: ${(props) => (props.$outline ? "1px solid var(--c-gray)" : "none")};
`;

const ImageArea = styled.div<{ src: string; $isDrink: boolean }>`
  background: url(${(props) => props.src}) no-repeat center;
  background-size: ${(props) => (props.$isDrink ? "contain" : "cover")};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  width: 25%;
  margin: 0 3%;
  &::after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;

const InfoArea = styled.div`
  width: 70%;
  text-align: left;
  align-self: flex-start;
`;

const InfoTitle = styled.div`
  font-family: "JejuGothic";
  font-size: 14px;
  margin: 3% 0;
  width: 9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const InfoContent = styled.div`
  font-family: "NanumSquareNeo";
  font-size: 12px;
  color: var(--c-gray);
  width: 13rem;
  // 4줄 넘어가면 말줄임
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
`;

const Tag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  background: var(--c-yellow);
  padding: 1.5% 2%;
  font-family: "JejuGothic";
  font-size: 10px;
  border-radius: 10px;
  span {
    display: flex;
    justify-content: center;
    min-width: 30px;
  }
`;

const InfoTag = styled(Tag)`
  right: 3%;
  top: 7%;
  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
    margin-right: 2px;
  }
`;

const WaitingTag = styled(Tag)`
  left: 3%;
  top: 7%;
`;

const InfoNumber = styled.div`
  position: absolute;
  right: 5%;
  bottom: 7%;
`;

type ListInfoItemProps = {
  title: string; //제목
  imgSrc: string; //이미지 경로
  tag?: string; //주종 태그
  content: any; //내용, 컴포넌트를 넣어도 됨
  numberInfo?: any; //인원정보, 컴포넌트를 넣어도 됨
  isWaiting?: boolean; //신청대기중인 모임인지(아니라면 false)
  outLine?: boolean; //외곽선을 그릴 것인지 아닌지
  isDrink?: boolean; //술정보를 담을 건지 아닌지
  routingFunc: any; //라우팅 함수(ex.routingFunc={() => GotoMeetDetailHandler(1)})
};

/**
 * 모임 리스트 또는 술장 검색 결과 리스트에 사용되는 컴포넌트.
 * 간격을 위해 상단 margin이 1rem 주어져있음(ItemDiv 참고)
 * @property {string} title 제목
 * @property {string} imgSrc 이미지 경로
 * @property {string} tag [Optional] 주종 태그
 * @property {any} content 내용. 컴포넌트를 넣어도 됨
 * @property {any} numberInfo 인원정보 또는 후기 수. 컴포넌트를 넣어도 됨
 * @property {boolean} isWaiting optional. 신청대기중인 모임인지(아니라면 false)
 * @property {boolean} outLine optional. 외곽선을 그릴 것인지 아닌지
 * @property {boolean} isDrink optional. 술 정보인지 아닌지(모임인지) 기본값은 false
 * @property {any} routingFunc 라우팅 함수(ex.routingFunc={() => GotoMeetDetailHandler(1)})
 */
const ListInfoItem = (props: ListInfoItemProps) => {
  //TODO: props를 object로 받도록 수정?

  return (
    <div
      style={{ display: "flex", justifyContent: "center" }}
      onClick={() => props.routingFunc()}
    >
      <ItemDiv $outline={props.outLine ? props.outLine : false}>
        <ImageArea src={props.imgSrc} $isDrink={props.isDrink ?? false} />
        <InfoArea>
          <InfoTitle>{props.title}</InfoTitle>
          <InfoContent>{props.content}</InfoContent>
        </InfoArea>
        {props.tag && (
          <InfoTag>
            <span>{props.tag}</span>
          </InfoTag>
        )}
        {props.numberInfo && <InfoNumber>{props.numberInfo}</InfoNumber>}
        {props.isWaiting ? (
          <WaitingTag>
            <span>승인대기</span>
          </WaitingTag>
        ) : null}
      </ItemDiv>
    </div>
  );
};
export default React.memo(ListInfoItem);
