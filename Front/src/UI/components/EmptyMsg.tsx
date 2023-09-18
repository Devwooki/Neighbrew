import styled from "styled-components";

const WrapperDiv = styled.div`
  padding: 2rem 0;
  color: var(--c-gray);
`;

const Title = styled.div`
  padding: 0.5rem;
  font-family: "JejuGothic";
  font-size: 20px;
`;

const Contents = styled.div`
  font-family: "NanumSquareNeo";
  font-size: 14px;
  white-space: pre-line;
  line-height: 130%;
`;

type EmptyMsgProps = {
  title: string;
  contents?: string;
};

/**
 * 뭔가 비어있을 때 보여줄 컴포넌트
 * @property {string} title: 제목. 두꺼운 글씨로 들어감
 * @property {string} contents: [Optional] 추가로 작성할 내용. 탬플릿 리터럴 사용시 줄바꿈 가능
 */
const EmptyMsg = (props: EmptyMsgProps) => {
  return (
    <WrapperDiv>
      <img src="/src/assets/placard.svg" />
      <Title>{props.title}</Title>
      <Contents>{props.contents}</Contents>
    </WrapperDiv>
  );
};
export default EmptyMsg;
