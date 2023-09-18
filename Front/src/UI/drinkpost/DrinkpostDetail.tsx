import { useNavigate, useParams } from "react-router-dom";
import whiskeyImage from "../../assets/whiskeyImage.png";
import ReviewItem from "../components/ReviewItem";
import styled from "styled-components";
import reviewIcon from "../../assets/reviewIcon.svg";
import { arrowLeftIcon } from "../../assets/AllIcon";
import { callApi } from "../../utils/api";
import { useState, useEffect, useRef } from "react";
import { Drink, Review } from "../../Type/types";
import backgroundImg from "../../assets/mdsimg.png";

const WholeDiv = styled.div`
  border-radius: 30px 30px 0px 0px;
  background-color: white;
  min-height: 70vh;
  position: relative;
  z-index: 1;
  top: -2rem;
  padding: 1.5rem 2rem;
`;

const DrinkThumbnail = styled.div`
  background-image: url(${backgroundImg});
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 30vh;
  color: white;
  display: flex;
  text-align: left;
`;

const InfoDiv = styled.div`
  display: flex;
  position: relative;
`;

const SimpleInfo = styled.div`
  text-align: center;
  width: 50%;
  word-wrap: break-word;
`;

const ImageInfo = styled.div`
  height: 200%;
  width: 56%;
  position: absolute;
  left: 70%;
  transform: translateX(-50%);
  bottom: -12px;
`;

const NavbarBackIcon = styled.div`
  margin-left: 1rem;
  margin-top: 1rem;
`;

const DescriptionP = styled.p`
  white-space: pre-wrap;
  word-spacing: 0.2rem;
  line-height: 150%;
  font-family: "NanumSquareNeo";
  /* font-family: "Noto Sans KR"; */
  font-size: 1rem;
  margin-top: 20px;
  text-align: start;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  max-height: 150px;
  transition: max-height 0.3s ease-in-out;

  // 늘리기
  &.show {
    display: block;
    max-height: 1000px;
    overflow: auto;
    -webkit-line-clamp: unset;
  }

  // 줄이기
  &.hide {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: 150px; /* 여기에 max-height 추가 */
  }
`;

const MoreButton = styled.div`
  border: none;
  display: inline-flex; /* flex를 유지하면서 inline 형태로 만들어 줍니다. */
  justify-content: flex-end;
  padding: 0px 0px;
  color: var(--c-gray);
  border-radius: 0.5rem;
  margin-top: 20px;
  margin-bottom: 0.625rem;

  &:hover {
    background-color: #e0e0e0;
  }

  &.hide {
    display: none;
  }
`;

const RoundBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 10%;

  background: var(--c-yellow);
  width: 4rem;
  height: 4rem;
  border-radius: 100px;
  z-index: 10;

  @media (max-width: 430px) {
    right: 5%;
  }
  @media (min-width: 431px) {
    left: 350px;
  }
`;

const DrinkpostDetail = () => {
  const { drinkId } = useParams();
  const navigate = useNavigate();
  const ArrowLeftIcon = arrowLeftIcon("white");
  const [showMore, setShowMore] = useState(false);
  const [detail, setDetail] = useState<Drink>();
  const [reviewList, setReviewList] = useState<Review[]>([]);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  const toReviewCreate = () => {
    navigate(`/drinkpost/${detail.drinkId}/review/create`);
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    callApi("get", `api/drink/${drinkId}`).then(res => {
      setDetail(res.data);
    });
  }, []);

  useEffect(() => {
    callApi("get", `api/drinkreview/${drinkId}`).then(res => {
      setReviewList(prev => [...prev, ...res.data.content]);
    });
  }, []);

  const transImage = (img: string) => {
    if (img === "no image") {
      return whiskeyImage;
    } else if (img === "asd") {
      return whiskeyImage;
    } else {
      return detail?.image;
    }
  };

  const getTagNameMk2 = (tagId: number) => {
    if (tagId === 0) {
      return "전체";
    } else if (tagId === 1) {
      return "양주";
    } else if (tagId === 2) {
      return "전통주";
    } else if (tagId === 3) {
      return "칵테일";
    } else if (tagId === 4) {
      return "사케";
    } else if (tagId === 5) {
      return "와인";
    } else if (tagId === 6) {
      return "수제맥주";
    } else if (tagId === 7) {
      return "소주/맥주";
    }
  };
  return (
    <>
      <DrinkThumbnail>
        <NavbarBackIcon
          onClick={() => {
            navigate(-1);
          }}
        >
          {ArrowLeftIcon}
        </NavbarBackIcon>
      </DrinkThumbnail>
      <WholeDiv>
        <InfoDiv>
          <SimpleInfo>
            <div
              style={{
                textAlign: "center",
                marginLeft: "10vw",
                fontFamily: "JejuGothic",
              }}
            >
              <h3 style={{ marginRight: "2vw", textAlign: "start" }}>{detail?.name}</h3>
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <b style={{ marginRight: "2vw" }}>주종</b>
                {getTagNameMk2(detail?.tagId)}
              </div>
              <div
                style={{
                  paddingTop: "1vh",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <b style={{ marginRight: "2vw" }}>도수 </b>
                {detail?.degree}%
              </div>
            </div>
            <div
              onClick={toReviewCreate}
              style={{
                width: "28vw",
                height: "8vh",
                backgroundColor: "var(--c-yellow)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "20px",
                marginTop: "2vh",
                marginLeft: "8vw",
                cursor: "pointer",
                fontFamily: "JejuGothic",
              }}
            >
              <b>후기 {reviewList.length}</b>
              <div style={{ marginLeft: "6%", marginTop: "4%" }}>
                <img src={reviewIcon} alt="" />
              </div>
            </div>
          </SimpleInfo>
          <ImageInfo>
            <img src={transImage(detail?.image)} alt="" style={{ width: "auto", height: "100%" }} />
          </ImageInfo>
        </InfoDiv>

        <div style={{}}>
          <DescriptionP className={showMore ? "show" : ""}>
            <hr />
            {detail?.description}
          </DescriptionP>
          {/* 늘리기 줄이기 토글 */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <MoreButton className={showMore ? "hide" : ""} onClick={toggleShowMore}>
              더보기
            </MoreButton>
            <MoreButton className={showMore ? "" : "hide"} onClick={toggleShowMore}>
              줄이기
            </MoreButton>
          </div>
        </div>

        <div className="reviewBox">
          <h1
            style={{
              textAlign: "start",
              marginBottom: "10px",
              fontFamily: "JejuGothic",
            }}
          >
            후기
          </h1>

          <div
            className="reviewList"
            style={{
              display: "flex",
              flexWrap: "wrap",

              justifyContent: "space-between",
            }}
          >
            {reviewList.map(review => {
              return <ReviewItem key={review.drinkReviewId} review={review}></ReviewItem>;
            })}
          </div>
        </div>
      </WholeDiv>
    </>
  );
};
export default DrinkpostDetail;
