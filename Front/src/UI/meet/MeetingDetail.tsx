/*
[MeetingDetail.tsx]
특정한 모임의 상세 정보를 보여주는 페이지
모임 리스트에서 하나를 클릭하면 이 페이지로 이동함
모임 위치, 시간, 주최자, 간수치제한, 인원 제한 정보를 담고 있음
*/
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { arrowLeftIcon } from "../../assets/AllIcon";
import styled from "styled-components";
import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import PeopleNumInfo from "./PeopleNumInfo";
import ListInfoItem from "../components/ListInfoItem";
import UserInfoItem from "../components/UserInfoItem";
import FooterBigBtn from "../footer/FooterBigBtn";
import { callApi } from "../../utils/api";
import { initialMeetDetail, encodeUrl, initialUser } from "../common";
import { MeetDetail, User } from "../../Type/types";
import Modal from "react-modal";
import defaultImg from "../../assets/defaultImg.png";
import { getTagName } from "../common";
import { WhiteModal, ModalInner } from "../../style/common";
import { formateDate, formateTime } from "./DateTimeCommon";
import { deleteIcon, editIcon, personIcon } from "./../../assets/AllIcon";
import YesOrNoModal from "../components/YesOrNoModal";

const MeetThumbnail = styled.div<{ $bgImgSrc: string }>`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(${props => props.$bgImgSrc}) no-repeat center;
  background-size: cover;
  width: 100%;
  min-height: 30vh;
  color: white;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
`;

const Tag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--c-yellow);
  padding: 0.5rem 1rem;
  font-family: "NanumSquareNeoBold";
  font-size: 12px;
  border-radius: 20px;
  color: var(--c-black);
  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: white;
    margin-right: 2px;
  }
  span {
    display: flex;
    justify-content: center;
    min-width: 30px;
  }
`;

const ChatBtn = styled.div`
  padding: 0.5rem 1rem;
  background-color: var(--c-yellow);
  color: black;
  font-family: "NanumSquareNeo";
  font-size: 12px;
  border-radius: 5px;
`;

const Title = styled.div`
  font-family: "JejuGothic";
  font-size: 28px;
  margin: 0 auto 0.5rem auto;
  width: 20rem;
`;

const HostInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "NanumSquareNeo";
  font-size: 16px;
  margin: 0.5rem 0;
`;

const UserProfileImg = styled.div<{ src: string }>`
  background: url(${props => props.src}) no-repeat center;
  background-size: cover;
  width: 2rem;
  padding-bottom: 2rem;
  border-radius: 100px;
  margin-right: 0.2rem;
`;

const MeetDetailDiv = styled.div`
  background: var(--c-lightgray);
  min-height: 70vh;
  border-radius: 30px 30px 0px 0px;
  position: relative;
  z-index: 1;
  top: -2rem;
  padding: 4.5rem 1rem;
`;

const MeetPosDateDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 2;
  width: 17rem;
  height: 4rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.07);
  padding: 1rem;
  font-family: "NanumSquareNeo";
  font-size: 16px;
`;

const SubTitle = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
  margin-top: 1.5rem;
`;

const Description = styled.div`
  color: var(--c-black);
  font-family: "NanumSquareNeo";
  font-size: 16px;
  text-align: justify;
  line-height: 1.6rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
  white-space: pre-line;
  word-break: break-all;
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

const ManageModal = {
  content: {
    top: "90%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "16%",
    borderRadius: "24px 24px 0px 0px",
    backgroundColor: "#ffffff",
    fontFamily: "NanumSquareNeo",
    fontSize: "16px",
    color: "black",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: "1001",
  },
};

const ModalIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  margin-right: 1rem;
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

const MeetingDetail = () => {
  const ArrowLeftIcon = arrowLeftIcon("white");
  const DeleteIcon = deleteIcon();
  const EditIcon = editIcon();
  const { meetId } = useParams(); //meetId는 라우터 링크에서 따오기
  const [meetDetailData, setMeetDetailData] = useState<MeetDetail>(initialMeetDetail); //모임 데이터
  const [memberList, setMemberList] = useState<User[]>([]); //참여자 리스트
  const [applicantList, setApplicantList] = useState<User[]>([]); //참여자 리스트
  const [userId, setUserId] = useState(0); //현재 유저의 userId
  const [userData, setUserData] = useState(initialUser);
  const [userStatus, setUserStatus] = useState("");
  const client = useRef<CompatClient>();

  const [exitModalOn, setExitModalOn] = useState(false); //나가기 모달이 열려있는가?
  const [deleteModalOn, setDeleteModalOn] = useState(false); //나가기 모달이 열려있는가?
  const [simpleModalOn, setSimpleModalOn] = useState(false); //오류 모달이 열려있는가?
  const [manageModalOn, setManageModalOn] = useState(false); //관리 모달이 열려있는가?
  const [acceptModalOn, setAcceptModalOn] = useState(false); //승인거절 모달이 열려있는가?
  const [targetUser, setTargetUser] = useState<User>(initialUser); //승인/거절할 유저
  const [targetAction, setTargetAction] = useState(true); //승인:true, 거절:false
  const [errMsg, setErrMsg] = useState(""); //모달에 표시할 오류메시지
  const bgImg =
    meetDetailData.meet.imgSrc == "no image"
      ? "/src/assets/meetDefaultImg.jpg"
      : meetDetailData.meet.imgSrc;

  const navigate = useNavigate();
  //뒤로가기(버튼 클릭 또는 모임 삭제 후)
  const GoBackHandler = () => {
    navigate(-1);
  };
  //특정 술로 이동
  const GotoDrinkPostHandler = (drinkId: number) => {
    navigate(`/drinkpost/${drinkId}`);
  };
  //모임 편집 페이지로 이동
  const GotoMeetInfoManage = (meetId: number) => {
    navigate(`/meet/${meetId}/manage/info`);
  };
  //모임 평가 페이지로 이동
  const GotoRatingHandler = () => {
    navigate(`/rating/${meetId}`);
  };
  //없는 모임일 경우 뒤로가기(모임 메인으로 이동?)
  const GotoMainHandler = () => {
    navigate(-1);
  };
  //특정 채팅방으로 이동
  const GotoChatHandler = () => {
    navigate(`/chatList/${meetDetailData.meet.chatRoomId}`);
  };

  // 웹소켓 연결 및 이벤트 핸들러 설정
  const connectToWebSocket = () => {
    client.current = Stomp.over(() => {
      const ws = new SockJS("/ws");
      return ws;
    });
    client.current.connect({}, () => {});
  };

  //api호출
  const fetchMeetData = () => {
    const promise = callApi("get", `api/meet/${meetId}`);
    promise
      .then(res => {
        setMeetDetailData(res.data); //받아온 데이터로 meetDetailData 세팅
      })
      .catch(e => {
        GotoMainHandler();
      });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    //로컬 스토리지에서 userId 가져오기
    setUserId(parseInt(localStorage.getItem("myId")));
  }, []);

  //현재 유저의 정보 가져오기
  useEffect(() => {
    if (userId === 0) return;
    const promise = callApi("get", `api/user/${userId}`);
    promise.then(res => {
      setUserData(res.data);
    });
  }, [userId]);

  //meetId가 생기면 api로 데이터 로드
  useEffect(() => {
    fetchMeetData();
  }, [meetId]);

  useEffect(() => {
    if (meetDetailData === undefined) return;
    if (meetDetailData !== undefined) {
      //users에서 apply인 유저 제외하고 memberList에 넣기
      let members = meetDetailData.users.filter(
        (user, index) => meetDetailData.statuses[index] !== "APPLY"
      );
      setMemberList(members);
      //apply 세팅
      let applicants = meetDetailData.users.filter(
        (user, index) => meetDetailData.statuses[index] === "APPLY"
      );
      setApplicantList(applicants);
      //현재 유저의 상태를 관리(HOST/GUEST/APPLY/NONE)
      let index: number | undefined = meetDetailData.users.findIndex(
        user => user.userId === userId
      );
      setUserStatus(index === -1 ? "NONE" : meetDetailData.statuses[index]);
    }
  }, [meetDetailData]);

  //생일을 넣으면 나이를 계산해줌
  const calcAge = (birth: string) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const birthYear = parseInt(birth.substring(0, 4), 10);
    let age = currentYear - birthYear + 1;
    return age;
  };

  //참여 신청하기
  function applyMeet() {
    //간수치 제한 확인
    if ((meetDetailData.meet.minLiverPoint ?? 0) > userData.liverPoint) {
      setErrMsg("간수치 제한에 부합하지 않습니다.");
      setSimpleModalOn(true);
      return;
    }
    //나이 제한 확인
    if (
      (meetDetailData.meet.minAge ?? 0) > calcAge(userData.birth) ||
      (meetDetailData.meet.maxAge ?? 200) < calcAge(userData.birth)
    ) {
      setErrMsg("나이 제한에 부합하지 않습니다.");
      setSimpleModalOn(true);
      return;
    }
    const promise = callApi("post", `api/meet/apply`, {
      userId: userId,
      meetId: meetId,
    });
    promise
      .then(res => {
        setUserStatus("APPLY");
        setErrMsg(`모임에 참여 신청하였습니다!\n신청 취소는 '승인 대기중' 버튼을 클릭해주세요.`);
        setSimpleModalOn(true);
      })
      .catch(err => {
        setErrMsg(err.response.data);
        setSimpleModalOn(true);
      });
  }

  //신청 취소하기
  function cancelApply() {
    const promise = callApi("put", `api/meet/apply-cancel`, {
      userId: userId,
      meetId: meetId,
    });
    promise.then(res => {
      setUserStatus("NONE");
    });
  }

  //모임 나가기
  function exitMeet() {
    const promise = callApi("delete", `api/meet/exit`, {
      userId: userId,
      meetId: meetId,
    });
    promise
      .then(res => {
        setUserStatus("NONE");
      })
      .then(() => fetchMeetData());
  }

  //모임 삭제 요청
  const DeleteMeeting = async () => {
    const promise = callApi("delete", `api/meet/delete/${meetId}`, {
      userId: parseInt(localStorage.getItem("myId")),
    });
    promise
      .then(res => {
        GoBackHandler(); //모임 삭제 후 뒤로가기
      })
      .catch(e => {
        setErrMsg(e.response.data);
        setSimpleModalOn(true);
      });
  };

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
      .catch(e => {
        setErrMsg(e.response.data);
        setSimpleModalOn(true);
      });
  };

  //채팅방 참여하기
  const gotoChat = async () => {
    await connectToWebSocket();
    setTimeout(() => {
      sendMessageHandler(meetDetailData.meet.chatRoomId);
    }, 500);

    GotoChatHandler();
  };

  const sendMessageHandler = roomId => {
    client.current.send(`/sub/join/${roomId}`, {}, JSON.stringify({ userId }));
  };

  function hasAgeLimit() {
    if (meetDetailData === undefined) return false;
    const res =
      (meetDetailData.meet.minAge ?? 0) > 0 || (meetDetailData.meet.maxAge ?? 0) > 0 ? true : false;
    return res;
  }

  return (
    <div style={{ color: "var(--c-black)" }}>
      <MeetThumbnail $bgImgSrc={bgImg}>
        <DetailHeader>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ cursor: "pointer", marginRight: "1rem" }} onClick={GoBackHandler}>
              {ArrowLeftIcon}
            </div>
            <Tag>{getTagName(meetDetailData.meet.tagId)}</Tag>
          </div>
          {userStatus !== "APPLY" && userStatus !== "NONE" && (
            <ChatBtn onClick={gotoChat}>채팅 참여하기</ChatBtn>
          )}
        </DetailHeader>
        <div style={{ textAlign: "center", padding: "2rem 0 7rem 0" }}>
          <Title>{meetDetailData.meet.meetName}</Title>
          <HostInfo>
            <div>주최자: </div>
            {memberList[0] && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <UserProfileImg
                  src={memberList[0].profile === "no image" ? defaultImg : memberList[0].profile}
                />
                <div>{memberList[0].nickname}</div>
              </div>
            )}
          </HostInfo>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PeopleNumInfo
              now={meetDetailData.meet.nowParticipants}
              max={meetDetailData.meet.maxParticipants}
              color="white"
              size={15}
            />
          </div>
        </div>
      </MeetThumbnail>
      <MeetDetailDiv>
        <MeetPosDateDiv>
          <div>
            <img src="/src/assets/mapPinColor.svg" width="20rem" />
            <div>{`${meetDetailData.meet.sido.sidoName}`}</div>
            <div>{`${meetDetailData.meet.gugun.gugunName}`}</div>
          </div>
          <div>
            <img src="/src/assets/calendarColor.svg" width="20rem" />
            <div>{formateDate(meetDetailData.meet.meetDate)}</div>
            <div>{formateTime(meetDetailData.meet.meetDate)}</div>
          </div>
        </MeetPosDateDiv>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            fontSize: "14px",
            fontFamily: "NanumSquareNeo",
          }}
        >
          {(meetDetailData.meet.minLiverPoint ?? 0) > 0 && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src="/src/assets/liverIcon.svg" width="20rem" style={{ marginRight: "3px" }} />
              <div>{meetDetailData.meet.minLiverPoint}</div>
              IU/L
            </div>
          )}
          {hasAgeLimit() && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src="/src/assets/age.svg" width="20rem" style={{ marginRight: "3px" }} />
              {meetDetailData.meet.minAge > 0 && <div>{meetDetailData.meet.minAge}세 이상</div>}
              {meetDetailData.meet.maxAge > 0 && <div>~{meetDetailData.meet.maxAge}세 미만</div>}
            </div>
          )}
        </div>
        <SubTitle>우리가 마실 것은</SubTitle>
        <ListInfoItem
          title={meetDetailData.meet.drink.name}
          imgSrc={
            meetDetailData.meet.drink.image === "no image"
              ? "/src/assets/whiskeyImage.png"
              : encodeUrl(meetDetailData.meet.drink.image)
          }
          tag={getTagName(meetDetailData.meet.drink.tagId)}
          content={meetDetailData.meet.drink.description}
          outLine={false}
          isDrink={true}
          routingFunc={() => GotoDrinkPostHandler(meetDetailData.meet.drink.drinkId)}
        />
        <SubTitle>모임 소개</SubTitle>
        <Description>{meetDetailData.meet.description}</Description>
        <div style={{ display: "flex" }}>
          <SubTitle>참여 인원</SubTitle>
          <div
            style={{
              marginTop: "1.6rem",
              marginLeft: "0.5rem",
            }}
          >
            <PeopleNumInfo
              now={meetDetailData.meet.nowParticipants}
              max={meetDetailData.meet.maxParticipants}
              color="var(--c-black)"
              size={15}
            />
          </div>
        </div>
        <div style={{ margin: "0 0.5rem" }}>
          {memberList.map((member, index) => {
            return (
              <UserInfoItem key={member.userId} user={member} isMaster={index === 0} width={15} />
            );
          })}
        </div>
        {userStatus === "HOST" && (
          //신청자 목록
          <div>
            <SubTitle style={{ textAlign: "left", marginTop: "2rem" }}>참여 신청</SubTitle>
            <div style={{ margin: "0 1rem" }}>
              {applicantList.map(applicant => {
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
                          setAcceptModalOn(true);
                        }}
                      >
                        <img src="/src/assets/checkButtonIcon.svg" />
                      </OKBtn>
                      <NoBtn
                        onClick={() => {
                          setTargetAction(false);
                          setTargetUser(applicant);
                          setAcceptModalOn(true);
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
        )}
        {/* 나가기모달 */}
        <Modal isOpen={exitModalOn} onRequestClose={() => setExitModalOn(false)} style={WhiteModal}>
          <YesOrNoModal
            msg="정말 이 모임에서 나가시겠습니까?"
            yesFunc={() => {
              exitMeet();
              setExitModalOn(false);
            }}
            noFunc={() => {
              setExitModalOn(false);
            }}
          />
        </Modal>
        {/* 모임 삭제 모달 */}
        <Modal
          isOpen={deleteModalOn}
          onRequestClose={() => setDeleteModalOn(false)}
          style={WhiteModal}
        >
          <YesOrNoModal
            msg="이 모임을 정말 삭제하시겠습니까?"
            yesFunc={() => {
              DeleteMeeting();
              setDeleteModalOn(false);
            }}
            noFunc={() => {
              setDeleteModalOn(false);
            }}
          />
        </Modal>
        {/* 승인거절 모달 */}
        <Modal
          isOpen={acceptModalOn}
          onRequestClose={() => setAcceptModalOn(false)}
          style={WhiteModal}
        >
          <YesOrNoModal
            msg={`유저 ${targetUser.nickname}을/를\n${targetAction ? "승인" : "거절"}하시겠습니까?`}
            yesFunc={() => {
              memberHandler(targetUser);
              setAcceptModalOn(false);
            }}
            noFunc={() => {
              setAcceptModalOn(false);
            }}
          />
        </Modal>
        {/* 모임 관리 모달 */}
        <Modal
          isOpen={manageModalOn}
          onRequestClose={() => setManageModalOn(false)}
          style={ManageModal}
        >
          <div
            style={{
              fontSize: "1rem",
              color: "var(--c-gray)",
            }}
          >
            모임 관리
          </div>
          <div
            onClick={() => GotoMeetInfoManage(parseInt(meetId))}
            style={{ display: "flex", alignItems: "center", height: "40%" }}
          >
            <ModalIcon>{EditIcon}</ModalIcon>
            <div
              style={{
                color: "black",
              }}
            >
              모임 정보 수정
            </div>
          </div>
          <div
            onClick={() => {
              setManageModalOn(false);
              setDeleteModalOn(true);
            }}
            style={{ display: "flex", alignItems: "center", height: "40%" }}
          >
            <ModalIcon>{DeleteIcon}</ModalIcon>
            <div style={{ color: "#eb0505" }}>삭제하기</div>
          </div>
        </Modal>
        {/* 에러 모달 */}
        <Modal
          isOpen={simpleModalOn}
          onRequestClose={() => setSimpleModalOn(false)}
          style={WhiteModal}
        >
          <ModalInner>{errMsg}</ModalInner>
        </Modal>
      </MeetDetailDiv>
      {meetDetailData.meet.meetStatus === "END" && (
        <FooterBigBtn
          content="모임 후기 남기기"
          reqFunc={GotoRatingHandler}
          color="var(--c-yellow)"
          bgColor="var(--c-lightgray)"
        />
      )}
      {userStatus === "HOST" && meetDetailData.meet.meetStatus === "WAITING" && (
        //user 상태에 따라 버튼 변경
        <FooterBigBtn
          content="모임 관리"
          reqFunc={() => setManageModalOn(true)}
          color="var(--c-yellow)"
          bgColor="var(--c-lightgray)"
        />
      )}
      {userStatus === "GUEST" && meetDetailData.meet.meetStatus === "WAITING" && (
        <FooterBigBtn
          content="모임 나가기"
          reqFunc={() => setExitModalOn(true)} //모임 나가기
          color="#F28F79"
          bgColor="var(--c-lightgray)"
        />
      )}
      {userStatus === "APPLY" && meetDetailData.meet.meetStatus === "WAITING" && (
        <FooterBigBtn
          content="승인 대기 중"
          reqFunc={() => cancelApply()} //참여신청 취소하기
          color="var(--c-gray)"
          bgColor="var(--c-lightgray)"
        />
      )}
      {userStatus === "NONE" && meetDetailData.meet.meetStatus !== "END" && (
        <FooterBigBtn
          content="참여 신청하기"
          reqFunc={() => applyMeet()} //참여신청하기
          color="var(--c-yellow)"
          bgColor="var(--c-lightgray)"
        />
      )}
    </div>
  );
};
export default MeetingDetail;
