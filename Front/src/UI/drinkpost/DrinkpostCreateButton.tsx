import DrinkpostCreateButton from "../../assets/DrinkpostCreateButton.svg";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const CreateButton = styled.div`
  display: flex;
  justify-content: end;
  position: fixed;
  bottom: 100px;
  left: 76vw;
`;

const DrinkpostButton = () => {
  const navigate = useNavigate();
  return (
    <CreateButton
      onClick={() => {
        navigate("/drinkpost/create");
      }}
    >
      <img src={DrinkpostCreateButton} alt="" />
    </CreateButton>
  );
};

export default DrinkpostButton;
