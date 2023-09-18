package com.ssafy.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatRoomId;

    @Lob
    @Column(nullable = false)
    private String chatRoomName;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    @JsonBackReference
    private List<ChatRoomUser> users;

    @OneToOne(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    @JsonIgnore
    private Meet meet;

    @Builder
    public ChatRoom(String chatRoomName, Meet meet) {
        this.chatRoomName = chatRoomName;
        this.meet = meet;
    }
}
