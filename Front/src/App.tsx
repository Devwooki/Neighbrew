import { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import { useNavigate, Route, Routes } from "react-router-dom";
import Loading from "./UI/etc/Loading";
import Login from "./UI/user/Login";
import Main from "./UI/home/Main";
import ChatList from "./UI/chat/ChatList";
import ChatRoom from "./UI/chat/ChatRoom";
import DrinkpostTotal from "./UI/drinkpost/DrinkpostTotal";
import MeetingMain from "./UI/meet/MeetingMain";
import MeetingDetail from "./UI/meet/MeetingDetail";
import MeetingCreate from "./UI/meet/MeetingCreate";
import MeetingManageMain from "./UI/meet/MeetingManageMain";
import MeetingMemberManage from "./UI/meet/MeetingMemberManage";
import MeetingInfoManage from "./UI/meet/MeetingInfoManage";
import Mypage from "./UI/user/MyPage";
import Follower from "./UI/user/Follower";
import Follow from "./UI/user/Follow";
import KakaoLogin from "./UI/user/KakaoLogin";
import NaverLogin from "./UI/user/NaverLogin";
import GoogleLogin from "./UI/user/GoogleLogin";
import DrinkpostDetail from "./UI/drinkpost/DrinkpostDetail";
import DrinkpostCreate from "./UI/drinkpost/DrinkpostCreate";
import DrinkpostSearch from "./UI/drinkpost/DrinkpostSearch";
import DrinkpostReviewCreate from "./UI/drinkpost/DrinkpostReviewCreate";
import Test from "./Test";
import DrinkpostMain from "./UI/drinkpost/DrinkpostMain";
import DrinkpostReviewDetail from "./UI/drinkpost/DrinkpostReviewDetail";
import DirectChat from "./UI/chat/DirectChat";
import SearchUser from "./UI/user/SearchUser";
import RatingCreate from "./UI/meetrate/RatingCreate";
import NotFound from "./UI/etc/NotFound";
import logo from "./assets/logoNavbar.svg";
import DrinkpostReviewUpdate from "./UI/drinkpost/DrinkpostReviewUpdate";
import AlarmPage from "./UI/etc/AlarmPage";

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // 개발시 isLoading true로 두고 하기
  const [userid, setUserid] = useState(null);
  const [isConnect, setIsConnect] = useState(false);
  const es = useRef<EventSource | undefined>();
  const connectHandler = () => {
    setIsConnect(true);
  };
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      // Register a service worker hosted at the root of the
      // site using the default scope.
      navigator.serviceWorker.register("sw.js");
    }
  }, []);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 1000);
  }, []);
  const esconnect = () => {
    es.current = new EventSource(`https://i9b310.p.ssafy.io/api/auth/connect/${userid}`, {
      withCredentials: true,
    });

    es.current.onopen = e => {};
    es.current.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        noti(data.content, data.url);
      } catch {}
      if (event.data === "finished") {
        es.current?.close();
        return;
      }
    };
    es.current.onerror = err => {};
  };
  useEffect(() => {
    if (userid == null) {
      setUserid(localStorage.getItem("myId"));
      if (localStorage.getItem("myId") != null) {
        setUserid(localStorage.getItem("myId"));
        esconnect();
      }
    } else {
      esconnect();
    }

    return () => {
      unsubscribe();
    };
  }, [isConnect, userid]);
  const unsubscribe = async () => {
    es.current?.close();
  };
  useEffect(() => {
    subscribe();
  }, []);

  const subscribe = () => {
    if (!("Notification" in window)) {
      // 브라우저가 Notification API를 지원하는지 확인한다.
      alert("알림을 지원하지 않는 데스크탑 브라우저입니다");
      return;
    }

    if (Notification.permission === "granted") {
      // 이미 알림 권한이 허가됐는지 확인한다.
      // 그렇다면, 알림을 표시한다.
      // const notification = new Notification("안녕하세요!");
      return;
    }

    // 알림 권한이 거부된 상태는 아니라면
    if (Notification.permission !== "denied") {
      // 사용자에게 알림 권한 승인을 요청한다
      Notification.requestPermission().then(permission => {
        // 사용자가 승인하면, 알림을 표시한다
        if (permission === "granted") {
          const notification = new Notification("알림을 허용하셨습니다.");
        }
      });
    }
  };

  const noti = (message: string, url: string) => {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification("NeighBrew", {
        body: message,
        icon: logo,
        data: url,
        actions: [
          {
            title: "이동",
            action: "goTab",
          },
          {
            title: "닫기",
            action: "close",
          },
        ],
      });
    });
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {!isLoading && <Loading />}
              {isLoading && <Login></Login>}
            </>
          }
        />
        <Route path="/home" element={<Main />} />
        <Route
          path="/drinkpost"
          element={<DrinkpostMain connectHandler={connectHandler}></DrinkpostMain>}
        />
        <Route path="/meet" element={<MeetingMain />}></Route>
        <Route path="/meet/:meetId" element={<MeetingDetail />}></Route>
        <Route path="/meet/create" element={<MeetingCreate />}></Route>
        <Route path="/meet/:meetId/manage" element={<MeetingManageMain />}></Route>
        <Route path="/meet/:meetId/manage/member" element={<MeetingMemberManage />}></Route>
        <Route path="/meet/:meetId/manage/info" element={<MeetingInfoManage />}></Route>

        <Route path="/myPage/:userid" element={<Mypage></Mypage>}></Route>
        <Route path="/myPage/follower/:userid" element={<Follower></Follower>}></Route>
        <Route path="/myPage/follow/:userid" element={<Follow></Follow>}></Route>
        <Route path="/usersearch" element={<SearchUser></SearchUser>}></Route>
        <Route path="/chatList" element={<ChatList></ChatList>}></Route>
        <Route path="/chatList/:id" element={<ChatRoom></ChatRoom>} />
        <Route path="/directchat/:senderId/:receiverId" element={<DirectChat></DirectChat>}></Route>

        <Route path="/kakao/:str" element={<KakaoLogin></KakaoLogin>}></Route>
        <Route path="/naver/:str" element={<NaverLogin></NaverLogin>}></Route>
        <Route path="/google/:str" element={<GoogleLogin></GoogleLogin>}></Route>

        <Route path="/drinkpost/:drinkId" element={<DrinkpostDetail></DrinkpostDetail>}></Route>
        <Route path="/drinkpost/create" element={<DrinkpostCreate></DrinkpostCreate>}></Route>
        <Route path="/drinkpost/search" element={<DrinkpostSearch></DrinkpostSearch>}></Route>
        <Route
          path="/drinkpost/:drinkId/review/create"
          element={<DrinkpostReviewCreate></DrinkpostReviewCreate>}
        ></Route>
        <Route path="/drinkpost/total" element={<DrinkpostTotal></DrinkpostTotal>}></Route>
        <Route path="/test" element={<Test></Test>}></Route>

        <Route path="/rating/:meetId" element={<RatingCreate></RatingCreate>}></Route>

        <Route
          path="/drinkpost/:drinkId/:reviewId"
          element={<DrinkpostReviewDetail></DrinkpostReviewDetail>}
        ></Route>
        <Route
          path="/drinkpost/:drinkId/:reviewId/update"
          element={<DrinkpostReviewUpdate></DrinkpostReviewUpdate>}
        ></Route>
        <Route path="/*" element={<NotFound></NotFound>}></Route>
        <Route path="/myPage/alarm" element={<AlarmPage></AlarmPage>}></Route>
      </Routes>
    </>
  );
}

export default App;
