import { Drink } from "../../Type/types";
import { styled } from "styled-components";
import { useState } from "react";

const Card = styled.div`
  width: 120px;
  height: 140px;
`;

const mdsItem = ({ pick }: { pick: Drink }) => {
  const [limit, setLimit] = useState(5);
  const name = pick.name;
  const img = pick.image;
  const nameEllipsis = (str, limit) => {
    return {
      string: str.slice(0, limit),
    };
  };
  return (
    <>
      <div style={{ paddingTop: "10px" }}>
        <Card
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        ></Card>
        <div style={{ color: "white", textAlign: "center" }}>
          {name.length < limit
            ? nameEllipsis(name, limit).string
            : nameEllipsis(name, limit).string + "..."}
        </div>
      </div>
    </>
  );
};
export default mdsItem;
