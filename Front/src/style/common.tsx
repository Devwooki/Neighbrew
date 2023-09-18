import styled, { css } from "styled-components";

export const Input = styled.input`
  width: 80%;
  height: 40px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 0 10px;
  margin: 2rem 1rem 2rem 1rem;
`;

export const Alert = styled.div`
  width: 80%;
  /* height: 2rem; */
  border: 2px solid red;
  border-radius: 3px;
  margin: 0 auto;
  text-align: center;
  padding: 3px;
`;

//모달창 디자인
export const WhiteModal = {
  content: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "15rem",
    minHeight: "5rem",
    wordBreak: "break-all",
    height: "auto",
    padding: "0.5rem 1rem",
    borderRadius: "15px",
    background: "white",
    overflow: "auto",
    textAlign: "center",
    fontFamily: "NanumSquareNeo",
    WebkitOverflowScrolling:
      "touch" /* overflow가 일어날 경우 모바일 기기에서 부드러운 가속이 적용된 스크롤이 되도록 해주는 속성 */,
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: "11",
  },
};

//모달 안에 div
export const ModalInner = styled.div`
  white-space: pre-line;
  overflow: auto;
`;

//인풋 텍스트 타입 긴 버전
export const InputText = styled.input`
  width: 100%;
  background: white;
  text-align: left;
  padding: 2% 0;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  font-family: "NanumSquareNeo";
  font-size: 16px;
  outline: none;
  &::placeholder {
    color: var(--c-gray);
  }
`;

//인풋 date와 time 타입의 스타일(상속용)
const DateAndTimeInputStyle = css`
  color: var(--c-black);
  width: 45%;
  font-family: "NanumSquareNeo";
  text-align: right;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  background: white;
  font-size: 16px;
  outline: none;
`;

//날짜 입력
export const DateInput = styled.input.attrs({ type: "date" })`
  ${DateAndTimeInputStyle}
`;

//시간 입력
export const TimeInput = styled.input.attrs({ type: "time" })`
  ${DateAndTimeInputStyle}
`;

export const DeleteModal = {
  content: {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    height: "16%",
    padding: "0.5rem 1rem",
    borderRadius: "15px",
    background: "#ffffff",
    textAlign: "center",
    fontFamily: "SeoulNamsan",
    color: "#000000",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: "11",
  },
};

export const ThreeDotModal = {
  content: {
    top: "90%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "16%",
    borderRadius: "24px 24px 0px 0px",
    backgroundColor: "#ffffff",
    fontFamily: "SeoulNamsan",
    fontSize: "1.5rem",
    color: "black",
    transition: "top 2s ease-in-out",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: "1001",
  },
};

export const ShortThreeDotModal = {
  content: {
    top: "94%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "8%",
    borderRadius: "24px 24px 0px 0px",
    backgroundColor: "#ffffff",
    fontFamily: "SeoulNamsan",
    fontSize: "1.5rem",
    color: "black",
    transition: "top 2s ease-in-out",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: "1001",
  },
};
