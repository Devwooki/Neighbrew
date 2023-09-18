//yes or no 인 모달 안에 들어갈 컴포넌트
import styled from "styled-components";

const ModalContentDiv = styled.div`
  padding: 1rem 0 4rem 0;
  white-space: pre-line;
  line-height: 130%;
`;

const ModalBtnDiv = styled.div`
  position: fixed;
  bottom: 0;
  left: 10%;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const ModalBtn = styled.div`
  width: 5rem;
  padding: 0.5rem;
  margin: 0 0.5rem;
  border-radius: 5px;
  background: var(--c-yellow);
`;

type YesOrNoModalProps = {
  msg: string; //~하시겠습니까? 하고 띄울 메시지
  yesFunc(): void; //예 버튼 클릭 시 실행될 함수(모달닫는함수 포함)
  noFunc(): void; //예 버튼 클릭 시 실행될 함수(모달닫는 함수 포함)
};

const YesOrNoModal = (props: YesOrNoModalProps) => {
  return (
    <div>
      <ModalContentDiv>{props.msg}</ModalContentDiv>
      <ModalBtnDiv>
        <ModalBtn onClick={props.yesFunc}>예</ModalBtn>
        <ModalBtn onClick={props.noFunc}>아니오</ModalBtn>
      </ModalBtnDiv>
    </div>
  );
};

export default YesOrNoModal;
