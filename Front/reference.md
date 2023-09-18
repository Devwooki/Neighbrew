// InputEvent
React.ChangeEvent<HTMLInputElement>

// ButtonEvent
React.MouseEvent<HTMLButtonElement>

// KeyUpEvent
React.KeyboardEvent<HTMLInputElement>

- KeyDownEvent는 한국어로 칠 때 입력 지연이 있어서 두번 쳐지는 버그가 있으니 KeyUp으로 쓰도록 하자
- 핸드폰에서 Enter이벤트는 e.keyCode === 13 로 사용하기

// 무한스크롤 로직

```
  // 무한 스크롤 로직
  const onIntersect: IntersectionObserverCallback = ([{ isIntersecting }]) => {
    console.log(`감지결과 : ${isIntersecting}`);
    // isIntersecting이 true면 감지했다는 뜻임
    if (isIntersecting) {
      setPage(prev => prev + 1);
    }
  };
  const { setTarget } = useIntersectionObserver({ onIntersect });
  // 위의 두 변수로 검사할 요소를 observer로 설정
  const [dumy, setDumy] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  // 여기에는 axios 요청 들어갈 예정
  useEffect(() => {
    for (let i = 0; i < 20; i++) {
      setDumy(prev => [...prev, `dumy${i}`]);
    }
  }, [page]);
```
