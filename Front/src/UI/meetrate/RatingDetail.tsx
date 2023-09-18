import styled from "styled-components";
import { useState, useEffect } from "react";
import OneLineListItem from "../components/OneLineListItem";

const DetailListDiv = styled.div`
  border-radius: 15px;
  border: 1px solid var(--c-gray);
  height: 12rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
`;

const LongTextInput = styled.textarea`
  font-family: "NanumSquareNeo";
  border: 1px solid var(--c-gray);
  width: 90%;
  height: 84%;
  font-size: 1rem;
  border-radius: 15px;
  border: none;
  resize: none;
  outline: none;
  text-align: start;
  margin-top: 0.5rem;
  &:focus {
    border: none;
  }
`;

const CloseDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 15px;
  border: 1px solid var(--c-gray);
  padding: 1rem auto;
  font-family: "NanumSquareNeo";
  font-size: 14px;
`;

const CloseTitle = styled.div`
  display: flex;
  align-items: center;
  height: 2rem;
  margin-left: 1rem;
  font-family: "NanumSquareNeoBold";
`;

const CloseDesc = styled.div`
  text-align: left;
  width: 12rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const OnOffBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: sticky;
  bottom: 0;
  z-index: 3;
  padding-right: 1rem;
  font-family: "NanumSquareNeo";
`;

const OnBtn = styled(OnOffBtn)`
  height: 2rem;
`;

const OffBtn = styled(OnOffBtn)`
  height: 3rem;
`;

const RatingDetail = (props: { ratingNum: number; getFunc(desc: string): void }) => {
  const [listOpen, setListOpen] = useState(true); //세부 선택 창이 열렸는가?
  const [selectedDetail, setSelectedDetail] = useState(""); //선택된 세부 의견
  useEffect(() => {
    if (props.ratingNum === 0 || props.ratingNum === 2) {
      setListOpen(false);
      setSelectedDetail(""); //초기화
    }
    if (props.ratingNum === 1 || props.ratingNum === 3) {
      setSelectedDetail(""); //초기화
      setListOpen(true);
    }
  }, [props.ratingNum]);

  useEffect(() => {
    props.getFunc(selectedDetail);
  }, [selectedDetail]);

  const goodList = [
    { id: 1, content: "시간약속을 잘 지켜요" },
    { id: 2, content: "친절하고 매너가 좋아요" },
    { id: 3, content: "응답이 빨라요" },
    { id: 4, content: "술을 잘 알아요" },
    { id: 5, content: "분위기를 즐겁게 만들어요" },
    { id: 6, content: "대화 코드가 잘 맞아서 함께 즐거운 시간을 보냈어요" },
    { id: 7, content: "취향이 같은 사람을 만났어요" },
    { id: 8, content: "다른 멤버의 이야기에 적극적으로 리액션을 해줘요" },
    { id: 9, content: "유쾌하고 밝은 에너지로 분위기 메이커 역할을 했어요" },
  ];

  const badList = [
    { id: 1, content: "노쇼를 해요" },
    { id: 2, content: "매너가 별로예요" },
    { id: 3, content: "시간 약속을 안 지켜요" },
    { id: 4, content: "이분과 다시는 만나고 싶지 않아요" },
    { id: 5, content: "반말을 해요" },
  ];

  const tagTable = {
    1: "좋아요",
    2: "보통이에요",
    3: "아쉬워요",
  };

  const detailList = () => {
    if (props.ratingNum === 1) return goodList;
    else if (props.ratingNum === 3) return badList;
    return [];
  };

  const descriptionHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSelectedDetail(e.target.value);
  };

  return (
    <div>
      {listOpen && (
        <DetailListDiv>
          <div
            style={{
              overflow: "auto",
              height: "100%",
              flexGrow: "1",
            }}
          >
            {detailList() === badList ? (
              <LongTextInput
                placeholder="아쉬웠던 점을 말씀해주세요..."
                onChange={descriptionHandler}
                value={selectedDetail}
              ></LongTextInput>
            ) : (
              detailList().map(res => (
                <div
                  onClick={() => {
                    setSelectedDetail(res.content);
                    setListOpen(false);
                  }}
                  key={res.id}
                >
                  <OneLineListItem
                    content={res.content}
                    tag={tagTable[props.ratingNum]}
                  ></OneLineListItem>
                </div>
              ))
            )}
          </div>
          <OffBtn onClick={() => setListOpen(false)}>▲닫기</OffBtn>
        </DetailListDiv>
      )}
      {!listOpen && (
        <CloseDiv>
          <CloseTitle>세부</CloseTitle>
          <CloseDesc>{selectedDetail}</CloseDesc>
          {(props.ratingNum === 1 || props.ratingNum === 3) && !selectedDetail && (
            <OnBtn onClick={() => setListOpen(true)}>▼열기</OnBtn>
          )}
          {(props.ratingNum === 1 || props.ratingNum === 3) && selectedDetail && (
            <OnBtn
              onClick={() => {
                setSelectedDetail("");
                setListOpen(true);
              }}
            >
              ❌취소
            </OnBtn>
          )}
        </CloseDiv>
      )}
    </div>
  );
};
export default RatingDetail;
