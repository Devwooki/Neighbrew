import { callApi } from "../../utils/api";
import { backIcon } from "../../assets/AllIcon";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import AlarmItem from "../components/AlarmItem";
import Footer from "../footer/Footer";
import { useNavigate } from "react-router-dom";
import autoAnimate from "@formkit/auto-animate";
import { AlarmLog } from "../../Type/types";
import EmptyMsg from "../components/EmptyMsg.tsx";
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import NavbarSimple from "../navbar/NavbarSimple.tsx";

const ActionContent = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 18px;
  font-weight: 500;
  box-sizing: border-box;
  background-color: #e17070;
  color: #1d1818;
  overflow: hidden;
`;

const deletePush = (id: number) => {
  callApi("delete", `api/push/${id}`);
};
const trailingActions = (id: number) => (
  <TrailingActions>
    <SwipeAction destructive={true} onClick={() => deletePush(id)}>
      <ActionContent>알림삭제</ActionContent>
    </SwipeAction>
  </TrailingActions>
);
const alarmPage = () => {
  const BackIcon = backIcon();
  const navigate = useNavigate();
  const myId = localStorage.getItem("myId");
  const [alarmList, setAlarmList] = useState<AlarmLog[]>([]);

  // 비동기 통신으로 알림을 불러옵니다.
  useEffect(() => {
    callApi("get", `api/push/${myId}`).then(res => {
      setAlarmList(res.data);
    });
  }, []);
  const goPageHandler = async (url: string, id: number) => {
    await deletePush(id);
    await navigate(url.split("io")[1]);
  };
  return (
    <>
      {/* 알림창의 내브바 */}
      <NavbarSimple title="알림 페이지" />

      <div style={{ margin: "0px 10px 0px 10px" }}>
        {alarmList.length === 0 ? (
          <EmptyMsg title="알림이 없습니다." contents="" />
        ) : (
          alarmList.map((alarm, i) => {
            return (
              <SwipeableList>
                <SwipeableListItem
                  trailingActions={trailingActions(alarm.pushId)}
                  onClick={() => {
                    goPageHandler(alarm.url, alarm.pushId);
                  }}
                  maxSwipe={1}
                >
                  <AlarmItem key={i} alarm={alarm}></AlarmItem>
                </SwipeableListItem>
              </SwipeableList>
            );
          })
        )}
      </div>
      <Footer></Footer>
    </>
  );
};
export default alarmPage;
