import { Meeting, MeetDetail, Drink, User } from "../Type/types";

export const initialSido = {
  sidoCode: 0,
  sidoName: "-",
};

export const initialGugun = {
  gugunCode: 0,
  gugunName: "-",
  sidoCode: 0,
};

export const initialMeet: Meeting = {
  meetId: 0,
  meetName: "",
  hostId: 0,
  description: "",
  nowParticipants: 0,
  maxParticipants: 8,
  meetDate: "0000-01-01T00:00:00",
  tagId: 0,
  sido: initialSido,
  gugun: initialGugun,
  imgSrc: "",
};

export const initialMeetDetail: MeetDetail = {
  meet: {
    meetId: 0,
    meetName: "",
    description: "",
    nowParticipants: 0,
    maxParticipants: 8,
    meetDate: "9999-01-01T00:00:00",
    tagId: 1,
    sido: initialSido,
    gugun: initialGugun,
    minAge: 20,
    drink: {
      degree: 0,
      description: "",
      drinkId: 0,
      image: "",
      name: "",
      tagId: 0,
    },
    imgSrc: "",
    meetStatus: null,
  },
  users: [],
  statuses: [],
};

export const initialDrink: Drink = {
  degree: 0,
  description: "",
  drinkId: 0,
  image: "",
  name: "",
  tagId: 0,
};

export const initialUser: User = {
  userId: 0,
  email: "",
  nickname: "",
  name: "",
  liverPoint: 0,
  profile: "",
  follower: 0,
  following: 0,
};

//이미지 경로에 공백 있을 시 제거
export const encodeUrl = (url: string) => {
  return url.replace(/\s/g, "%20");
};

//태그ID를 태그 이름으로 변환
export const getTagName = (tagId: number) => {
  const tag = [
    { tagId: 0, tagName: "전체" },
    { tagId: 1, tagName: "양주" },
    { tagId: 2, tagName: "전통주" },
    { tagId: 3, tagName: "칵테일" },
    { tagId: 4, tagName: "사케" },
    { tagId: 5, tagName: "와인" },
    { tagId: 6, tagName: "수제맥주" },
    { tagId: 7, tagName: "소주/맥주" },
  ];
  return tag[tagId].tagName;
};
