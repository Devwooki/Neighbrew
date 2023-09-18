import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { Drink, User } from "../../Type/types";
import { callApi } from "../../utils/api";
import ImageInput from "../components/ImageInput";
import FooterBigBtn from "../footer/FooterBigBtn";
import NavbarSimple from "../navbar/NavbarSimple";
import imageCompression from "browser-image-compression";
import LoadingDot from "../etc/LoadingDot";
import Modal from "react-modal";
import { WhiteModal } from "../../style/common";

const CreateBody = styled.div`
  width: 100%;
`;

const InputDiv = styled.div`
  margin-left: 2rem;
  text-align: start;
  margin-bottom: 30px;
  margin-right: 2rem;
`;

const LongTextInput = styled.textarea`
  font-family: "NanumSquareNeo";
  border: 1px solid var(--c-gray);
  width: 100%;
  height: 30vh;
  font-size: 1rem;
  border-radius: 8px;
  resize: none;
  outline: none;
  &:focus {
    border: 2px solid black;
  }
`;

const QuestionDiv = styled.div`
  margin-top: 1.5rem;
`;

const DrinkpostReviewCreate = () => {
  const [fileSizeTwenty, setFileSizeTwenty] = useState(false);
  const [isEmptyContent, setIsEmptyContent] = useState(false);
  const navigate = useNavigate();
  const { drinkId } = useParams();
  const [drink, setDrink] = useState<Drink>();
  const [review, setReview] = useState("");
  const [myInfo, setMyInfo] = useState<User>();
  const reviewHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };
  const myId = localStorage.getItem("myId");
  const [imgFile, setImgFile] = useState(null);
  const [loadingModalOn, setLoadingModalOn] = useState(false); //로딩중일 때 모달(이미지 압축중일때)
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    callApi("get", `api/drink/${drinkId}`).then(res => {
      setDrink(res.data);
    });
  }, []);
  useEffect(() => {
    callApi("get", `api/user/myinfo`).then(res => {
      setMyInfo(res.data);
    });
  }, []);

  //이미지 압축에 사용하는 옵션
  const options = {
    maxWidthOrHeight: 1000, // 허용하는 최대 width, height 값 지정
  };

  const reviewSubmit = () => {
    if (isClick) return; //클릭했음(api 중복호출방지)
    setIsClick(true); //클릭했음(api 중복호출방지)

    const file = imgFile;
    const formData = new FormData();

    if (review === "") {
      setIsEmptyContent(true);
      return;
    }
    if (file) {
      if (file.size > 1024 * 1024 * 20) {
        alert("20MB 이하 이미지만 올릴 수 있습니다.");
        return;
      }
    }
    formData.append("drinkId", drinkId);
    formData.append("content", review);
    formData.append("image", file);

    if (file === null) {
      formData.append("image", file);
      createApi(formData);
    } else {
      setLoadingModalOn(true);
      const uploadFile = imageCompression(file, options);
      uploadFile
        .then(res => {
          const resizingFile = new File([res], file.name, {
            type: file.type,
          });
          formData.append("image", resizingFile);
        })
        .then(() => {
          createApi(formData);
        })
        .catch(() => {
          setLoadingModalOn(false);
          setIsClick(false);
        });
    }
  };

  const createApi = (f: FormData) => {
    axios
      .post(`/api/drinkreview`, f, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          UserID: myId,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(res => {
        navigate(`/drinkpost/${drinkId}/${res.data.drinkReviewId}`, {
          replace: true,
        });
      });
  };

  return (
    <>
      <NavbarSimple title={drink?.name} />
      <CreateBody>
        <InputDiv>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="review">
              <b>후기 작성</b>
            </label>
          </div>
          <LongTextInput
            id="review"
            value={review}
            placeholder="후기 글을 작성해주세요."
            onChange={reviewHandler}
            autoFocus
          ></LongTextInput>
        </InputDiv>
        <div style={{ marginLeft: "36px" }}>
          <QuestionDiv style={{ textAlign: "left" }}>
            <ImageInput getFunc={setImgFile} />
          </QuestionDiv>
        </div>
        <Modal
          isOpen={fileSizeTwenty}
          onRequestClose={() => setFileSizeTwenty(false)}
          style={WhiteModal}
          ariaHideApp={false}
        >
          <div style={{ padding: "1rem 0rem", fontSize: "1.4rem" }}>
            20MB 이상의 파일을 업로드할 수 없습니다.
          </div>
        </Modal>
        <Modal
          isOpen={isEmptyContent}
          onRequestClose={() => setIsEmptyContent(false)}
          style={WhiteModal}
          ariaHideApp={false}
        >
          <div style={{ padding: "1rem 0rem", fontSize: "1.4rem" }}>후기 내용을 입력해주세요.</div>
        </Modal>
      </CreateBody>
      <FooterBigBtn content="등록하기" color="var(--c-yellow)" reqFunc={reviewSubmit} />
      <Modal
        isOpen={loadingModalOn}
        onRequestClose={() => {}} //닫히지 않아야함
        style={WhiteModal}
      >
        <div style={{ whiteSpace: "pre-line", overflow: "auto", padding: "1rem" }}>
          <div style={{ paddingBottom: "0.5rem" }}>
            이미지 압축중입니다. <br /> 잠시만 기다려주세요.
          </div>
          <LoadingDot color="var(--c-yellow)" />
        </div>
      </Modal>
    </>
  );
};
export default DrinkpostReviewCreate;
