//현재 날짜를 받아오기
export const localDate = () => {
  const date = new Date().toISOString().substring(0, 10);
  return date;
};

//현재 시간을 받아오기(UTC9)
export const localTime = () => {
  const time = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(11, 16);
  return time;
};

//날짜 변환 함수
export const formateDate = (dateData: string) => {
  const date = new Date(dateData);
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

  return `${year}-${month}-${day}`;
};

//시간 변환 함수
export const formateTime = (dateData: string) => {
  const date = new Date(dateData);
  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minute =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  return `${hour}:${minute}`;
};
