// 앱 실행시 로딩 화면, n 초간 실행 예정 (몇 초간 보일지 정해야 함)
import AppLoading from "../../assets/AppLoading.png";
const FirstLoading = () => {
  return (
    <>
      <img src={AppLoading} alt="간 gif" style={{ width: "100%", height: "100%" }} />
    </>
  );
};
export default FirstLoading;
