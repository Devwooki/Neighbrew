import axios from "axios";

const api = axios.create({
  baseURL: "/",
});
// 요청 인터셉터: 토큰을 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("myId");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (userId) {
      config.headers["UserID"] = `${userId}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료 시 재요청 or 로그인 페이지로 리디렉션
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (err) => {
    const originalRequest = err.config;
    if (err.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // 리프레시 토큰이 없으면 로그인 페이지로 리디렉션
        if (window.location.pathname !== "/") window.location.href = "/";
        return Promise.reject(err);
      }

      try {
        // 토큰 재발급 API 호출
        const { data } = await axios.post("/api/user/refresh-token", {
          refreshToken,
        });
        localStorage.setItem("token", data.accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // 리프레시 토큰이 만료되었거나 재발급 요청에 문제가 있으면 로그인 페이지로 리디렉션
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("myId");
        window.location.href = "/";
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export const callApi = async (method: string, url: string, body: any = {}) => {
  return api({
    method: method,
    url: url,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      UserID: `${localStorage.getItem("myId")}`,
    },
    data: body,
  });
};

// 알림 관련 함수
export const noti = (message: string, type: string, url: string) => {
  navigator.serviceWorker.ready.then((registration) => {
    const notiAlarm = registration.showNotification("알림", {
      body: "pinyin + '\n' + means",
      actions: [
        {
          title: "화면보기",
          action: "goTab",
        },
        {
          title: "닫기",
          action: "close",
        },
      ],
    });
  });
};
