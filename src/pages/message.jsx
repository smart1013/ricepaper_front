import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/message.css';
import messageScreenImage from '../assets/messageScreen.jpg';
import paperImage from '../assets/paper.png';

const Message = ({ selectedUser, targetUser }) => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { id: 1, from: "김병주", content: "안녕하세요! 오늘 날씨가 정말 좋네요." },
        { id: 2, from: "한유진", content: "오늘도 힘내세요! 새로운 시작을 응원합니다." },
        { id: 3, from: "구자윤", content: "바다의 파도 소리를 들으며 생각에 잠겼어요." },
        { id: 4, from: "박보연", content: "당신의 메시지가 저를 웃게 만들어요." },
        { id: 5, from: "정태희", content: "오늘 하루도 잘 보내세요!" },
        { id: 6, from: "이건", content: "새로운 도전을 응원합니다." },
    ]);

    useEffect(() => {
        console.log(selectedUser);
        console.log(targetUser);
    }, []);

    const handleBack = () => {
        navigate('/home');
    };

    return (
        <div className="message-container">
            {/* Background Image */}
            <img 
                src={messageScreenImage}
                alt="background"
                className="message-background-image"
                onLoad={(e) => {
                    const img = e.target;
                    const container = img.parentElement;
                    const aspectRatio = img.naturalWidth / img.naturalHeight;
                    
                    // Mobile screen dimensions (iPhone 12/13/14 size)
                    const mobileWidth = 390;
                    const mobileHeight = 844;
                    
                    let width, height;
                    if (mobileWidth / aspectRatio <= mobileHeight) {
                        width = mobileWidth;
                        height = mobileWidth / aspectRatio;
                    } else {
                        height = mobileHeight;
                        width = mobileHeight * aspectRatio;
                    }
                    
                    container.style.width = width + 'px';
                    container.style.height = height + 'px';
                }}
            />


            {/* Message Container */}
            <div className="message-list-container">
                <div className="message-grid">
                    {messages.map((message) => (
                        <div key={message.id} className="message-item">
                            <img
                                src={paperImage}
                                alt="message paper"
                                className="message-paper"
                            />
                            <div className="message-label">from {message.from}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Button Container */}
            <div className="message-button-container">
                <button className="back-home-button" onClick={handleBack}>
                    뒤로가기
                </button>
                <button className="write-button" onClick={() => console.log('글쓰기 clicked')}>
                    글쓰기
                </button>
            </div>
        </div>
    );
};

export default Message;