package com.ssafy.backend.Enum;

public enum DmVisible {
    //둘 다 볼 수 있다.
    BOTH,
    //작성자만 볼 수 있다.
    ONLY_SENDER,
    //받는 사람만 읽을 수 있다.
    ONLY_RECEIVER,
    //둘 다 못 읽는다. 모두 나간 경우
    NOBODY
}
