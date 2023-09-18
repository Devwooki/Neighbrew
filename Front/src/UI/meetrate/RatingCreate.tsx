import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import { User } from "../../Type/types";
import { callApi } from "../../utils/api";
import NavbarSimple from "../navbar/NavbarSimple";
import RatingMember from "./RatingMember";

const Title = styled.div`
  font-size: 27px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 25px;
`;

const MemberContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 1rem;
`;

// 가운데 정렬
const MemberInfo = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  font-size: 20px;
  font-weight: bold;
`;

// 등록버튼
const RatingButton = styled.button`
  width: 65%;
  padding-top: 16px;
  padding-bottom: 16px;
  border-radius: 40px;
  border: none;
  background-color: var(--c-yellow);
  color: black;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  margin-top: 50px;
`;

const RatingCreate = () => {
  //네비게이터 : 모임 관리 페이지로 이동, 뒤로가기 기능
  const navigate = useNavigate();
  const GoMainHandler = () => {
    navigate(`/`);
  };

  const [users, setUsers] = useState<User[]>();
  // const [evaluation, setEvaluation] = useState<Evaluation[]>();
  const [selectedValues, setSelectedValues] = useState([]); // 사용자별로 선택된 버튼 값을 저장
  const [meetTitle, setMeetTitle] = useState("");
  const myId = parseInt(localStorage.getItem("myId"));
  const { meetId } = useParams(); //meetId는 라우터 링크에서 따오기

  const evaluationType = {
    1: "GOOD",
    2: "MID",
    3: "BAD",
  };

  const PostHandler = rateValue => {
    callApi("POST", "/api/evaluation", {
      ratedUser: myId,
      reviewer: rateValue.userId,
      meetId: meetId,
      evaluationType: evaluationType[rateValue.evaluationType],
      description: rateValue.description,
    }).then(res => {
      GoMainHandler();
    });
  };

  const handleSelectedButton = (userId: number, buttonNumber: number, desc: string) => {
    const newEvaluation = {
      userId: userId,
      evaluationType: buttonNumber,
      description: desc,
    };
    const existingIndex = selectedValues.findIndex(item => item.userId === userId);
    //이전에 평가하지 않은 유저를 평가했을 때
    if (existingIndex === -1) {
      setSelectedValues(prevValues => [...prevValues, newEvaluation]);
    } else {
      // 같은 userId가 이미 존재하면 해당 객체 업데이트
      const updatedValues = [...selectedValues];
      updatedValues[existingIndex] = newEvaluation;
      setSelectedValues(updatedValues);
    }
  };

  useEffect(() => {
    callApi("GET", `/api/meet/${meetId}`)
      .then(res => {
        setMeetTitle(res.data.meet.meetName);
        return res.data.users.filter(
          (user: User, index) => user.userId !== myId && res.data.statuses[index] !== "APPLY"
        );
      })
      .then(users => {
        setUsers(users);
      });
  }, []);

  return (
    <div>
      <NavbarSimple title="이번 모임은 어떠셨나요?" />
      <div
        style={{
          paddingBottom: "50px",
          paddingLeft: "30px",
          paddingRight: "30px",
        }}
      >
        <Title>{meetTitle}</Title>
        <MemberContainer>
          <MemberInfo>함께했던 멤버들은</MemberInfo>
          {users?.map((user: User) => (
            <RatingMember
              key={user.userId}
              _user={user}
              onSelectButton={(buttonNumber, desc) =>
                handleSelectedButton(user.userId, buttonNumber, desc)
              }
            />
          ))}
        </MemberContainer>
        <RatingButton
          onClick={() => {
            selectedValues.map(rateValue => {
              PostHandler(rateValue);
            });
          }}
        >
          등록하기
        </RatingButton>
      </div>
    </div>
  );
};

export default RatingCreate;
