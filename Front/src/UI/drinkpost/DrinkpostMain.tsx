import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Drink, Review } from "../../Type/types";
import { forwardIcon } from "../../assets/AllIcon";
import totaldrink from "../../assets/clickTotal.png";
import darkwood from "../../assets/darkwood.jpg";
import mdsPick from "../../assets/mdsimg.png";
import { callApi } from "../../utils/api";
import MdsItem from "../components/MdsItem";
import ReviewItem from "../components/ReviewItem";
import Footer from "../footer/Footer";
import Navbar from "../navbar/NavbarForDrinkpost";
import SlideComponent from "../components/Banner";

const MdsDiv = styled.div`
  width: 96%;
  height: 192px;
  border-radius: 20px 20px 0px 0px;
  background-image: url(${mdsPick});
  /* background-size: cover; */
  background-repeat: no-repeat;
  background-position: center;
  margin: 0px 2vw 0px 2vw;
  text-align: start;
`;

const DarkWood = styled.div`
  width: 100%;
  background-image: url(${darkwood});
  background-repeat: no-repeat;
  background-position: center;
  height: 24px;
`;

const Total = styled.div`
  width: 100%;
  height: 120px;
  margin: 0px 0px 0px 0px;
  background-image: url(${totaldrink});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 10px;
  color: white;
  display: flex;
  justify-content: end;
  align-items: end;
`;

const TotalDiv = styled.div`
  margin-bottom: 5%;
  margin-right: 5%;
`;

const TotalTitle = styled.div`
  display: flex;
  align-items: center;
  font-size: 30px;
  font-family: "NanumSquareNeoExtraBold";
`;

const TotalSubTitle = styled.div`
  font-size: 16px;
  font-family: "NanumSquareNeo";
  margin-bottom: 0.5rem;
  text-align: left;
  padding-left: 0.3rem;
`;

// 한줄에 두개씩 보여주기
// 화면 비율 맞추기
const ReviewList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0px 10px 100px 10px;
`;

// 리뷰 카드
// 한줄에 두개씩 보여주기

// 리뷰 이미지
const ReviewImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 20px;
  object-fit: cover;
`;

// const SortButton = styled.div`
//   width: 5rem;
//   height: 2rem;
//   border-radius: 16px;
//   background-color: var(--c-yellow);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   font-family: "NanumSquareNeo";
//   color: white;
// `;

const SortButton = styled.button<{ focusState: boolean }>`
 
  height: 2rem;
  border : none;
  display: flex;
  justify-content: center;
  background: none;
  align-items: center;
  font-family: "JejuGothic";
  color: ${(props) => (props.focusState ? 'var(--c-black)' : 'var(--c-gray)')};
`;

const drinkpostMain = (props: { connectHandler: () => void }) => {
  const toForward = forwardIcon();
  const [reviewList, setReviewList] = useState<Review[]>([]);
  const [reviewListLike, setReviewListLike] = useState<Review[]>([]);
  const [reviewButton, setReviewButton] = useState(true);
  const navigate = useNavigate();
  const clickTotalDrink = () => {
    navigate("/drinkpost/total");
  };
  const toDrinkSearch = () => {
    navigate("/drinkpost/search");
  };
  const [threePick, setThreePick] = useState<Drink[]>([]);

  const reviewButtonHandler = () => {
    setReviewButton(!reviewButton);
  };

  useEffect(() => {
    // 놀랍지만 생성순
    callApi("get", "api/drinkreview/likes").then(res => {
      setReviewList(res.data.content);
    });
    callApi("get", "api/drinkreview/makes").then(res => setReviewListLike(res.data.content));
    callApi("get", "api/drink/mdPick").then(res => {
      setThreePick([...res.data]);
    });
    props.connectHandler();
  }, []);

  return (
    <>
      <div>
        <header>
          <Navbar toDrinkSearch={toDrinkSearch}></Navbar>
        </header>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <SlideComponent></SlideComponent>
        </div>

        <div style={{ margin: "4rem 0.5rem 1rem" }} onClick={clickTotalDrink}>
          <Total>
            <TotalDiv>
              <TotalSubTitle>다양한 술을 한 눈에!</TotalSubTitle>
              <TotalTitle>
                <div style={{ marginRight: "0.5rem" }}>모든 술 보기</div> {toForward}
              </TotalTitle>
            </TotalDiv>
          </Total>
        </div>
        <div style={{ margin: "0px 0.5rem" }}>
          <div style={{ textAlign: "start", display: "flex", alignItems: "center" }}>

            <div style={{flexBasis : "50%"}}>
              <h3 style={{ fontFamily: "NanumSquareNeoExtraBold"}}>🍺 후기 모아 보기 🍺</h3>
            </div>


            {/*{reviewButton*/}
            {/*    ? ( <SortButton onClick={reviewButtonHandler}><b>생성순</b></SortButton>)*/}
            {/*    : ( <SortButton onClick={reviewButtonHandler}><b>인기순</b></SortButton>*/}
            {/*)}*/}
            <div style={{flexBasis : "50%", display:"flex", justifyContent:"right"}}>
              <SortButton
                  focusState={reviewButton}
                  onClick={reviewButtonHandler}><b>최신순</b></SortButton>
              <SortButton
                  focusState={!reviewButton}
                  onClick={reviewButtonHandler}><b>인기순</b></SortButton>
            </div>
          </div>
          {reviewButton ? (
            <ReviewList>
              {Array.isArray(reviewList) &&
                reviewList.map(review => {
                  return <ReviewItem key={review.drinkReviewId} review={review}></ReviewItem>;
                })}
            </ReviewList>
          ) : (
            <ReviewList>
              {Array.isArray(reviewListLike) &&
                reviewListLike.map(review => {
                  return <ReviewItem key={review.drinkReviewId} review={review}></ReviewItem>;
                })}
            </ReviewList>
          )}
          {/* <ReviewList>
            {Array.isArray(reviewList) &&
              reviewList.map(review => {
                return <ReviewItem key={review.drinkReviewId} review={review}></ReviewItem>;
              })}
          </ReviewList>
          <ReviewList>
            {Array.isArray(reviewListLike) &&
              reviewListLike.map(review => {
                return <ReviewItem key={review.drinkReviewId} review={review}></ReviewItem>;
              })}
          </ReviewList> */}
        </div>
        <footer>
          <Footer />
        </footer>
      </div>
    </>
  );
};
export default drinkpostMain;
