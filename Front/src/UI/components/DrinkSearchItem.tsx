import styled from "styled-components";

const CardDiv = styled.div`
  background-color: white;
  border-radius: 14px;
  border: none;
`;

const WholeDiv = styled.div`
  display: flex;
  padding: 8px;
`;

const ImgDiv = styled.div`
  display: flex;

  border: none;
  border-radius: 14px;
  background-color: var(--c-gray);
  min-width: 80px;
  max-height: 80px;
`;

const DrinkInfoDiv = styled.div`
  margin-left: 10px;
  text-align: start;
`;

const DrinkSearchItem = () => {
  return (
    <>
      <CardDiv>
        <WholeDiv>
          <ImgDiv>
            <img src="#" alt="drinkImg" />
          </ImgDiv>
          <DrinkInfoDiv>
            <h4 style={{ margin: "0px", marginBottom: "5px" }}>주류 이름</h4>
            <p>40도</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum veniam, ducimus
              delectus esse culpa itaque rem fuga, repellat, hic corrupti voluptatem. Expedita harum
              voluptatum possimus sunt, non id facilis eveniet!
            </p>
          </DrinkInfoDiv>
        </WholeDiv>
      </CardDiv>
    </>
  );
};
export default DrinkSearchItem;
