/*
[SearchBox.tsx]
검색창 컴포넌트, 서치 버튼 포함
추후 검색 버튼 클릭시 적용될 함수를 props에서 받도록 수정 예정
자세한 props는 type InputProps 참고
*/
import styled from "styled-components";
import React, { useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";
import { searchNavIcon } from "../../assets/AllIcon";

const SearchDiv = styled.div<{ width: number }>`
  display: flex;
  justify-content: space-around;
  background: var(--c-lightgray);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  width: ${props => props.width}%;
  max-width: 100%;
`;

const SearchDivInput = styled.input.attrs({ type: "text" })`
  background: var(--c-lightgray);
  color: var(--c-black);
  font-family: "NanumSquareNeo";
  width: 80%;
  border: none;
  text-align: left;
  outline: none;
`;

const SearchBtn = styled.button`
  background-size: 100%;
  width: 1.5rem;
  height: 1.5rem;
  border: none;
`;

type InputProps = {
  placeholder: string; //아무것도 입력하지 않았을 때 표시될 문구
  value?: string; //입력창에 입력된 값
  changeFunc?(input: string): void; //변경될때 시행할 함수
  width?: number; //너비, 기본은 100%
};

/**
 * 검색창 컴포넌트, 서치 버튼 포함.
 * @property {string} placeholder 아무것도 입력하지 않았을 때 표시될 문구
 * @todo 추후 검색 버튼 클릭시 적용될 함수를 props에서 받도록 수정 예정
 */
const searchBox = (props: InputProps) => {
  const searchButton = searchNavIcon();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 200);
  useEffect(() => {
    props.changeFunc(debouncedSearchValue);
  }, [debouncedSearchValue]);

  return (
    <SearchDiv width={props.width ?? 100}>
      <SearchDivInput
        type="text"
        placeholder={props.placeholder}
        value={props.value}
        onChange={e => setSearchValue(e.target.value)}
      />
      <SearchBtn>{searchButton}</SearchBtn>
    </SearchDiv>
  );
};

export default React.memo(searchBox);
