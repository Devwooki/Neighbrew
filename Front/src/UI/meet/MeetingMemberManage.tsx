/*
[MeetingMemeberManage.tsx]
모임 관리 - 참여자 관리 페이지
참여중인 인원, 신청한 인원을 보여주고 승인, 거절이 가능
!!! 모임 상세로 통합해서 현재 사용하지 않음 !!!
*/
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import styled from "styled-components";
import NavbarSimple from "../navbar/NavbarSimple";
import PeopleNumInfo from "./PeopleNumInfo";
import Footer from "../footer/Footer";
import UserInfoItem from "../components/UserInfoItem";
import { callApi } from "../../utils/api";
import { MeetDetail, User } from "../../Type/types";
import { initialMeetDetail, initialUser } from "../common";
import { WhiteModal } from "../../style/common";

const SubTitle = styled.div`
  font-size: 20px;
  margin: 2rem 1rem 0.5rem 1rem;
`;

const BtnSmall = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  width: 2rem;
  min-width: 2rem;
  height: 2rem;
  border-radius: 5px;
  margin: 0 0.2rem;
`;

const OKBtn = styled(BtnSmall)`
  background: var(--c-yellow);
`;

const NoBtn = styled(BtnSmall)`
  background: #f28f79;
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

const MeetingMemberManage = () => {
  const { meetId } = useParams(); //meetId는 라우터 링크에서 따오기
  const [meetData, setMeetData] = useState<MeetDetail>(initialMeetDetail);
  const [memberList, setMemberList] = useState<User[]>([]);
  const [applicantList, setApplicantList] = useState<User[]>([]);
  const [modalOn, setModalOn] = useState(false);
  const [targetUser, setTargetUser] = useState<User>(initialUser); //승인/거절할 유저
  const [targetAction, setTargetAction] = useState(true); //승인:true, 거절:false
  const [errorModalOn, setErrorModalOn] = useState(false);
  const [errorModalMsg, setErrorModalMsg] = useState("");

  const fetchMeetData = () => {
    const promise = callApi("get", `api/meet/${meetId}`);
    promise.then((res) => {
      setMeetData(res.data);
    });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    fetchMeetData();
  }, []);

  useEffect(() => {
    if (meetData === undefined) return;
    //guest 세팅
    let member = meetData.users.filter(
      (user, index) => meetData.statuses[index] !== "APPLY"
    );
    setMemberList(member);
    //apply 세팅
    let applicants = meetData.users.filter(
      (user, index) => meetData.statuses[index] === "APPLY"
    );
    setApplicantList(applicants);
  }, [meetData]);

  //수락/거절하기
  const memberHandler = (user: User) => {
    const promise = callApi("post", `api/meet/manage-user`, {
      userId: user.userId,
      meetId: parseInt(meetId),
      applyResult: targetAction,
    });
    promise
      .then(() => {
        fetchMeetData();
      })
      .catch((e) => {
        setErrorModalMsg(e.response.data);
        setErrorModalOn(true);
      });
  };

  return (
    <div style={{ fontFamily: "JejuGothic" }}>
      <header>
        <NavbarSimple title="모임 관리" />
      </header>
      <div style={{ fontSize: "32px", marginTop: "1rem" }}>
        {meetData.meet.meetName}
      </div>
      <div style={{ marginBottom: "7rem" }}>
        <SubTitle style={{ display: "flex", alignItems: "center" }}>
          <div>참여중</div>
          <PeopleNumInfo
            now={meetData.meet.nowParticipants}
            max={meetData.meet.maxParticipants}
            color="var(--c-black)"
            size={15}
          />
        </SubTitle>
        <div style={{ margin: "0 1rem" }}>
          {memberList.map((member, index) => {
            return (
              <UserInfoItem
                key={member.userId}
                user={member}
                isMaster={index === 0}
                width={15}
              />
            );
          })}
        </div>
        <SubTitle style={{ textAlign: "left" }}>참여 신청</SubTitle>
        <div style={{ margin: "0 1rem" }}>
          {applicantList.map((applicant) => {
            return (
              <div
                key={applicant.userId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <UserInfoItem user={applicant} isMaster={false} width={11} />
                <div style={{ display: "flex" }}>
                  <OKBtn
                    onClick={() => {
                      setTargetAction(true);
                      setTargetUser(applicant);
                      setModalOn(true);
                    }}
                  >
                    <img src="/src/assets/checkButtonIcon.svg" />
                  </OKBtn>
                  <NoBtn
                    onClick={() => {
                      setTargetAction(false);
                      setTargetUser(applicant);
                      setModalOn(true);
                    }}
                  >
                    <img src="/src/assets/XbuttonIcon.svg" />
                  </NoBtn>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Modal
        isOpen={modalOn}
        onRequestClose={() => setModalOn(false)}
        style={WhiteModal}
      >
        <div>
          <div
            style={{
              padding: "1rem 0 4rem 0",
              wordBreak: "break-word",
              width: "15rem",
              height: "auto",
            }}
          >
            유저 {targetUser.nickname}을/를 <br />
            {targetAction ? "승인" : "거절"}
            하시겠습니까?
          </div>
          <ModalBtnDiv>
            <ModalBtn
              onClick={() => {
                memberHandler(targetUser);
                setModalOn(false);
              }}
            >
              예
            </ModalBtn>
            <ModalBtn
              onClick={() => {
                setModalOn(false);
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
        {errorModalMsg}
      </Modal>
      <Footer />
    </div>
  );
};
export default MeetingMemberManage;
