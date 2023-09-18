import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { callApi } from "../../utils/api";
import { User, Drink } from "../../Type/types";
import ImageInput from "../components/ImageInput";
import FooterBigBtn from "../footer/FooterBigBtn";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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

const DrinkpostReviewCreate = () => {
  const navigate = useNavigate();
  const [newImgSrc, setNewImgSrc] = useState("");
  const { drinkId, reviewId } = useParams();
  const [drink, setDrink] = useState<Drink>();
  const [review, setReview] = useState("");
  const [myInfo, setMyInfo] = useState<User>();
  const reviewHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  };
  const [loadingModalOn, setLoadingModalOn] = useState(false); //로딩중 모달
  const [isClick, setIsClick] = useState(false);

  const [file, setFile] = useState(null);

  useEffect(() => {
    callApi("get", `api/drink/${drinkId}`).then(res => {
      setDrink(res.data);
    });
    callApi("get", `api/drinkreview/review/${reviewId}`).then(res => {
      setReview(res.data.content);
      setNewImgSrc(res.data.img);
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
    if (isClick) return; //throttle역할
    setIsClick(true);

    const formData = new FormData();

    formData.append("drinkReviewId", reviewId);
    formData.append("content", review);

    if (review === "") {
      alert("내용을 입력해주세요.");
      return;
    }
    if (file) {
      if (file.size > 1024 * 1024 * 20) {
        alert("20MB 이하 이미지만 올릴 수 있습니다.");
        return;
      }
    }

    if (file === null && newImgSrc === "no image") {
      formData.append("imgSrc", "no image");
      updateApi(formData);
    } else if (file !== null) {
      setLoadingModalOn(true);
      //압축하면 blob 타입-> file 타입으로 변환
      const uploadFile = imageCompression(file, options);
      uploadFile
        .then(res => {
          const resizingFile = new File([res], file.name, {
            type: file.type,
          });
          formData.append("image", resizingFile);
        })
        .then(() => {
          updateApi(formData);
        })
        .catch(e => {
          setLoadingModalOn(false);
          setIsClick(false);
        });
    } else {
      updateApi(formData);
    }
  };

  const updateApi = (f: FormData) => {
    axios
      .put(`/api/drinkreview/${reviewId}/${localStorage.getItem("myId")}`, f, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          UserID: localStorage.getItem("myId"),
          "Content-Type": "multipart/form-data",
        },
      })
      .then(res => {
        navigate(-1);
      })
      .catch(err => {
        setIsClick(false);
      });
  };

  const toPreviousPage = () => {
    navigate(`/drinkpost/${drinkId}`);
  };

  return (
    <>
      <NavbarSimple title={drink?.name} />
      <CreateBody>
        <InputDiv>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="review">
              <b style={{ fontFamily: "JejuGothic" }}>후기 수정</b>
            </label>
          </div>
          <LongTextInput
            id="review"
            value={review}
            placeholder="후기 글을 수정해주세요."
            onChange={reviewHandler}
            autoFocus
          ></LongTextInput>
        </InputDiv>
        <div style={{ marginLeft: "36px" }}>
          <ImageInput
            key={newImgSrc}
            getFunc={setFile}
            imgSrc={newImgSrc}
            getImgSrc={setNewImgSrc}
          />
        </div>
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
