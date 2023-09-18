/*
[MeetingFind.tsx]
모임 찾기 페이지
주종별 검색, 필터 검색, 검색결과 리스트 출력
*/
import styled from "styled-components";
import { useState, useRef, useEffect } from "react";
import filterIcon from "../../assets/meetingFilter.svg";
import SearchBox from "../components/SearchBox";
import DrinkCategory from "../drinkCategory/DrinkCategory";
import MeetingListItem from "./MeetingListItem";
import autoAnimate from "@formkit/auto-animate";
import { callApi } from "../../utils/api";
import { Meeting } from "../../Type/types";
import { initialSido, initialGugun } from "../common";
import { localDate } from "./DateTimeCommon";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const meetingFind = () => {
  //받아온 모임 정보 리스트(전체)
  const [meetAllData, setMeetAllData] = useState<Meeting[]>([]);
  //필터링 한 후 모임 정보
  const [meetData, setMeetData] = useState<Meeting[]>([]);

  const [page, setPage] = useState(0); //페이징용, 0에서 시작
  const [totalPage, setTotalPage] = useState(1); //페이징용, 예정된 전체 페이지 수
  const [throttle, setThrottle] = useState(false);

  //주종 카테고리 선택
  const [selectedCategory, setSelectedCategory] = useState(0);
  const getDrinkCategory = (tagId: number) => {
    setSelectedCategory(tagId);
  };

  //필터 지역 검색용
  const [sidoList, setSidoList] = useState([initialSido]);
  const [gugunList, setGugunList] = useState([initialGugun]);
  const [sido, setSido] = useState(initialSido);
  const [gugun, setGugun] = useState(initialGugun);

  //무한 스크롤 로직
  const onIntersect: IntersectionObserverCallback = ([{ isIntersecting }]) => {
    // isIntersecting이 true면 감지했다는 뜻임
    if (isIntersecting && !throttle) {
      setThrottle(true);
      setTimeout(() => {
        setPage(prev => prev + 1);
        setThrottle(false);
      }, 300);
    }
  };

  const { setTarget } = useIntersectionObserver({ onIntersect });

  //초기 로딩
  useEffect(() => {
    //페이지 들어오면 위로 스크롤 올리기
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    //시도 정보 미리 받아와 세팅하기
    callApi("get", "api/sido").then(res => {
      setSidoList([initialSido, ...res.data]);
    });
  }, []);

  //페이지가 변하면 기존 데이터에 이어서 로드
  useEffect(() => {
    const promise = callApi("get", `api/meet?&tagId=${selectedCategory}&page=${page}&size=10`);
    if (page === 0) {
      promise.then(res => {
        setTotalPage(res.data.totalPages);
        setMeetAllData(res.data.content); //받아온 데이터 meetAllData에 추가
      });
    } else {
      promise.then(res => {
        setTotalPage(res.data.totalPages);
        setMeetAllData(prev => [...prev, ...res.data.content]); //받아온 데이터 meetAllData에 추가
      });
    }
  }, [page]);

  //카테고리 변경 시 새로 데이터 로드
  useEffect(() => {
    if (page === 0) {
      const promise = callApi("get", `api/meet?&tagId=${selectedCategory}&page=${page}&size=10`);
      promise.then(res => {
        setTotalPage(res.data.totalPages);
        setMeetAllData(res.data.content); //받아온 데이터로 meetAllData 초기화
      });
    } else {
      setPage(0);
      setTotalPage(1);
    }
  }, [selectedCategory]);

  useEffect(() => {
    //선택한 시도에 따라 구군 fetch
    callApi("get", `api/gugun/${sido.sidoCode}`).then(res => {
      setGugunList([initialGugun, ...res.data]);
    });
  }, [sido]);

  //필터 애니메이션 관련
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const parent = useRef(null);
  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  //필터에 날짜 검색용
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [inputText, setInputText] = useState(""); //필터에 텍스트 검색용(모임이름,술이름)

  //필터용 함수
  //카테고리로 필터링
  const categoryFiltering = (data: Meeting) => {
    if (selectedCategory === 0) {
      return true;
    }
    return data.tagId === selectedCategory;
  };
  //시도 정보로 필터링
  const sidoFiltering = (data: Meeting) => {
    if (sido.sidoCode === 0) return true;
    return data.sido.sidoCode === sido.sidoCode;
  };
  //구군 정보로 필터링
  const gugunFiltering = (data: Meeting) => {
    if (gugun.gugunCode === 0) return true;
    return data.gugun.gugunCode === gugun.gugunCode && data.gugun.sidoCode === gugun.sidoCode;
  };
  //날짜 정보로 필터링
  const dateFiltering = (data: Meeting) => {
    if (startDate === "" && endDate === "") return true;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(`${endDate}T23:59:59`);
    const targetDateObj = new Date(data.meetDate);
    if (startDate !== "" && endDate !== "")
      return targetDateObj >= startDateObj && targetDateObj <= endDateObj;
    else return targetDateObj >= startDateObj || targetDateObj <= endDateObj;
  };
  //모임 이름으로 필터링
  const titleFiltering = (data: Meeting) => {
    if (inputText === "") return true;
    return data.meetName.includes(inputText);
  };
  //술의 이름으로 필터링
  const drinkNameFiltering = (data: Meeting) => {
    if (inputText === "") return true;
    return data.drink.name.includes(inputText);
  };

  const Filtering = () => {
    //전체 목록 중에 필터링 적용
    const filterData = meetAllData.reduce((acc, cur) => {
      //교집합만 push
      if (
        categoryFiltering(cur) &&
        sidoFiltering(cur) &&
        gugunFiltering(cur) &&
        dateFiltering(cur) &&
        (titleFiltering(cur) || drinkNameFiltering(cur))
      ) {
        acc.push(cur);
      }
      return acc;
    }, []);
    //필터링 후 모임들을 meetData에
    setMeetData(filterData);
  };

  useEffect(() => {
    setMeetData(meetAllData.map(item => item)); //필터 적용을 위해 복사한 리스트 만들어두기
    Filtering();
  }, [meetAllData]);

  //전체 필터
  useEffect(() => {
    Filtering();
  }, [selectedCategory, sido, gugun, startDate, endDate, inputText]);

  return (
    <div>
      <CateDiv>
        <DrinkCategory getFunc={getDrinkCategory} />
      </CateDiv>
      <SearchResultDiv>
        <SearchResultHeader>
          지금 진행 중인 모임
          <FilterBtn onClick={() => setIsFilterOpen(!isFilterOpen)} />
        </SearchResultHeader>
        <div ref={parent}>
          {isFilterOpen && (
            <FilterDiv>
              <FilterBg>
                위치
                <FilterElement>
                  <div>
                    <DropdownInput
                      onChange={e => {
                        const selectedValue = e.target.value;
                        const selectedSido = sidoList.find(item => item.sidoName === selectedValue);
                        setSido(selectedSido);
                      }}
                      value={sido.sidoName}
                    >
                      {sidoList.map(siItem => {
                        return (
                          <option value={siItem.sidoName} key={siItem.sidoCode}>
                            {siItem.sidoName}
                          </option>
                        );
                      })}
                    </DropdownInput>
                    시/도
                  </div>
                  <div>
                    <DropdownInput
                      onChange={e => {
                        const selectedValue = e.target.value;
                        const selectedGugun = gugunList.find(
                          item => item.gugunName === selectedValue
                        );
                        setGugun(selectedGugun);
                      }}
                      value={gugun.gugunName}
                    >
                      {gugunList.map(guItem => {
                        return (
                          <option value={guItem.gugunName} key={guItem.gugunCode}>
                            {guItem.gugunName}
                          </option>
                        );
                      })}
                    </DropdownInput>
                    구/군
                  </div>
                </FilterElement>
                날짜
                <FilterElement>
                  <DateInput
                    type="date"
                    min={localDate().toString()}
                    onChange={e => {
                      setStartDate(e.target.value);
                    }}
                  />
                  ~
                  <DateInput
                    type="date"
                    onChange={e => {
                      setEndDate(e.target.value);
                    }}
                  />
                </FilterElement>
                <div style={{ gridColumn: "span 2" }}>
                  <div style={{ width: "100%", margin: "0 auto" }}>
                    <SearchBox
                      placeholder="정확한 술의 이름 또는 모임의 이름"
                      // value={inputText}
                      changeFunc={(inputTxt: string) => {
                        setInputText(inputTxt);
                      }}
                      width={90}
                    />
                  </div>
                </div>
              </FilterBg>
            </FilterDiv>
          )}
        </div>
        {meetData.length > 0 && <MeetingListItem data={meetData} />}
        {/* 검색 결과가 없고 더이상 로드할 수 없다면(page가 넘었음) 빈공간 */}
        {meetData.length === 0 && page >= totalPage && <div style={{ minHeight: "100vh" }}></div>}
        {!throttle && page < totalPage && (
          <div
            className="target"
            ref={setTarget}
            style={{
              height: "1px",
            }}
          ></div>
        )}
      </SearchResultDiv>
    </div>
  );
};
export default meetingFind;

const CateDiv = styled.div`
  height: 10rem;
  margin-top: 1rem;
  background: white;
  border-bottom: 1px solid var(--c-borderline);
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

const SearchResultDiv = styled.div`
  //background: var(--c-lightgray);
  background: white;
  padding: 1rem 0 0 0;
`;

const SearchResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  margin: 0 auto;
  font-family: "JejuGothic";
  font-size: 20px;
`;

const FilterBtn = styled.button`
  background: url(${filterIcon});
  background-size: 100%;
  width: 2rem;
  height: 2rem;
  border: none;
`;

const FilterDiv = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 1rem;
  border-bottom: 1px solid var(--c-borderline);
`;

const FilterBg = styled.div`
  display: grid;
  grid-template-columns: 1fr 6fr;
  grid-template-rows: 1fr 1fr 1fr;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid var(--c-borderline);
  border-radius: 15px;
  width: 100%;
  margin: 1rem auto;
  padding: 1rem;
  font-family: "JejuGothic";
  font-size: 14px;
`;

const FilterElement = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: "SeoulNamsan";
  margin: 0.5rem 0;
`;

const DropdownInput = styled.select`
  width: 5rem;
  background: white;
  text-align: right;
  padding: 3% 5%;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  font-family: "SeoulNamsan";
  outline: none;
  -webkit-appearance: none; /* 화살표 없애기 for chrome*/
  -moz-appearance: none; /* 화살표 없애기 for firefox*/
  appearance: none; /* 화살표 없애기 공통*/
`;

const DateInput = styled.input.attrs({ type: "date" })`
  color: var(--c-black);
  width: 40%;
  font-family: "SeoulNamsan";
  text-align: right;
  border: none;
  border-bottom: 1px solid var(--c-gray);
  background: white;
  outline: none;
`;
