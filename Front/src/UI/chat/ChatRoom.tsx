import { useParams } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { arrowLeftIcon, outRoom } from "../../assets/AllIcon";
import { useNavigate } from "react-router-dom";
import defaultImg from "../../assets/defaultImg.png";
import exitImg from "../../assets/exit.png";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { Chat, User } from "../../Type/types";
import { callApi } from "../../utils/api";
import sendImage from "../../assets/send.png";
import TextareaAutosize from "react-textarea-autosize";

const OtherChat = styled.div`
  white-space: pre-wrap;
  position: relative;
  display: inline-block;
  background-color: white;
  border-radius: 12px;
  padding: 10px;
  max-width: 70%;
  word-break: break-all;
  margin-bottom: 5px;
  margin-left: 1px;
  margin-right: 0.5rem;
  font-size: 13px;
  text-align: left;
  font-family: "NanumSquareNeo";
`;

const MyChat = styled.div`
  white-space: pre-wrap;
  position: relative;
  display: inline-block;
  flex-direction: row;
  background-color: var(--c-yellow);
  border-radius: 12px;
  padding: 14px;
  max-width: 70%;
  word-break: break-all;
  margin-bottom: 5px;
  margin-right: 1px;
  margin-left: 0.5rem;
  font-size: 13px;
  text-align: left;
  font-family: "NanumSquareNeo";
`;

const ChatOtherBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 0.7rem;
`;

const ChatMyBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 0.7rem;
`;

const ChatMyMsg = styled.div`
  font-size: 0.4rem;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`;
const ChatOtherMsg = styled.div`
  font-size: 0.4rem;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
`;

const ChatTime = styled.div`
  margin-left: 2px;
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
`;

const ChatUserName = styled.div`
  font-family: "JejuGothic";
  font-size: 0.8rem;
  margin-bottom: 0.4rem;
  margin-top: 1.2rem;
`;

const ChatNav = styled.div`
  box-sizing: border-box;
  padding: 0.5rem;
  width: 100%;
  height: 3rem;
  background-color: var(--c-lightgray);
  display: flex;
  word-break: break-all;
  font-size: 0.9rem;
  align-items: center;
  justify-content: space-between;
`;

const RightModal = styled.div<{ ismodal: boolean }>`
  transform: ${(props) =>
    props.ismodal ? "translateX(16%)" : "translateX(100%)"};
  position: fixed;
  width: 95%;
  overflow-x: scroll;
  height: 100vh;
  background-color: white;
  transition: all 0.3s;
  z-index: 16;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0rem 2rem;
`;
// const ImgDiv = styled.div`
//   width: 15%;
//   height: 100%;
//   overflow: hidden;
//   aspect-ratio: 1/1;
//   border-radius: 50%;
//   float: left;
//   margin-right: 2rem;
// `;
const ImgDiv = styled.div`
  /* width: 15%;
  height: 100%; */
  overflow: hidden;
  /* inline-size: 25ch; */
  aspect-ratio: 1/1;
  border-radius: 50%;
  float: left;
  margin-right: 2rem;
  min-width: 40px;
  min-height: 40px;
  max-width: 40px;
  max-height: 40px;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserDiv = styled.div`
  display: flex;
  margin-bottom: 1rem;
  font-size: 16px;
  @font-face {
    font-family: "SUITE-Regular";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2304-2@1.0/SUITE-Regular.woff2")
      format("woff2");
    font-style: normal;
  }
  font-family: "SUITE-Regular";
  align-items: center;
  width: 75%;
  /* white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; */
`;
const UserNameP = styled.p`
  width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
`;

const InputDiv = styled.div`
  display: flex;
  background-color: #fff;
  width: 100%;
  border-top: 0.5px solid #dfdfdf;
  max-height: 100px;
  align-items: center;
  justify-content: space-around;
`;

const Input = styled.input`
  width: 85%;
  height: 70%;
  border: none;

  &:focus-visible {
    outline: none;
  }
`;

const BackDrop = styled.div<{ ismodal: boolean }>`
  display: ${(props) => (props.ismodal ? "block" : "none")};
  transition: all 1s;
  width: 100%;
  max-width: 430px;
  height: 10000px;
  position: fixed;
  z-index: 15;
  background-color: #322d29;
`;

const ChatRoom = () => {
  const { id } = useParams();
  const client = useRef<CompatClient>();
  const [messages, setMessages] = useState<Chat[]>([]);
  const [ismodal, setIsmodal] = useState(false);
  const [chatRoomName, setChatRoomName] = useState();
  const userId = parseInt(localStorage.getItem("myId"));
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [chatRoomId, setChatRoomId] = useState(0);
  const messageHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  // 웹소켓 연결 및 이벤트 핸들러 설정
  const connectToWebSocket = () => {
    client.current = Stomp.over(() => {
      const ws = new SockJS("/ws");
      return ws;
    });

    client.current.connect({}, () => {
      // 웹소켓 이벤트 핸들러 설정
      client.current!.subscribe(`/pub/room/${id}`, (res) => {
        const receivedMessage = JSON.parse(res.body);
        setMessages((prevMessages: any) => [
          ...prevMessages,
          {
            message: receivedMessage.message,
            userId: receivedMessage.userId,
            userNickname: receivedMessage.userNickname,
            user: {
              userId: receivedMessage.userId,
              nickname: receivedMessage.userNickname,
            },
            createdAt:
              new Date().getHours() +
              ":" +
              (new Date().getMinutes() < 10
                ? "0" + new Date().getMinutes()
                : new Date().getMinutes()),
          },
        ]);
      });
    });
  };

  useEffect(() => {
    connectToWebSocket();
  }, []);
  // 엔터 누르면 메세지 전송
  const sendMessageHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (message.trim() === "") return;
    client.current.send(
      `/sub/chat/${id}/sendMessage`,
      {},
      JSON.stringify({ message: message, userId, user: { userId: userId } })
    );
    setMessage("");
    scroll();
  };

  const navigate = useNavigate();
  const rapperDiv = useRef<HTMLInputElement>(null);

  // 채팅방 입장시 채팅 메시지 가져오기
  useEffect(() => {
    callApi(
      "GET",
      `api/chatMessage/${id}/${localStorage.getItem("myId")}/messages`
    )
      .then((res) => {
        setChatRoomId(res.data[0].chatRoomId);
        setMessages(res.data);
        return res;
      })
      .then(() => {
        callApi("GET", `api/chatroom/${id}/detail`).then((res) => {
          setChatRoomName(res.data.chatRoomName);
        });
      })
      .catch((e) => {});

    callApi("GET", `/api/chatroom/${id}/${localStorage.getItem("myId")}/users`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((e) => {});
  }, []);

  // 방 입장 또는 메세지 보내면 스크롤 내려주는 로직
  useEffect(() => {
    scroll();
  }, [messages]);
  // 스크롤 로직
  const scroll = () => {
    window.scrollTo({
      top: rapperDiv.current!.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const foo = async () => {
      await scroll();
    };
    foo();
  }, []);

  const ArrowLeftIcon = arrowLeftIcon("black");
  const OutRoom = outRoom();

  const OutRoomHandler = () => {
    navigate("/chatList");
  };
  const chaterInfoHandler = () => {
    ismodal ? setIsmodal(false) : setIsmodal(true);
  };
  const leaveRoom = () => {
    navigate("/chatList");
    client.current.send(
      `/sub/room/${chatRoomId}/leave`,
      {},
      JSON.stringify({ userId })
    );
  };
  return (
    <div ref={rapperDiv}>
      <header>
        <ChatNav>
          <div
            style={{
              marginRight: "0rem",
              marginLeft: "0rem",
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={OutRoomHandler}
          >
            {ArrowLeftIcon}
          </div>
          <span
            style={{
              marginRight: "0rem",
              fontFamily: "JejuGothic",
              fontSize: "20px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "80%",
            }}
          >
            <>
              {chatRoomName ?? null}
              <span style={{ fontSize: "14px", color: "var(--c-gray)" }}>
                &nbsp;&nbsp;&nbsp;&nbsp;{users.length}
              </span>
            </>
          </span>
          <div
            style={{ marginLeft: "0rem", marginTop: "3px", cursor: "pointer" }}
            onClick={chaterInfoHandler}
          >
            {OutRoom}
          </div>
        </ChatNav>
      </header>
      <BackDrop ismodal={ismodal} onClick={chaterInfoHandler}></BackDrop>
      <RightModal ismodal={ismodal}>
        <div style={{ border: "1px solid var(--c-lightgray)" }}></div>
        <br />
        <p
          style={{
            fontFamily: "JejuGothic",
            fontSize: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          참여자 목록
        </p>
        <div style={{ width: "80%" }}>
          {users.map((user, i) => {
            return (
              <UserDiv
                key={i}
                onClick={() => {
                  navigate(`/myPage/${user.userId}`);
                }}
              >
                <ImgDiv>
                  <Img
                    src={user.profile == "no image" ? defaultImg : user.profile}
                  ></Img>
                </ImgDiv>
                <UserNameP>
                  {user.nickname?.includes("@")
                    ? user.nickname.split("@")[0]
                    : user.nickname}
                </UserNameP>
              </UserDiv>
            );
          })}
        </div>
        <div style={{ position: "fixed", top: "80%" }}>
          {/* <button onClick={OutRoomHandler}>채팅방 나가기</button> */}
          <img src={exitImg} alt="" onClick={leaveRoom} />
        </div>
      </RightModal>
      <div
        style={{
          backgroundColor: ismodal ? "#757575" : "var(--c-lightgray)",
          width: "100%",
          minHeight: "90vh",
          overflow: "auto",
        }}
      >
        {messages.map((message, i) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems:
                  message.userId == userId ? "flex-end" : "flex-start",
                flexDirection: "column",
              }}
              key={i}
            >
              {message.userId === userId ? (
                <ChatMyBox>
                  <ChatUserName>나</ChatUserName>
                  <ChatMyMsg>
                    <ChatTime>
                      {message.createdAt.length > 5
                        ? message.createdAt.split("T")[1].substring(0, 5)
                        : message.createdAt}
                    </ChatTime>
                    <MyChat>{message.message}</MyChat>
                  </ChatMyMsg>
                </ChatMyBox>
              ) : (
                <ChatOtherBox>
                  <ChatUserName>
                    {message.userNickname?.includes("@")
                      ? message.userNickname.split("@")[0]
                      : message.userNickname}
                  </ChatUserName>
                  <ChatOtherMsg>
                    <OtherChat>{message.message}</OtherChat>
                    <ChatTime>
                      {message.createdAt.length > 5
                        ? message.createdAt.split("T")[1].substring(0, 5)
                        : message.createdAt}
                    </ChatTime>
                  </ChatOtherMsg>
                </ChatOtherBox>
              )}
            </div>
          );
        })}
        <div style={{ height: "3rem" }}></div>
      </div>
      <footer>
        <InputDiv>
          <StyleAutoTextArea
            value={message}
            onChange={messageHandler}
            minRows={1}
            maxRows={4}
          ></StyleAutoTextArea>

          <SendBtnDiv>
            {message.length > 0 ? (
              <div onClick={sendMessageHandler}>
                {/*<SendIcon></SendIcon>*/}
                <SendImg src={sendImage} alt="" />
              </div>
            ) : (
              <div
                onClick={sendMessageHandler}
                style={{ visibility: "hidden" }}
              >
                {/*<SendIcon></SendIcon>*/}
                <SendImg src={sendImage} alt="" />
              </div>
            )}
          </SendBtnDiv>
        </InputDiv>
      </footer>
    </div>
  );
};

export default ChatRoom;

const SendIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="25"
      viewBox="0 0 30 27"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.61325 12.302H13.1325C13.5468 12.302 13.8825 12.6378 13.8825 13.052C13.8825 13.4662 13.5467 13.802 13.1325 13.802H4.63339L-9.26055e-06 26.1577L29.4275 13.0789L-9.26055e-06 -2.1257e-05L4.61325 12.302Z"
        fill="var(--c-yellow)"
      />
    </svg>
  );
};
const StyleAutoTextArea = styled(TextareaAutosize)`
  display: flex;
  flex-basis: 90%;
  border: 0.5px solid #dfdfdf;
  background-color: #eeeeee;
  border-radius: 5px;
  padding: 0.3rem;
  overflow-y: auto;
  resize: none;
  margin: 0.5rem 0 0.5rem 0.5rem;
  padding: 0.3rem;
  outline: none;
  // 글을 아래에 배치
  align-self: flex-end;
  font-size: 1rem;

  &:focus {
    border: none;
  }
`;
const SendBtnDiv = styled.div`
  background-color: #ffffff;
  border-radius: 0 5px 5px 0;
  border: none;
  flex-basis: 10%;
`;
const SendImg = styled.img`
  width: 23px;
  height: 23px;
`;
