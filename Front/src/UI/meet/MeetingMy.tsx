/*
[MeetingMy.tsx]
내 모임 페이지
내가 주최 중인 모임, 내가 참여 중인 모임, 내가 신청한 모임 출력
*/
import { useState, useEffect } from "react";
import styled from "styled-components";
import MeetingListItem from "./MeetingListItem";
import EmptyMsg from "./../components/EmptyMsg";
import { callApi } from "../../utils/api";
import { Meeting } from "../../Type/types";

const MeetingDiv = styled.div`
  margin-bottom: 2rem;
`;

const MeetTitle = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
  padding: 1rem;
  padding-bottom: 0;
`;

const meetingMy = () => {
  //현재 유저의 userId
  const [userId, setUserId] = useState(0);

  //불러온 모임 데이터
  const [meetData, setMeetData] = useState({
    HOST: [],
    APPLY: [],
    GUEST: [],
  }); //userId의 모임 전체
  const [hostMeet, setHostMeet] = useState([]); //userId가 만든 모임
  const [applyMeet, setApplyMeet] = useState([]); //userId가 지원한 모임
  const [guestMeet, setGuestMeet] = useState([]); //userId가 참여한 모임
  const [endHostMeet, setEndHostMeet] = useState([]); //userId가 개설했는데 끝난 모임
  const [endGuestMeet, setEndGuestMeet] = useState([]); //userId가 참여했는데 끝난 모임

  //모임 배열과 waiting, end 중 하나를 넣으면 해당하는 모임만 반환
  const filterByStatus = (array: Meeting[], status: string) => {
    const result = array.filter(meet => {
      return meet.meetStatus === status;
    });
    return result;
  };

  useEffect(() => {
    //로컬 스토리지에서 userId 가져오기
    setUserId(parseInt(localStorage.getItem("myId")));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  //api 호출
  useEffect(() => {
    const promise = callApi("get", `api/meet/mymeet/${userId}`);
    promise.then(res => {
      setMeetData(res.data); //받아온 데이터로 meetData 세팅
    });
  }, [userId]);

  //create, apply, attend, end 모임 갱신
  useEffect(() => {
    setHostMeet(filterByStatus(meetData.HOST, "WAITING")); //HOST 중에서 끝나지 않은 모임
    setApplyMeet(filterByStatus(meetData.APPLY, "WAITING")); //APPLY 중에서 끝나지 않은 모임
    setGuestMeet(filterByStatus(meetData.GUEST, "WAITING")); //GUEST 중에서 끝나지 않은 모임
    //HOST, GUEST 중에서 end인 애들만
    setEndHostMeet(filterByStatus(meetData.HOST, "END"));
    setEndGuestMeet(filterByStatus(meetData.GUEST, "END"));
  }, [meetData]);

  return (
    <div>
      <MeetingDiv>
        <MeetTitle>개설</MeetTitle>
        {hostMeet.length > 0 && <MeetingListItem data={hostMeet} />}
        {hostMeet.length === 0 && (
          <EmptyMsg
            title="개설한 모임이 없습니다"
            contents={`모임을 만들어보세요!\n개설한 모임은 여기에 표시됩니다`}
          />
        )}
      </MeetingDiv>
      <MeetingDiv>
        <MeetTitle>참여</MeetTitle>
        {guestMeet.length > 0 && <MeetingListItem data={guestMeet} />}
        {guestMeet.length === 0 && (
          <EmptyMsg
            title="참여 중인 모임이 없습니다"
            contents={`마음에 드는 모임을 찾아 신청해보세요!\n참여 확정된 모임은 여기에 표시됩니다`}
          />
        )}
      </MeetingDiv>
      <MeetingDiv>
        <MeetTitle>대기</MeetTitle>
        {applyMeet.length > 0 && <MeetingListItem data={applyMeet} isWaiting={true} />}
        {applyMeet.length === 0 && (
          <EmptyMsg
            title="대기 중인 모임이 없습니다"
            contents={`마음에 드는 모임을 찾아 신청해보세요!\n참여 신청한 모임은 여기에 표시됩니다.`}
          />
        )}
      </MeetingDiv>
      <MeetingDiv>
        <MeetTitle>종료</MeetTitle>
        {endHostMeet.length > 0 && <MeetingListItem data={endHostMeet} isWaiting={false} />}
        {endGuestMeet.length > 0 && <MeetingListItem data={endGuestMeet} isWaiting={false} />}
        {endHostMeet.length === 0 && endGuestMeet.length === 0 && (
          <EmptyMsg
            title="완료된 모임이 없습니다."
            contents={`모임을 진행 또는 모임에 참여해보세요!\n완료된 모임은 여기에 표시됩니다.`}
          />
        )}
      </MeetingDiv>
    </div>
  );
};
export default meetingMy;
