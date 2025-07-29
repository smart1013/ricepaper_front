import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/message.css';
import messageScreenImage from '../assets/messageScreen.jpg';
import paperImage from '../assets/paper.png';

const Message = ({ selectedUser, targetUser }) => {
    const navigate = useNavigate();

    const [messageList, setMessageList] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showWriteModal, setShowWriteModal] = useState(false);
    const [messageContent, setMessageContent] = useState('');

    const fetchData = async () => {
        const userId = targetUser.id;
        const response = await fetch(`http://localhost:3000/messages/received/${userId}`);
        const data = await response.json();
        setMessageList(data);
        console.log(data);
    }

    useEffect(() => {
        fetchData();
        console.log(selectedUser);
        console.log(targetUser);
    }, []);

    const handleBack = () => {
        // Clear targetUser from localStorage when going back
        localStorage.removeItem('targetUser');
        setErrorMessage('');
        navigate('/home');
    };

    const handleMessageClick = (message) => {
        // Check if selectedUser is the same as targetUser OR if selectedUser is the sender
        if (selectedUser.id === targetUser.id || selectedUser.id === message.sender.id) {
            setSelectedMessage(message);
            setShowModal(true);
            setErrorMessage(''); 
        } else {
            setErrorMessage('열람할 수 없습니다');
            setShowModal(false); 
            setSelectedMessage(null);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMessage(null);
    };

    const handleWriteClick = () => {
        setShowWriteModal(true);
    };

    const handleCloseWriteModal = () => {
        setShowWriteModal(false);
        setMessageContent('');
    };

    const handleSubmitMessage = async () => {
        if (messageContent !== '') {
            console.log('Sending message:', messageContent);
            const response = await fetch('http://localhost:3000/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    senderId: selectedUser.id,
                    receiverId: targetUser.id,
                    content: messageContent
                }),
            });
            if (!response.ok) {
                console.error('Failed to send message');
                return;
            }
            const data = await response.json();
            console.log('Message sent:', data);
            setShowWriteModal(false);
            fetchData();
            setMessageContent('');
            setErrorMessage('');
        }
    };

    return (
        <div className="message-container">
            {/* Background Image */}
            <img 
                src={messageScreenImage}
                alt="background"
                className="message-background-image"
                
            />


            {/* Message Container */}
            <div className="message-list-container">
                <div className="message-grid">
                    {messageList.map((message) => (
                        <div key={message.id} className="message-item" onClick={() => handleMessageClick(message)}>
                            <img
                                src={paperImage}
                                alt="message paper"
                                className="message-paper"
                            />
                            <div className="message-label">from {message.sender.nickname}</div>
                        </div>
                    ))}
                </div>
            </div>


            {errorMessage && (
                <div style={{ color: 'red', fontSize: '12px', marginTop: '5px', textAlign: 'center', zIndex: '1000' }}>
                    {errorMessage}
                </div>
            )}

            {/* Button Container */}
            <div className="message-button-container">
                <button className="back-home-button" onClick={handleBack}>
                    뒤로가기
                </button>
                {selectedUser && targetUser && selectedUser.id !== targetUser.id && (
                    <button className="write-button" onClick={handleWriteClick}>
                        글쓰기
                    </button>
                )}
            </div>

            {/* Message Modal */}
            {showModal && selectedMessage && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>from {selectedMessage.sender.nickname}</h3>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ whiteSpace: 'pre-wrap' }}>{selectedMessage.content}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Write Message Modal */}
            {showWriteModal && (
                <div className="modal-overlay" onClick={handleCloseWriteModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>내용을 입력하세요</h3>
                            <button className="modal-close" onClick={handleCloseWriteModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <textarea
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                                placeholder="여기에 메시지를 작성하세요..."
                                className="paper-textarea"
                            />
                            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                <button 
                                    onClick={handleSubmitMessage}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#007AFF',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        fontSize: '13px',
                                        cursor: 'pointer'
                                    }}
                                    disabled={!messageContent.trim()}
                                >
                                    전송
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Message;