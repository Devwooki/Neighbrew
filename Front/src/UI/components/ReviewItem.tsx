import styled from "styled-components";
import likeIcon from "../../assets/likeIcon.svg";
import { likeIcon2 } from "../../assets/AllIcon";
import { useState, useEffect } from "react";
import { Review } from "../../Type/types";
import { callApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import defaultImg from "../../assets/defaultImg.png";
import fancyDrinkImage from "../../assets/fancydrinkImage.jpg";

const ReviewCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
  height: auto;
  background-color: white;
  margin-bottom: 10px;
`;

const ReviewImg = styled.div`
  background-color: var(--c-lightgray);
  background-size: cover;
  background-repeat: no-repeat;
  border-radius: 12px;
  width: 95%;
  height: 150px;
  margin: 0% auto 0.5rem auto;
`;

const UserCard = styled.div`
  background-color: white;
  text-align: start;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 5px;
`;

// 유저 닉네임
const UserNickname = styled.div`
  display: flex;
  font-family: "NanumSquareNeo";
  justify-content: center;
  align-items: center;
  font-size: 12.6px;
  font-weight: 500;
  margin-left: 1vw;
  font-family: "Noto Sans KR";
`;

// 유저 프로필 사진
const UserImg = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
`;

// 길이가 길면 ...으로 표시
// MoreButton을 누르면 글이 전체로 표시
const DescriptionP = styled.p`
  white-space: pre-wrap;
  font-size: 0.8rem;
  margin-left: 1vw;
  margin-right: 1vw;
  margin-top: 1vh;
  margin-bottom: 1vh;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  font-family: "NanumSquareNeo";
  -webkit-line-clamp: 3; /* 라인수 */
  -webkit-box-orient: vertical;
`;

// 좋아요 버튼
// likeIcon을 누르면 좋아요 취소
const LikeButton = styled.button`
  width: 0.7rem;
  height: 0.7rem;
  background-color: white;
  border: none;
  background-image: url(${likeIcon});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 1vw;
  margin-top: 1vh;
  margin-bottom: 1vh;
  &.like {
    background-image: url(${likeIcon});
  }
  &.unlike {
    background-image: url(${likeIcon});
  }
`;

// 좋아요 수와 버튼
const LikeDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 좋아요 수
const LikeCount = styled.div`
  font-size: 0.6rem;
  margin-left: 0.3vw;
  color: #6e6e6e;
`;

const ReviewItem = ({ review }: { review: Review }) => {
  const nickname = review.user.nickname.includes("@")
    ? review.user.nickname.split("@")[0]
    : review.user.nickname;
  const [nameLimit, setNameLimit] = useState(12);
  const truncatedNickname =
    nickname.length > nameLimit ? nickname.substring(0, nameLimit) + "..." : nickname;
  const [showMore, setShowMore] = useState(false);
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const toReviewDetail = () => {
    navigate(`/drinkpost/${review.drink.drinkId}/${review.drinkReviewId}`);
  };

  useEffect(() => {
    callApi("GET", `api/like/${review.drinkReviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(res => {
      setLike(res.data);
    });
  }, [token, review.drinkReviewId]);

  useEffect(() => {
    callApi("GET", `api/drinkreview/review/${review.drinkReviewId}`)
      .then(res => {
        setLikeCount(res.data.likeCount);
      })
      .catch(() => {});
  }, [review.drinkReviewId, likeCount]);

  // 좋아요 버튼 누르면 좋아요 수 증가
  // 즉시반영
  const likeHandler = () => {
    callApi("POST", `api/like/${review.drinkReviewId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      if (!like) {
        setLikeCount(prev => prev + 1);
      } else {
        setLikeCount(prev => prev - 1);
      }
    });
    setLike(!like);
  };

  return (
    <>
      <ReviewCard>
        <ReviewImg
          style={{
            backgroundImage: `url(${review.img !== "no image" ? review.img : fancyDrinkImage})`,
          }}
          onClick={toReviewDetail}
        ></ReviewImg>
        <div style={{ width: "100%" }}>
          <UserCard>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  background: `url(${
                    review.user.profile !== "no image" ? review.user.profile : defaultImg
                  }) no-repeat center`,
                  backgroundSize: "cover",
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "50%",
                }}
              ></div>
              <UserNickname>{truncatedNickname}</UserNickname>
            </div>

            <LikeDiv>
              <div
                style={{
                  width: "0.7rem",
                  height: "0.7rem",
                  backgroundColor: "white",
                  border: "none",
                  marginRight: "0.8rem",
                  marginBottom: "1vh",
                }}
                onClick={likeHandler}
              >
                {like ? likeIcon2("var(--c-pink)") : likeIcon2("none")}
              </div>
              <LikeCount>{likeCount}</LikeCount>
            </LikeDiv>
          </UserCard>
          <div style={{ textAlign: "start" }}>
            <DescriptionP className={showMore ? "show" : ""}>{review?.content}</DescriptionP>
          </div>
        </div>
      </ReviewCard>
    </>
  );
};
export default ReviewItem;
