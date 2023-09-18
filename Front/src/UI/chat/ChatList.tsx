// 채팅방 목록을 보여줌
// 채팅방 목록을 클릭하면 채팅방으로 이동
// 채팅방 목록은 채팅방 이름, 채팅방 마지막 메시지, 채팅방 마지막 메시지 시간을 보여줌

import { useState, useEffect } from "react";
import styled from "styled-components";
import Chat from "./Chat";
import ChatDM from "./ChatDM";
import { meetingicon, directMessage } from "../../assets/AllIcon";
import Footer from "../footer/Footer";
import { callApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import MeetingListItem from "../meet/MeetingListItem.tsx";
import EmptyMsg from "../components/EmptyMsg.tsx";

const ChatListDiv = styled.div`
  display: flex;
  margin: 0 1rem;
  background-color: white;
  border-bottom: 1px solid var(--c-borderline);
`;

const Button = styled.button`
  flex-basis: 50%;
  height: 3rem;
  background-color: white;
  border: none;
  font-family: "JejuGothic";
  font-size: 20px;
`;
const TopMenu = styled.div`
  height: 2rem;
  display: flex;
  margin: 0 0.5rem 0 0.5rem;
  background-color: white;
  border-bottom: 1px solid var(--c-gray);
`;
const TopMenuDetail = styled.button<{ isfocused: string }>`
  color: var(--${props => (props.isfocused === "true" ? "c-black" : "c-gray")});
  font-family: "JejuGothic";
  font-size: 20px;
  line-height: 150%;
  padding: 0 1rem;
  outline: none;
  border: none;
  border-bottom: ${props => (props.isfocused === "true" ? "2px solid var(--c-black);" : "none;")};
  background: white;
`;
const ChatList = () => {
  const [chatList, setChatList] = useState([]);
  const [chooseChat, setChooseChat] = useState(0); // 선택한 채팅방의 index
  const navigate = useNavigate();
  const chatRoomDetail = (roomId: number) => {
    navigate(`/chatList/${roomId}`);
  };
  const chatDMRoomDetail = (user1: number, user2: number) => {
    navigate(`/directchat/${user1}/${user2}`);
  };

  const userId = localStorage.getItem("myId");
  const classListHandler = () => {
    callApi("GET", `api/chatroom/${userId}/getChatRoom`).then(res => {
      setChatList(res.data);
    });
  };
  const dmListHandler = () => {
    callApi("GET", `api/dm/list/${userId}`).then(res => {
      setChatList(res.data);
    });
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  useEffect(() => {
    if (chooseChat === 0) {
      classListHandler();
    } else {
      dmListHandler();
    }
  }, [chooseChat]);
  const [selectedMenu, setSelectedMenu] = useState("find");
  return (
    <>
      <ChatListDiv>
        <Button
          onClick={() => {
            setChooseChat(0);
          }}
          style={{
            borderBottom: chooseChat === 0 ? "2px solid var(--c-black)" : "none",
            color: chooseChat === 0 ? "var(--c-black)" : "var(--c-borderLinegray)",
          }}
        >
          모임채팅
        </Button>
        <Button
          onClick={() => {
            setChooseChat(1);
          }}
          style={{
            borderBottom: chooseChat === 0 ? "none" : "2px solid var(--c-black)",
            color: chooseChat === 1 ? "var(--c-black)" : "var(--c-gray)",
          }}
        >
          채팅
        </Button>
      </ChatListDiv>
      <div style={{ padding: "1rem", backgroundColor: "white", minHeight: "760px" }}>
        {chatList.length === 0 ? (
          <EmptyMsg
            title={chooseChat === 0 ? "참여 중인 모임이 없습니다." : "DM 내역이 없습니다."}
            contents={
              chooseChat === 0
                ? "모임에 참여해 보세요!\n참여중인 모임의 채팅방이 여기에 표시됩니다."
                : "관심 있는 유저들과 대화를 나눠 보세요!\n대화 중인 채팅방은 여기에 표시됩니다."
            }
          />
        ) : chooseChat === 0 ? (
          chatList.map(chatRoom => {
            return (
              <Chat
                key={chatRoom.chatRoomId}
                chatRoomName={chatRoom.chatRoomName}
                chatRoomId={chatRoom.chatRoomId}
                chatRoomDetail={chatRoomDetail}
              />
            );
          })
        ) : (
          chatList.map((chatRoom, i) => {
            return (
              <ChatDM
                key={i}
                chatRoomDetail={chatDMRoomDetail}
                user1={chatRoom.user1}
                user2={chatRoom.user2}
                lastMessageTime={chatRoom.lastMessageTime}
              />
            );
          })
        )}
      </div>
      <div style={{ height: "80px" }}></div>
      <footer>
        <Footer />
      </footer>
    </>
  );
};
export default ChatList;
