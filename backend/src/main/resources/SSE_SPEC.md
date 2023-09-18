// SSE SPEC

//sse로 구현하지면 현재 스펙인 HTTP/1.1에선 최대 6개의 접속만 허용한다.

```java
HTML에 eventSource 객체를 추가해주자
const eventSource = new EventSource("/push")
eventSource.onmessage = event => {
const p = document.createElement("p")
p.innerText = event.data
document.getElementById("messages").appendChild(p)
}
//https://tecoble.techcourse.co.kr/post/2022-10-11-server-sent-events/
```

SSE - Server sent Event
서버와 통신하는 방법은 많다.
전통적인HTTP 통신 방식(polling이라고 함)- stateless

- shortpolling : 클라이언트 주기적로 서버 요청하는 보내는 방법. 일정 간격으로 데이터 갱신되었는지 확인후 응답
- long polling : 서버에 변경이 일어날 떄 까지 대기
  =>이런 방식은 네트워크 리소스 낭비가 너무 심해서 새로운 방법이 등장하게 되었따

TCP를 활용한 방식 - Websocket
: 연결을 맺고 나면 일정 시간 동안 서버에서 변경이 발생할 때 마다 데이터를 전송받는 방법
- 클라이언트, 서버간으로 데이터를 수고 주고 받을 때 사용하기 좋다.

다만push알림은 서버에서 클라이언트에게 데이터가 변경되었을 때만 보내면 되므로
SSE를 채용했다.

이벤트 미디어 타입은 다음과 같다.
클라이언트 -> 서버 : 이벤트는 캐싱하지 않고 지속 연결(Stream)을 해야한다
GET - HTTP/1.1
Accept : text/event-stream
Cache-Control : no-cache

서버 -> 클라이언트 : SubScription에 대한 응답

```
Http/1.1 -> 200
Content-Type : text/event-stream;charset=UTF-8
Transfer-encoding : chunked <- 서버 동적으로 생성된 컨텐츠를 스틀밍 하기 때문에 본문의 크기를 알 수 없음
```

클라이언트에서 subscribe 하고나면 서버는 해당 클라이언트에게 비동기 적으로 데이터를 전송할 수 있음
UTF-8의 텍스트 데이터만 가능

서로 다른 이벤트는 줄바꿈 문자로 구분되며 각각의 이벤트는 한 개 이상의 name : value필드로 구성된다.
이번트는 서로 2개의 줄바꿈(/n/n)으로 구분

```json
{
  event : type1
  data : 이번트1의 데이터
}

{
  event : type2
  data : 이번트2의 데이터
}
```

### 동작과정

1. 클라이언트 A, B가 Server로 SSE 연결요청
2. Server내에 SSEController가 SseEmitter A,B 생성

3. 클라이언트 B가 Server로 데이터 변경 요청
4. Server데이터 변경요청 수행
5. SseEmitter가 데이터 변경(Send)
6. 각각 클라이언트에게 데이터 변경 알림 수신

*/