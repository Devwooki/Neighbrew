import styled from "styled-components";
import React, { useState, useRef } from "react";

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

const ImageInputBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 10px;
  background-color: var(--c-yellow);
  padding: 0.5rem;
  margin-left: 0.5rem;
`;

const ReselectBtn = styled.div`
  background: var(--c-lightgray);
  border-radius: 10px;
  width: 2rem;
  font-family: "NanumSquareNeo";
  font-size: 15px;
  padding: 0.5rem;
  margin-left: 0.5rem;
  text-align: center;
`;

const ImageArea = styled.div<{ src: string }>`
  background: url(${props => props.src}) no-repeat center;
  background-size: cover;
  border-radius: 15px;
  position: relative;
  width: 70%;
  padding-bottom: 70%;
  overflow: hidden;
  margin-top: 1rem;
`;

type ImageInputProps = {
  imgSrc?: string; //이미지 경로
  getFunc?: (f: File) => void; //파일 타입을 부모로 가져가는 함수
  getImgSrc?: (src: string) => void;
};

const ImageInput = (props: ImageInputProps) => {
  //파일 업로드 용
  const [imgFile, setImgFile] = useState(
    (props.imgSrc ?? "no image") === "no image" ? "" : props.imgSrc
  );
  const imgRef = useRef<HTMLInputElement>(null);

  //이미지 파일 업로드 시 미리보기
  const saveImgFile = () => {
    if (imgRef.current.files[0]) {
      const file = imgRef.current.files[0]; //파일 객체 부모로 전달
      props.getFunc(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImgFile(reader.result);
        }
      };
    } else {
      props.getImgSrc("no image");
      props.getFunc(null);
    }
  };

  //입력한 이미지 파일 제거
  const resetImgFile = () => {
    imgRef.current.value = null;
    setImgFile(null); // 미리보기 초기화
    saveImgFile(); //부모 객체로 전달
  };

  return (
    <QuestionDiv style={{ textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Title style={{ margin: "0" }}>대표 이미지</Title>
        <ImgInput>
          <label htmlFor="img_file">
            <ImageInputBtn>
              <img src="/src/assets/imagePlusIcon.svg" width="90%" />
            </ImageInputBtn>
          </label>
          <input
            type="file"
            id="img_file"
            accept="image/jpg, image/png, image/jpeg"
            onChange={saveImgFile}
            ref={imgRef}
          />
        </ImgInput>
        {imgFile && <ReselectBtn onClick={resetImgFile}>취소</ReselectBtn>}
      </div>
      {imgFile && <ImageArea src={imgFile}></ImageArea>}
    </QuestionDiv>
  );
};
export default React.memo(ImageInput);
