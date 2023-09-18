export interface User {
  userId: number;
  email: string;
  nickname: string;
  name: string;
  birth?: string;
  intro?: string;
  liverPoint: number;
  profile: string;
  follower: number;
  following: number;
  createdAt?: string;
  updatedAt?: string;
  oauthProvider?: string;
  drinkcount?: number;
}
export interface Message {
  chatMessageId: number;
  chatRoom: ChatRoom;
  user: User;
  message: string;
  createdAt: string;
}
export interface Chat {
  chatMessageId?: number;
  message?: string;
  user?: User;
  createdAt?: string;
  chatRoom?: ChatRoom;
  userId?: number;
  userNickname?: string;
  chatRoomName?: string;
}

export interface ChatRoom {
  chatRoomId?: number;
  chatRoomName?: string;
}
//모임 인터페이스
export interface Meeting {
  meetId: number;
  meetName: string;
  description: string;
  host?: User;
  hostId?: number;
  nowParticipants: number;
  maxParticipants: number;
  meetDate: string;
  tagId: number;
  sido: {
    sidoCode: number;
    sidoName: string;
  };
  gugun: {
    gugunCode: number;
    gugunName: string;
    sidoCode: number;
  };
  minAge?: number;
  maxAge?: number;
  minLiverPoint?: number;
  drink?: Drink;
  imgSrc: string;
  meetStatus?: string;
  chatRoomId?: number;
}

//미팅 상세 정보 type
export type MeetDetail = {
  meet: Meeting;
  users: User[];
  statuses: [];
};

export interface Drink {
  degree: number;
  description: string;
  drinkId: number;
  image: string;
  name: string;
  tagId: number;
}

export interface Review {
  content: string;
  drink: Drink;
  drinkReviewId: number;
  img: string;
  user: User;
  likeCount: number;
}
// 특정 유저의 팔로잉과 팔로워 목록을 보여줌
export interface Followers {
  followerId: number; // 그냥 pk임
  follower: User[];
  following: User[];
}

export interface SubReview {
  subReviewId: number;
  content: string;
  createdAt: string;
  drinkReview: Review;
  user: User;
}

export interface DrinkFestival {
  drinkFestivalId: number;
  image: string;
  name: string;
  redirectUri: string;
}

export interface AlarmLog {
  pushId: number;
  pushType: string;
  content: string;
  url: string;
  receiver: User;
  sender: User;
  createdAt: string;
  read: boolean;
}
