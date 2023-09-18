import styled from "styled-components";

const Footer = styled.footer<{ $bgcolor: string }>`
  background: ${props => props.$bgcolor};
`;

const Button = styled.button<{ $btncolor: string }>`
  margin: 1rem auto;
  width: 15rem;
  height: 3rem;
  border: none;
  border-radius: 35px;
  color: var(--c-black);
  font-family: "JejuGothic";
  font-size: 20px;
  background: ${props => props.$btncolor};
`;

type BigBtnProps = {
  content: string;
  color: string; //버튼의 색
  bgColor?: string; //배경의 색
  reqFunc: any; //버튼 클릭으로 실행할 함수(ex.reqFunc={() => GotoMeetManageHandler(1)})
};

/**
 * 큰 버튼 하나만 있는 푸터.
 * 모임 상세 페이지, 각종 데이터 등록 페이지에서 사용.
 * 뒤로 가기 버튼과 제목만 포함
 * @property {string} content 버튼에 들어갈 내용
 * @property {string} color 버튼의 색
 * @property {string} bgColor [Optional] 배경의 색. 기본은 흰색
 * @property {any} reqFunc 버튼 클릭으로 실행할 함수(ex.reqFunc={() => GotoMeetManageHandler(1)})
 */
const FooterBigBtn = (props: BigBtnProps) => {
  return (
    <Footer $bgcolor={props.bgColor ? props.bgColor : "white"} className="footer">
      <Button onClick={() => props.reqFunc()} $btncolor={props.color}>
        {props.content}
      </Button>
    </Footer>
  );
};
export default FooterBigBtn;
