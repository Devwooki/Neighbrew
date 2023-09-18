import styled from "styled-components";
import { forwardRef, useState } from "react";
import { SubReview } from "../../Type/types";
import defaultImg from "../../assets/defaultImg.png";
import { useNavigate } from "react-router-dom";
import { moreIcon, deleteIcon, editIcon } from "../../assets/AllIcon";
import { ShortThreeDotModal, WhiteModal } from "../../style/common";
import Modal from "react-modal";
import Siren from "../../assets/siren.png";
import { callApi } from "../../utils/api";

const WholeDiv = styled.div`
  display: flex;
  margin-top: 1.5rem;
`;

const ModalIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  margin-right: 1rem;
`;

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

const ProfileDiv = styled.div`
  width: 12%;
  word-break: break-all;
`;

const ProfileDiv2 = styled.div`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 30px;
  background-size: cover;
`;

const NameAndContent = styled.div`
  margin-left: 8px;
  text-align: start;
  width: 76%;
`;

const MoreBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10%;
`;

type CommentItemProps = {
  subReview: SubReview;
};

const commentItem = forwardRef<HTMLDivElement, CommentItemProps>(props => {
  const myId = localStorage.getItem("myId");
  const { subReview } = props;
  const navigate = useNavigate();
  const MoreIcon = moreIcon();
  const EditIcon = editIcon();
  const DeleteIcon = deleteIcon();

  const [report, setReport] = useState(false); // 타인 신고하기 버튼 눌렀을 때, 신고할지 말지 묻는 모달을 띄운다.
  const [reportModalOn, setReportModalOn] = useState(false); // 타인 신고하기를 묻는 모달에 예를 눌렀을 때, 신고 완료 모달을 띄운다.
  const [deleteModalOn, setDeleteModalOn] = useState(false); // 본인 댓글 삭제하기 버튼 눌렀을 때, 삭제할지 말지 묻는 모달을 띄운다.
  const [threeDotOn, setThreeDotOn] = useState(false); // 본인 댓글의 ...버튼을 누른다.
  const [ThreeDotOnForOther, setThreeDotOnForOther] = useState(false); //타인 댓글의 ... 버튼을 누른다.
  const nickname = subReview.user.nickname.includes("@")
    ? subReview.user?.nickname.split("@")[0]
    : subReview.user?.nickname;
  const [nameLimit, setNameLimit] = useState(15);
  const truncatedNickname =
    nickname.length > nameLimit ? nickname.substring(0, nameLimit) + "..." : nickname;
  const goReviewUser = () => {
    navigate(`/myPage/${subReview.user.userId}`);
  };

  const moreHandler = () => {
    setThreeDotOn(true);
  };
  const moreHandlerForOther = () => {
    setThreeDotOnForOther(true);
  };
  const toDeleteQuestionHandler = () => {
    setThreeDotOn(false);
    setDeleteModalOn(true);
  };
  const deleteHandler = () => {
    callApi("delete", `api/subreview/delete/${subReview.subReviewId}`);
    setDeleteModalOn(false);
  };

  const reportQuestionHandler = () => {
    setThreeDotOnForOther(false);
    setReport(true);
  };

  const reportHandler = () => {
    setReport(false);
    setReportModalOn(true);
  };

  return (
    <>
      <WholeDiv>
        <ProfileDiv onClick={goReviewUser}>
          <ProfileDiv2
            style={{
              backgroundImage: `url(${
                subReview.user.profile === "no image" ? defaultImg : subReview.user.profile
              })`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></ProfileDiv2>
        </ProfileDiv>
        <NameAndContent onClick={goReviewUser}>
          <div style={{ fontFamily: "JejuGothic" }}>
            <b>{truncatedNickname}</b>
          </div>
          <div style={{ fontFamily: "NanumSquareNeo", marginTop: "1vh", whiteSpace: "pre-wrap" }}>
            {subReview.content}
          </div>
        </NameAndContent>
        {subReview.user.userId.toString() === myId ? (
          <MoreBtn onClick={moreHandler}>{MoreIcon}</MoreBtn>
        ) : (
          <MoreBtn onClick={moreHandlerForOther}>{MoreIcon}</MoreBtn>
        )}

        {/* 자기 댓글 more */}
        <Modal
          isOpen={threeDotOn}
          onRequestClose={() => setThreeDotOn(false)}
          style={ShortThreeDotModal}
          ariaHideApp={false}
        >
          <div style={{ fontSize: "1rem", color: "var(--c-gray)", fontFamily: "NanumSquareNeo" }}>
            댓글
          </div>
          <div
            onClick={toDeleteQuestionHandler}
            style={{ display: "flex", alignItems: "center", height: "80%" }}
          >
            <ModalIcon>{DeleteIcon}</ModalIcon>
            <div style={{ color: "#eb0505", fontSize: "16px", fontFamily: "NanumSquareNeo" }}>
              삭제하기
            </div>
          </div>
        </Modal>

        {/* 댓글 삭제 확인 모달 */}
        <Modal
          isOpen={deleteModalOn}
          onRequestClose={() => setDeleteModalOn(false)}
          style={WhiteModal}
          ariaHideApp={false}
        >
          <div>
            <div style={{ padding: "1rem 0 4rem 0" }}>정말 이 댓글을 삭제하시겠습니까?</div>
            <ModalBtnDiv>
              <ModalBtn onClick={deleteHandler}>예</ModalBtn>
              <ModalBtn onClick={() => setDeleteModalOn(false)}>아니요</ModalBtn>
            </ModalBtnDiv>
          </div>
        </Modal>

        {/* 타인 댓글 more */}
        <Modal
          isOpen={ThreeDotOnForOther}
          onRequestClose={() => setThreeDotOnForOther(false)}
          style={ShortThreeDotModal}
          ariaHideApp={false}
        >
          <div style={{ fontSize: "1rem", color: "var(--c-gray)", fontFamily: "NanumSquareNeo" }}>
            댓글
          </div>
          <div
            onClick={reportQuestionHandler}
            style={{ display: "flex", alignItems: "center", height: "80%" }}
          >
            <ModalIcon>
              <img src={Siren} alt="" style={{ width: "100%", height: "100%" }} />
            </ModalIcon>
            <div style={{ color: "#eb0505", fontSize: "16px", fontFamily: "NanumSquareNeo" }}>
              신고하기
            </div>
          </div>
        </Modal>

        {/* 타인 신고 확인 */}
        <Modal
          isOpen={report}
          onRequestClose={() => setReport(false)}
          style={WhiteModal}
          ariaHideApp={false}
        >
          <div>
            <div style={{ padding: "1rem 0 4rem 0" }}>정말 이 유저를 신고하시겠습니까?</div>
            <ModalBtnDiv>
              <ModalBtn onClick={reportHandler}>예</ModalBtn>
              <ModalBtn onClick={() => setReport(false)}>아니요</ModalBtn>
            </ModalBtnDiv>
          </div>
        </Modal>

        {/* 타인 신고 완료 */}
        <Modal
          isOpen={reportModalOn}
          onRequestClose={() => setReportModalOn(false)}
          style={WhiteModal}
          ariaHideApp={false}
        >
          <div style={{ padding: "1rem 0rem", fontSize: "16px", fontFamily: "NanumSquareNeo" }}>
            신고 완료되었습니다.
          </div>
        </Modal>
      </WholeDiv>
    </>
  );
});
export default commentItem;
