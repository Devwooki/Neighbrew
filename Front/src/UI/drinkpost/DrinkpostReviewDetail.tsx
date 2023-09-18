import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import styled from "styled-components";
import { Drink, Review, SubReview } from "../../Type/types";
import defaultImg from "../../assets/defaultImg.png";
import fancyDrinkImage from "../../assets/fancydrinkImage.jpg";
import { callApi } from "../../utils/api";
import NavbarSimple from "../navbar/NavbarSimple";
import {
  commentIcon,
  likeIcon,
  deleteIcon,
  editIcon,
  moreIcon,
  likeIcon2,
} from "./../../assets/AllIcon";
import sendImage from "./../../assets/send.png";
import CommentItem from "./../components/CommentItem";
import Modal from "react-modal";
import { WhiteModal } from "../../style/common";

const StyleAutoTextArea = styled(TextareaAutosize)`
  display: flex;
  flex-basis: 90%;
  border: 0.5px solid #dfdfdf;
  background-color: #eeeeee;
  border-radius: 5px;
  margin: 0.5rem 0 0.5rem 0.5rem;
  padding: 0.3rem;
  overflow-y: auto;
  outline: none;

  // 글을 아래에 배치
  align-self: flex-end;
  font-size: 1rem;

  &:focus {
    border: none;
  }
`;
const LikeAndComment = styled.div`
  margin: 0.5rem 0.5rem 0 0.5rem;
  display: flex;
  justify-content: left;
  width: 40%;
  margin-top: 1.5vh;
  font-size: 20px;
`;

const DescriptionP = styled.p`
  white-space: pre-wrap;
  word-spacing: 0.2rem;
  line-height: 150%;
  font-family: "NanumSquareNeo";
  /* font-family: "Noto Sans KR"; */
  font-size: 1rem;
  margin: 0.5rem;

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

const Description = styled.div`
  font-family: "NanumSquareNeo";
  text-align: start;
  margin: 0.5rem;
  white-space: pre-wrap;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;

  &.show {
    display: block;
    max-height: none;
    overflow: auto;
    -webkit-line-clamp: unset;
  }
`;

const WholeDiv = styled.div``;

const ImageDiv = styled.div`
  background-color: var(--c-lightgray);
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
`;

const Usercard = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem;
  justify-content: space-between;
`;

const FollowDiv = styled.div`
  width: 5rem;
  height: 2rem;
  border-radius: 20px;
  font-family: JejuGothic;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CommentBox = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  width: 100%;
  border-top: 0.5px solid #dfdfdf;
`;

const CommentButton = styled.button`
  background-color: var(--c-blue);
  border: none;
  border-radius: 5px;
  flex-basis: 10%;
`;

const SendImg = styled.img`
  width: 23px;
  height: 23px;
`;

const SubReviewList = styled.div`
  padding-bottom: 4.5rem;
  margin: 0.5rem;
`;

const LikeAndCommentDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 4vw;
`;

const InfoBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ThreeDotModal = {
  content: {
    top: "90%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "16%",
    borderRadius: "24px 24px 0px 0px",
    backgroundColor: "#ffffff",
    fontFamily: "NanumSquareNeo",
    fontSize: "1.5rem",
    color: "black",
    transition: "top 2s ease-in-out",
  },
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: "1001",
  },
};

const ModalBtnDiv = styled.div`
  position: fixed;
  bottom: 0;
  left: 10%;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const ModalBtn = styled.div`
  width: 5rem;
  padding: 0.5rem;
  margin: 0 0.5rem;
  border-radius: 5px;
  background: var(--c-yellow);
`;

const ModalIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  margin-right: 1rem;
`;

const DrinkpostReviewDetail = () => {
  const MoreIcon = moreIcon();
  const EditIcon = editIcon();
  const DeleteIcon = deleteIcon();
  const CommentIcon = commentIcon();
  const { drinkId, reviewId } = useParams();
  const [showMore, setShowMore] = useState(false);
  const [followRejection, setFollowRejection] = useState(false);
  const [deleteModalOn, setDeleteModalOn] = useState(false);
  const [threeDotOn, setThreeDotOn] = useState(false);
  const [review, setReview] = useState<Review>();
  const [drink, setDrink] = useState<Drink>();
  const [following, setFollowing] = useState(0);
  const [subReviewList, setSubReviewList] = useState<SubReview[]>([]);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  useEffect(() => {
    callApi("get", `api/drink/${drinkId}`).then(res => {
      setDrink(res.data);
    });

    callApi("get", `api/subreview/list/${reviewId}`).then(res => {
      setSubReviewList(res.data);
    });
  }, []);

  useEffect(() => {
    async function summonReview() {
      // 술 상세 후기 조회 요청
      const response1 = await callApi("get", `api/drinkreview/review/${reviewId}`);
      setReview(response1.data);
      setLikeCount(response1.data.likeCount);
      const userId = response1.data.user.userId;
      // 후기 쓴 사람에 대한 follow 요청
      // 술 상세 후기 조회 이후에 이루어져야 함.
      const response2 = await callApi("get", `api/follow/follower/${userId}`);
      if (response2.data.length == 0) {
        setFollowing(0);
        return;
      }
      response2.data.map((item, i) => {
        if (item.follower.userId == parseInt(localStorage.getItem("myId"))) {
          setFollowing(1);
          return;
        } else if (i == response2.data.length - 1) {
          setFollowing(0);
        }
      });
    }

    summonReview();
  }, []);

  useEffect(() => {
    callApi("GET", `api/like/${reviewId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then(res => {
      setLike(res.data);
    });
  }, [localStorage.getItem("token")]);

  const likeHandler = () => {
    callApi("POST", `api/like/${reviewId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
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

  const followHandler = () => {
    if (review?.user.userId.toString() === localStorage.getItem("myId")) {
      setFollowRejection(true);
      setTimeout(() => setFollowRejection(false), 1000);
      return;
    }
    callApi("post", `api/follow/${review?.user.userId}`)
      .then(() => {
        followers();
      })
      .catch(() => {});
  };

  const followers = async () => {
    callApi("get", `api/follow/follower/${review?.user.userId}`).then(res => {
      if (res.data.length == 0) {
        setFollowing(0);
        return;
      }

      res.data.map((item, i) => {
        if (item.follower.userId == parseInt(localStorage.getItem("myId"))) {
          setFollowing(1);
          return;
        } else if (i == res.data.length - 1) {
          setFollowing(0);
        }
      });
    });
  };

  const toProfileHandler = () => {
    navigate(`/myPage/${review?.user.userId}`);
  };

  useEffect(() => {}, [comment]);

  // 술 후기에 대한 댓글 제출하는 함수.
  const submitHandler = async () => {
    const fun = await callApi("post", "api/subreview/write", {
      content: comment.trim(),
      drinkReviewId: reviewId,
    });

    setComment("");
    setSubReviewList(prev => [fun.data, ...prev]);
  };

  const modalHandler = () => {
    setThreeDotOn(true);
  };

  const toDeleteQuestionHandler = () => {
    setDeleteModalOn(true);
    setThreeDotOn(false);
  };

  const toUpdateHandler = () => {
    navigate("update/");
  };

  const deleteHandler = () => {
    callApi("delete", `api/drinkreview/${review?.drinkReviewId}`).then(() => {
      navigate(-1);
    });
  };
  return (
    <>
      <NavbarSimple title={drink?.name}></NavbarSimple>
      <WholeDiv>
        <Usercard>
          <div onClick={toProfileHandler} style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                backgroundImage: `url(${
                  review?.user.profile !== "no image" ? review?.user.profile : defaultImg
                })`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                width: "2.4rem",
                height: "2.4rem",
                borderRadius: "100px",
                marginRight: "0.5rem",
              }}
            ></div>
            <div>
              <b>{review?.user.nickname}</b>
            </div>
          </div>
          {review?.user.userId.toString() !== localStorage.getItem("myId") ? (
            <FollowDiv
              style={{
                backgroundColor: following === 0 ? "var(--c-yellow)" : "var(--c-lightgray)",
              }}
              onClick={followHandler}
            >
              {following === 0 ? "팔로우" : "언팔로우"}
            </FollowDiv>
          ) : null}
        </Usercard>
        <ImageDiv>
          <img
            src={review?.img !== "no image" ? review?.img : fancyDrinkImage}
            style={{ width: "100%" }}
          />
        </ImageDiv>
        <InfoBox>
          <LikeAndComment>
            <LikeAndCommentDiv>
              <div
                onClick={likeHandler}
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "0.5rem",
                }}
              >
                {like ? likeIcon2("var(--c-pink)") : likeIcon2("none")}
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>{likeCount}</div>
            </LikeAndCommentDiv>
            <LikeAndCommentDiv>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "0.5rem",
                }}
              >
                {CommentIcon}
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>{subReviewList.length}</div>
            </LikeAndCommentDiv>
          </LikeAndComment>
          {review?.user.userId.toString() === localStorage.getItem("myId") ? (
            <div
              style={{
                cursor: "pointer",
                margin: "0.5rem",
                borderRadius: "8px",
              }}
              onClick={modalHandler}
            >
              {MoreIcon}
            </div>
          ) : null}
        </InfoBox>

        <div>
          <DescriptionP className={showMore ? "show" : ""}>
            <hr />
            {review?.content}
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
        <CommentBox>
          <StyleAutoTextArea
            style={{ fontFamily: "NanumSquareNeo", resize: "none" }}
            placeholder="댓글을 작성해주세요..."
            value={comment}
            onChange={e => {
              setComment(e.target.value);
            }}
            minRows={1}
            maxRows={4}
          />
          <CommentButton
            onClick={() => {
              submitHandler();
            }}
          >
            <SendImg src={sendImage} alt="" />
          </CommentButton>
        </CommentBox>
        <SubReviewList>
          {subReviewList.map((subReview, i) => {
            return <CommentItem key={i} subReview={subReview}></CommentItem>;
          })}
        </SubReviewList>
      </WholeDiv>
      <Modal
        isOpen={threeDotOn}
        onRequestClose={() => setThreeDotOn(false)}
        style={ThreeDotModal}
        ariaHideApp={false}
      >
        <div
          style={{
            fontSize: "1rem",
            color: "var(--c-gray)",
            fontFamily: "NanumSquareNeo",
          }}
        >
          후기
        </div>
        <div
          onClick={toUpdateHandler}
          style={{ display: "flex", alignItems: "center", height: "40%" }}
        >
          <ModalIcon>{EditIcon}</ModalIcon>
          <div
            style={{
              color: "black",
              fontSize: "16px",
              fontFamily: "NanumSquareNeo",
            }}
          >
            수정하기
          </div>
        </div>

        <div
          onClick={toDeleteQuestionHandler}
          style={{ display: "flex", alignItems: "center", height: "40%" }}
        >
          <ModalIcon>{DeleteIcon}</ModalIcon>
          <div
            style={{
              color: "#eb0505",
              fontSize: "16px",
              fontFamily: "NanumSquareNeo",
            }}
          >
            삭제하기
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={deleteModalOn}
        onRequestClose={() => setDeleteModalOn(false)}
        style={WhiteModal}
        ariaHideApp={true}
      >
        <div>
          <div style={{ padding: "1rem 0 4rem 0" }}>정말 이 후기를 삭제하시겠습니까?</div>
          <ModalBtnDiv>
            <ModalBtn onClick={deleteHandler}>예</ModalBtn>
            <ModalBtn onClick={() => setDeleteModalOn(false)}>아니요</ModalBtn>
          </ModalBtnDiv>
        </div>
      </Modal>
    </>
  );
};
export default DrinkpostReviewDetail;
