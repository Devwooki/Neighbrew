/*
[MeetingMy.tsx]
내 모임 페이지
내가 주최 중인 모임, 내가 참여 중인 모임, 내가 신청한 모임 출력
*/
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import MeetingListItem from "./../meet/MeetingListItem";
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
`;

const meetingMy = (props: { userId: number }) => {
  //현재 유저의 userId
  const [userId, setUserId] = useState(0);

  //불러온 모임 데이터
  const [meetData, setMeetData] = useState({
    HOST: [],
    APPLY: [],
    GUEST: [],
  }); //userId의 모임 전체
  const [hostMeet, setHostMeet] = useState([]); //userId가 만든 모임
  const [guestMeet, setGuestMeet] = useState([]); //userId가 참여한 모임
  useEffect(() => {
    setUserId(props.userId);
  });

  //모임 배열과 waiting, end 중 하나를 넣으면 해당하는 모임만 반환
  const filterByStatus = (array: Meeting[], status: string) => {
    const result = array.filter(meet => {
      return meet.meetStatus === status;
    });
    return result;
  };

  //api 호출
  useEffect(() => {
    if (userId !== 0) {
      const promise = callApi("get", `api/meet/mymeet/${userId}`);
      promise.then(res => {
        setMeetData(res.data); //받아온 데이터로 meetData 세팅
      });
    }
  }, [userId]);

  //create, apply, attend 모임 갱신
  useEffect(() => {
    setHostMeet(filterByStatus(meetData.HOST, "WAITING")); //HOST 중에서 끝나지 않은 모임
    setGuestMeet(filterByStatus(meetData.GUEST, "WAITING")); //GUEST 중에서 끝나지 않은 모임
  }, [meetData]);

  return (
    <div style={{ padding: "1rem", minHeight: "400px" }}>
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
    </div>
  );
};
export default meetingMy;
