import { useState, useEffect } from "react";

//값 입력 후 delay동안 변경이 없을 때만 debouncedValue를 업데이트하고, return함
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    //delay 이후에 debouncedValue를 얻음
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer); //이전의 타이머를 clear
    };
  }, [value]);

  return debouncedValue;
};

export default useDebounce;
