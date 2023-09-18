import { callApi } from "./utils/api";
import SockJS from "sockjs-client";
import { CompatClient, Stomp, Client } from "@stomp/stompjs";
import { useState, useRef } from "react";
const Test = () => {
  const followHandler = async () => {
    const api = await callApi("get", `api/push/follow/18`)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  };
  const [message, setMessages] = useState("");
  const inputHandler = e => {
    e.preventDefault();
    setMessages(e.target.value);
  };
  return (
    <div>
      <h1>Test</h1>
      <input type="text" onChange={inputHandler} />
      <button onClick={followHandler}>TESt</button>
    </div>
  );
};
export default Test;
