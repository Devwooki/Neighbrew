import { Drink } from "../../Type/types";
//모임 생성, 수정 시 값 유효성 검사 함수

//날짜와 시간 입력 시 현재 날짜, 시간보다 이전인지를 반환(UTC0)
const isDateTimeBeforeNow = (date, time) => {
  try {
    const targetDateTime = new Date(`${date}T${time}:00`);
    const currentDateTime = new Date();
    return targetDateTime < currentDateTime;
  } catch (error) {
    return false;
  }
};

//제목: 필수 입력/30자 이내
export const titleCheck = (meetTitle: string) => {
  return !(meetTitle === "" || meetTitle == null || meetTitle.length > 30);
};

//술: 필수 입력
export const drinkCheck = (drink: Drink) => {
  return !(drink.drinkId < 1);
};

//위치: 필수 입력
export const positionCheck = (sidoCode: number, gugunCode: number) => {
  return !(sidoCode === 0 || gugunCode === 0);
};

//날짜: 필수 입력/현재 시점 이후로
export const timeCheck = (date: string, time: string) => {
  return !(date === "" || time === "" || isDateTimeBeforeNow(date, time));
};

//최대인원: 필수 입력/최대 8명
export const participantsCheck = (maxParticipants: number) => {
  return !(maxParticipants === 0 || maxParticipants > 8);
};

//간수치: 100이하
export const liverLimitCheck = (liverLimit: number) => {
  return !(liverLimit > 100);
};

//나이: 최소나이는 20세 이상/나이는 200이하
export const ageCheck = (minAge: number, maxAge: number) => {
  return !(minAge < 20 || maxAge > 200);
};

//이미지: 이미지타입/이미지크기(5MB)
export const imgcheck = (file: File) => {
  return !(file && (file.size > 1024 * 1024 * 10 || !file.type.startsWith("image/")));
};
