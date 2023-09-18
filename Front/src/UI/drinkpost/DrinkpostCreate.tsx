// 술장에 술 정보를 입력하고 올릴 수 있는 create창입니다.
//

import DrinkCategory from "../drinkCategory/DrinkCategory";
import styled from "styled-components";
import { useState, useRef } from "react";
import { callApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import ImageInput from "../components/ImageInput";
import TextareaAutosize from "react-textarea-autosize";
import NavbarSimple from "../navbar/NavbarSimple";
import FooterBigBtn from "../footer/FooterBigBtn";
import Modal from "react-modal";
import { WhiteModal } from "../../style/common";

// 여기부터 지정한 부분까지 style 부분입니다.
// GuideText는 h3 tag가 상하 margin을 너무 많이 잡아서 새로 만든 겁니다.
// 상하 margin을 적게 잡는 것 말고는 h3와 차이점은 없습니다.
const GuideText = styled.h3`
  margin-bottom: 0.5rem;
`;

// input tag를 안에 넣을 div tag입니다.
const InputDiv = styled.div`
  width: 100%;
  background-color: white;
  position: sticky;
  max-height: 150px;
  box-sizing: border-box;
  margin-bottom: 3px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

// 실질적으로 정보를 입력할 input tag입니다.
// placeholder 사이즈는 10px
const Input = styled.input`
  font-size: 16px;
  width: 98%;
  height: 70%;
  border: none;
  border-bottom: 1px solid #444;
  outline: none;

  &:focus {
    border-bottom: 2px solid #000000;
  }
`;

const TextAreaDiv = styled(TextareaAutosize)`
  resize: none;
  font-size: 1rem;
  outline: none;
  font-family: "NanumSqaureNeo";
  border-radius: 12px;
  &:focus {
    border: 2px solid #000000;
  }
`;

// 에러 메세지를 띄우기 위한 div tag입니다.
// display는 none으로 되어있습니다.
// 에러 메세지를 띄우기 위해서는 display를 block으로 바꿔주면 됩니다.
const ErrorMessage = styled.div<{
  style: { display: string };
}>`
  font-size: 12px;
  color: red;
  margin-top: 5px;
  display: none;
`;

// 도수 관련 정보 입력은 한 줄로 되어있습니다.
// 따라서 InputDiv에 있는 justifyContent : space-around부분이 없습니다.
const InputDivAlcohol = styled.span`
  width: 100%;
  background-color: white;
  position: sticky;
  height: 2.5rem;
  box-sizing: border-box;
  margin-bottom: 3px;
  display: flex;
  align-items: center;
`;

// 도수 관련 input tag는 작습니다.
// 따라서 width는 15%으로 맞춰져있습니다.
// defalueValue는 0으로 되어있습니다.
const InputAlcohol = styled.input`
  font-size: 18px;
  width: 15%;
  height: 70%;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  outline: none;

  &:focus {
    border-bottom: 2px solid var(--c-black);
  }

  &::placeholder {
    color: var(--c-gray);
  }
`;

const QuestionDiv = styled.div`
  margin-top: 1.5rem;
`;

const Title = styled.div`
  font-family: "JejuGothic";
  font-size: 20px;
  text-align: left;
  margin-bottom: 0.5rem;
`;

const ImgInput = styled.div`
  // label로 대신하고 input은 숨기기 위한 css
  input[type="file"] {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`;

const ImageArea = styled.div<{ src: string }>`
  background: url(${props => props.src}) no-repeat center;
  background-size: cover;
  border-radius: 15px;
  position: relative;
  width: 30%;
  padding-bottom: 30%;
  overflow: hidden;
`;

const CateDiv = styled.div`
  height: 10rem;
  margin-top: 1rem;
  background: white;
  div {
    margin: 0;
  }
  .first,
  .second {
    display: flex;
    justify-content: space-around;
    margin-top: 0.5rem;
  }
`;

//여기까지 style 부분입니다.

// 서버로부터 받은 이미지 URL이나 정보를 리턴하거나 활용할 수 있습니다.

const DrinkpostCreate = () => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const getDrinkCategory = (tagId: number) => {
    setSelectedCategory(tagId);
  };
  const [fileSizeTwenty, setFileSizeTwenty] = useState(false);
  const [overHundred, setOverHundred] = useState(false);
  const [isEmptyDesc, setIsEmptyDesc] = useState(false);
  const [iseEmptyName, setIsEmptyName] = useState(false);
  const [drinkName, setDrinkName] = useState("");
  const [drinkDescription, setDrinkDescription] = useState("");
  const [drinkAlcohol, setDrinkAlcohol] = useState<number>();
  const [inputCheck, setInputCheck] = useState(false);

  const [isClick, setIsClick] = useState(false); //throttle 역할, 폼 중복 제출 막아주기

  const navigate = useNavigate();

  const drinkNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDrinkName(e.target.value);
  };
  const drinkAlcoholHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (parseInt(e.target.value) > 100) {
      setOverHundred(true);
      return;
    }
    if (parseInt(e.target.value) <= 0) {
      setOverHundred(true);
      return;
    }
    setDrinkAlcohol(parseInt(e.target.value));
  };
  const drinkDescriptionHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDrinkDescription(e.target.value);
  };

  const [imgFile, setImgFile] = useState(null);

  //이미지 압축에 사용하는 옵션
  const options = {
    maxWidthOrHeight: 1000, // 허용하는 최대 width, height 값 지정
  };

  const drinkSubmitHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isClick) return; //클릭했다면(api 중복호출방지)

    const file = imgFile;
    const formData = new FormData();

    if (file) {
      if (file.size > 1024 * 1024 * 20) {
        setFileSizeTwenty(true);
        return;
      }
    }
    if (drinkAlcohol > 100) {
      setOverHundred(true);
      return;
    }

    if (drinkName.trim() === "") {
      setIsEmptyName(true);
      return;
    }
    if (drinkDescription.trim() === "") {
      setIsEmptyDesc(true);
      return;
    }
    formData.append("name", drinkName.trim());
    formData.append("image", file);
    formData.append("description", drinkDescription.trim());
    formData.append("degree", drinkAlcohol.toString());
    formData.append("tagId", selectedCategory.toString());

    callApi("post", "api/drink", formData).then(res => {
      navigate(`/drinkpost/${res.data.drinkId}`, { replace: true });
    });
  };

  const createApi = (f: FormData) => {
    callApi("post", "api/drink", f)
      .then(res => {
        navigate(`/drinkpost/${res.data.drinkId}`, { replace: true });
      })
      .catch(err => {
        setIsClick(false);
      });
  };

  return (
    <div>
      <NavbarSimple title="술 문서 등록하기" />
      <div style={{ textAlign: "start", margin: "0px 15px 80px 15px" }}>
        <GuideText>이름</GuideText>
        <InputDiv>
          <Input
            value={drinkName}
            onChange={drinkNameHandler}
            placeholder="ex. 글렌피딕 15년, 테라스 가우다"
            autoFocus
          ></Input>
          {/* 등록 버튼을 누르기전에는 숨겨져있음 */}
          <ErrorMessage
            style={{
              display: drinkName.trim().length === 0 && inputCheck ? "block" : "none",
            }}
          >
            이름을 입력해주세요.
          </ErrorMessage>
        </InputDiv>
        <h3>카테고리</h3>
        <CateDiv>
          <DrinkCategory
            getFunc={getDrinkCategory}
            isSearch={false}
            selectedId={selectedCategory}
          ></DrinkCategory>
        </CateDiv>

        <GuideText>설명</GuideText>
        <InputDiv>
          <TextAreaDiv
            value={drinkDescription}
            onChange={drinkDescriptionHandler}
            placeholder="ex. 탄닌 덕분에 은은한 단맛이 돌아요."
            minRows={3}
            maxRows={15}
          ></TextAreaDiv>
          <ErrorMessage
            style={{
              display: drinkDescription.trim().length === 0 && inputCheck ? "block" : "none",
            }}
          >
            설명을 입력해주세요.
          </ErrorMessage>
        </InputDiv>
        <InputDivAlcohol>
          <h3 style={{ marginRight: "1rem" }}>도수</h3>
          <InputAlcohol
            defaultValue={0}
            value={drinkAlcohol}
            onChange={drinkAlcoholHandler}
            type="number"
          ></InputAlcohol>
          <p>%</p>
        </InputDivAlcohol>
        <QuestionDiv style={{ textAlign: "left" }}>
          <ImageInput getFunc={setImgFile} />
        </QuestionDiv>
      </div>
      <FooterBigBtn content="등록하기" color="var(--c-yellow)" reqFunc={drinkSubmitHandler} />
      <Modal
        isOpen={overHundred}
        onRequestClose={() => setOverHundred(false)}
        style={WhiteModal}
        ariaHideApp={false}
      >
        <div style={{ padding: "1rem 0rem", fontSize: "1.4rem" }}>
          도수는 0도 초과, 100도 이하입니다.
        </div>
      </Modal>
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
        isOpen={iseEmptyName}
        onRequestClose={() => setIsEmptyName(false)}
        style={WhiteModal}
        ariaHideApp={false}
      >
        <div style={{ padding: "1rem 0rem", fontSize: "1.4rem" }}>술의 이름을 입력해주세요.</div>
      </Modal>
      <Modal
        isOpen={isEmptyDesc}
        onRequestClose={() => setIsEmptyDesc(false)}
        style={WhiteModal}
        ariaHideApp={false}
      >
        <div style={{ padding: "1rem 0rem", fontSize: "1.4rem" }}>술의 설명을 입력해주세요.</div>
      </Modal>
    </div>
  );
};

export default DrinkpostCreate;
