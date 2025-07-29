import React, { useState, useEffect } from "react";
import '../styles/gallery.css';
import { useNavigate } from 'react-router-dom';
import galleryScreenImage from '../assets/galleryScreen.jpg';

const Gallery = ({ selectedUser, targetUser }) => {
    const navigate = useNavigate();
    const [galleryList, setGalleryList] = useState([]);
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [uploadForm, setUploadForm] = useState({
        content: '',
        image: null,
        imagePreview: null
    });
    const [postContent, setPostContent] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [users, setUsers] = useState({});

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const usersData = await response.json();
            const usersMap = usersData.reduce((acc, user) => {
                acc[user.id] = user.nickname;
                return acc;
            }, {});
            setUsers(usersMap);
        } catch (error) {
            console.error('사용자 정보 불러오기 실패:', error);
        }
    };

    const fetchGalleryData = async () => {
            try {
            const response = await fetch('http://localhost:3000/posts?_expand=user'); // 너 백엔드 주소
            if (!response.ok) throw new Error('Failed to fetch gallery');
            const data = await response.json();
            setGalleryList(data);
            } catch (error) {
            console.error('갤러리 불러오기 실패:', error);
            }
    };

    useEffect(() => {
        fetchGalleryData();
        fetchUsers();
    }, []);

    const handleBack = () => {
        navigate('/home');
    };

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState('');

    const fetchComments = async (postId) => {
        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}/comments`);
            if (!response.ok) throw new Error('Failed to fetch comments');
            const data = await response.json();
            console.log('댓글 응답 데이터:', data); // 👉 이거!
            setComments(data);
        } catch (error) {
            console.error('댓글 불러오기 실패:', error);
            setComments([]); // Clear comments on error
        }
    };

    const handlePhotoClick = (photo) => {
        setSelectedPhoto(photo);
        if (photo) {
            fetchComments(photo.id);
            setEditedContent(photo.content); // Set initial content for editing
        }
    };

    const handlePostEdit = async () => {
        if (!selectedPhoto || editedContent.trim() === selectedPhoto.content.trim()) {
            setIsEditing(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/posts/${selectedPhoto.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: editedContent }),
            });

            if (!response.ok) throw new Error('Failed to edit post');

            // Optimistically update the UI
            setSelectedPhoto(prev => ({ ...prev, content: editedContent }));
            setGalleryList(prevList => prevList.map(post =>
                post.id === selectedPhoto.id ? { ...post, content: editedContent } : post
            ));

            setIsEditing(false);
            setShowActionMenu(false);
        } catch (error) {
            console.error('게시글 수정 실패:', error);
            alert('게시글 수정에 실패했습니다.');
        }
    };

    const handlePostDelete = async (postId) => {
        setShowActionMenu(false);
        if (!window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete post');

            handleClosePhotoDetail();
            fetchGalleryData(); // Refresh gallery list
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            alert('게시글 삭제에 실패했습니다.');
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete comment');

            fetchComments(selectedPhoto.id); // Refresh comments
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            alert('댓글 삭제에 실패했습니다.');
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim() || !selectedPhoto) return;

        try {
            const response = await fetch(`http://localhost:3000/posts/${selectedPhoto.id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    commenterId: 1, // As per user's instruction
                    content: newComment,
                }),
            });

            if (!response.ok) throw new Error('Failed to post comment');

            setNewComment('');
            fetchComments(selectedPhoto.id); // Refresh comments
        } catch (error) {
            console.error('댓글 등록 실패:', error);
            alert('댓글 등록에 실패했습니다.');
        }
    };

    const handleClosePhotoDetail = () => {
        setSelectedPhoto(null);
        setComments([]);
        setNewComment('');
        setShowActionMenu(false);
        setIsEditing(false);
    };

    const handleUploadClick = () => {
        setShowUploadPopup(true);
    };

    const handleClosePopup = () => {
        setShowUploadPopup(false);
        setUploadForm({
            content: '',
            image: null,
            imagePreview: null
        });
        setPostContent('');
        setImgUrl('');
    };


    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setUploadForm(prev => ({
                        ...prev,
                        image: file,
                        imagePreview: e.target.result
                    }));
                };
                reader.readAsDataURL(file);
            } else {
                alert('Please select an image file.');
            }
        }
    };

    const handleSubmitUpload = async () => {
        if (!postContent.trim()) {
            alert('Please enter content.');
            return;
        }
        if (!uploadForm.image) {
            alert('Please select an image.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', uploadForm.image);

            const response = await fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
            });

            if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Upload successful:', result);

            // ✅ 여기서 바로 post 생성!
            await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: 1, // 임시로 userId 1로 설정
                content: postContent,
                imageUrl: result.url,
            }),
            });

            await fetchGalleryData();
            handleClosePopup();
        } catch (error) {
            console.error('Upload error:', error);
            alert('업로드에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className="gallery-container">
            <img 
                src={galleryScreenImage} 
                alt="gallery" 
                className="gallery-background-image"
            />

            {/* Photo Container */}
            <div className="photo-container">
                <div className="photo-grid">
                    {galleryList.map((photo) => (
                        <div key={photo.id} className="photo-item" onClick={() => handlePhotoClick(photo)}>
                            <img src={photo.imageUrl} alt="gallery photo" className="photo-img" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Button Container */}
            <div className="gallery-button-container">
                <button className="back-home-button" onClick={handleBack}>
                    롤링페이퍼
                </button>
                <button className="upload-button" onClick={handleUploadClick}>
                    업로드
                </button>
            </div>

            {/* Upload Popup */}
            {showUploadPopup && (
                <div className="upload-popup-overlay">
                    <div className="upload-popup">
                        <div className="modal-header">
                            <h3>사진 업로드</h3>
                            <button className="modal-close" onClick={handleClosePopup}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="content">내용</label>
                                <textarea
                                    id="content"
                                    value={postContent}
                                    onChange={(e) => setPostContent(e.target.value)}
                                    placeholder="사진에 대한 내용을 입력하세요..."
                                    rows="3"
                                    style={{
                                        width: '100%',
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        resize: 'vertical',
                                        minHeight: '60px'
                                    }}
                                />
                            </div>
                            
                            <div className="form-group" style={{ marginTop: '15px' }}>
                                <label htmlFor="image-upload" style={{ fontSize: '12px', marginBottom: '5px' }}>이미지 선택</label>
                                <div style={{
                                    border: '2px dashed #ddd',
                                    borderRadius: '4px',
                                    padding: '10px',
                                    textAlign: 'center'
                                }}>
                                    {uploadForm.imagePreview ? (
                                        <div style={{ position: 'relative', display: 'inline-block' }}>
                                            <img 
                                                src={uploadForm.imagePreview} 
                                                alt="preview" 
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100px',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                            <button 
                                                onClick={() => setUploadForm(prev => ({ ...prev, image: null, imagePreview: null }))}
                                                style={{
                                                    position: 'absolute',
                                                    top: '-5px',
                                                    right: '-5px',
                                                    background: '#ff4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '20px',
                                                    height: '20px',
                                                    fontSize: '10px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <input
                                                id="image-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageSelect}
                                                style={{ display: 'none' }}
                                            />
                                            <button 
                                                onClick={() => document.getElementById('image-upload').click()}
                                                style={{
                                                    background: '#007AFF',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '8px 16px',
                                                    borderRadius: '4px',
                                                    fontSize: '12px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                이미지 선택
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                <button 
                                    onClick={handleSubmitUpload}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#007AFF',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '5px',
                                        fontSize: '13px',
                                        cursor: 'pointer'
                                    }}
                                    disabled={!postContent.trim() || !uploadForm.image}
                                >
                                    업로드
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Photo Detail Popup */}
            {selectedPhoto && (
                <div className="photo-detail-overlay" onClick={handleClosePhotoDetail}>
                    <div className="photo-detail-popup" onClick={(e) => { e.stopPropagation(); setShowActionMenu(false); }}>
                        <div className="photo-detail-header">
                            <span className="photo-detail-author">
                                작성자: {selectedPhoto.user?.nickname || '익명'}
                            </span>
                            <div className="popup-header-actions">
                                <button className="more-options-button" onClick={(e) => { e.stopPropagation(); setShowActionMenu(prev => !prev); }}>⋮</button>
                                {showActionMenu && (
                                    <div className="action-menu">
                                        <button onClick={() => { setIsEditing(true); setShowActionMenu(false); }}>수정</button>
                                        <button onClick={() => handlePostDelete(selectedPhoto.id)}>삭제</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <img src={selectedPhoto.imageUrl} alt="detail" className="photo-detail-img" />
                        
                        <div className="photo-detail-content">
                            {isEditing ? (
                                <div className="edit-mode">
                                    <textarea
                                        className="edit-textarea"
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                    />
                                    <div className="edit-actions">
                                        <button onClick={() => setIsEditing(false)}>취소</button>
                                        <button onClick={handlePostEdit}>저장</button>
                                    </div>
                                </div>
                            ) : (
                                <p>{selectedPhoto.content}</p>
                            )}
                        </div>

                        {!isEditing && (
                            <div className="comments-section">
                                <div className="comments-list">
                                    {comments.map(comment => (
                                        <div key={comment.id} className="comment-item">
                                            <span>
                                               <strong>{comment.commenter?.nickname || '익명'}:</strong> {comment.content}
                                            </span>
                                            <button className="delete-comment-button" onClick={() => handleCommentDelete(comment.id)}>×</button>
                                        </div>
                                    ))}
                                </div>
                                <div className="comment-input-container">
                                    <input
                                        type="text"
                                        className="comment-input"
                                        placeholder="댓글 달기..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
                                    />
                                    <button className="comment-submit-button" onClick={handleCommentSubmit}>게시</button>
                                </div>
                            </div>
                        )}
                        <button className="modal-close" onClick={handleClosePhotoDetail}>×</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Gallery;
