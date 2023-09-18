/*
[MeetingManageMain.tsx]
모임 관리 메인 페이지
모임 정보 관리, 참여자 관리 버튼이 있음
!!!모달로 변경하면서 현재 사용하지 않음!!!
*/
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Modal from "react-modal";
import NavbarSimple from "../navbar/NavbarSimple";
import PeopleNumInfo from "./PeopleNumInfo";
import Footer from "../footer/Footer";
import { callApi } from "../../utils/api";
import { initialMeet } from "../common";
import { WhiteModal } from "../../style/common";
import { Meeting } from "../../Type/types";

const BigBtn = styled.div`
  border-radius: 30px;
  background: var(--c-yellow);
  width: 15rem;
  margin: 1rem auto;
  padding: 1rem;
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

const MeetingManageMain = () => {
  const navigate = useNavigate();
  const { meetId } = useParams(); //meetId는 라우터 링크에서 따오기
  const [deleteModalOn, setDeleteModalOn] = useState(false);
  const [errorModalOn, setErrorModalOn] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [meetData, setMeetData] = useState<Meeting>(initialMeet);

  //모임 편집 페이지로 이동
  const GotoMeetInfoManage = (meetId: number) => {
    navigate(`/meet/${meetId}/manage/info`);
  };
  //모임 참여자 관리페이지로 이동
  const GotoMemberManage = (meetId: number) => {
    navigate(`/meet/${meetId}/manage/member`);
  };
  //모임 삭제 후 메인으로 이동
  const GoMeetMainHandler = () => {
    navigate(-2);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  //api 호출, 모임 이름 세팅
  useEffect(() => {
    callApi("get", `api/meet/${meetId}`).then((res) =>
      setMeetData(res.data.meet)
    );
  }, [meetId]);

  //모임 삭제 요청
  const DeleteMeeting = async () => {
    const promise = callApi("delete", `api/meet/delete/${meetId}`, {
      userId: parseInt(localStorage.getItem("myId")),
    });
    promise
      .then((res) => {
        GoMeetMainHandler();
      })
      .catch((e) => {
        setErrMsg(e.response.data);
        setErrorModalOn(true);
      });
  };

  return (
    <div style={{ fontFamily: "JejuGothic" }}>
      <header>
        <NavbarSimple title="모임 관리" />
      </header>
      <div
        style={{
          fontSize: "32px",
          margin: "1rem auto 0.5rem auto",
          width: "20rem",
        }}
      >
        {meetData.meetName}
      </div>
      <div style={{ margin: "0 10.5rem" }}>
        <PeopleNumInfo
          now={meetData.nowParticipants}
          max={meetData.maxParticipants}
          color="var(--c-black)"
          size={15}
        />
      </div>
      <BigBtn onClick={() => GotoMeetInfoManage(parseInt(meetId))}>
        모임 정보 관리
      </BigBtn>
      <BigBtn onClick={() => GotoMemberManage(parseInt(meetId))}>
        참여자 관리
      </BigBtn>
      <BigBtn
        style={{ background: "#F28F79" }}
        onClick={() => setDeleteModalOn(true)}
      >
        모임 삭제
      </BigBtn>
      <Modal
        isOpen={deleteModalOn}
        onRequestClose={() => setDeleteModalOn(false)}
        style={WhiteModal}
      >
        <div>
          <div style={{ padding: "1rem 0 4rem 0" }}>
            이 모임을 정말 삭제하시겠습니까?
          </div>
          <ModalBtnDiv>
            <ModalBtn
              onClick={() => {
                DeleteMeeting();
                setDeleteModalOn(false);
              }}
            >
              예
            </ModalBtn>
            <ModalBtn
              onClick={() => {
                setDeleteModalOn(false);
              }}
            >
              아니오
            </ModalBtn>
          </ModalBtnDiv>
        </div>
      </Modal>
      <Modal
        isOpen={errorModalOn}
        onRequestClose={() => setErrorModalOn(false)}
        style={WhiteModal}
      >
        {errMsg}
      </Modal>
      <Footer />
    </div>
  );
};
export default MeetingManageMain;
