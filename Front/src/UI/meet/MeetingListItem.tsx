import React from "react";
import { useNavigate } from "react-router-dom";
import { Meeting } from "../../Type/types";
import ListInfoItem from "../components/ListInfoItem";
import MeetingDetailSimple from "./MeetingDetailSimple";
import PeopleNumInfo from "./PeopleNumInfo";
import { getTagName } from "../common";

type MeetingListItemProps = {
  data: Meeting[];
  isWaiting?: boolean;
};

/**
 * ListInfoItem에 데이터 넣기
 * @props data : Meeting[] 타입
 * @props isWaiting : boolean 타입, optional, 기본값은 false
 */
const MeetingListItem = ({ data, isWaiting = false }: MeetingListItemProps) => {
  //네비게이터 : 모임 상세페이지로 이동
  const navigate = useNavigate();
  const GotoMeetDetailHandler = (meetId: number) => {
    navigate(`/meet/${meetId}`);
  };

  return (
    <div>
      {data.map((meeting: Meeting) => {
        const meetId = meeting.meetId;
        const tagName = getTagName(meeting.tagId);
        const bgImg =
          meeting.imgSrc === "no image" || meeting.imgSrc == null
            ? "/src/assets/meetDefaultImg.jpg"
            : meeting.imgSrc;

        return (
          <ListInfoItem
            key={meetId}
            title={meeting.meetName}
            imgSrc={bgImg}
            content={<MeetingDetailSimple meetData={meeting} />}
            numberInfo={
              <PeopleNumInfo
                key={meeting.meetId}
                now={meeting.nowParticipants}
                max={meeting.maxParticipants}
                color={"var(--c-black)"}
                size={11}
              />
            }
            isWaiting={isWaiting}
            outLine={false}
            routingFunc={() => GotoMeetDetailHandler(meetId)}
          ></ListInfoItem>
        );
      })}
    </div>
  );
};
export default React.memo(MeetingListItem);
