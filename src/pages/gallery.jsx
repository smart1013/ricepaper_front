import React, { useState, useEffect } from "react";
import '../styles/gallery.css';
import { useNavigate } from 'react-router-dom';
import galleryScreenImage from '../assets/galleryScreen.jpg';

const Gallery = ({ selectedUser, targetUser }) => {
    const navigate = useNavigate();
    const [galleryList, setGalleryList] = useState([]);
    const [showUploadPopup, setShowUploadPopup] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        content: '',
        image: null,
        imagePreview: null
    });
    const [postContent, setPostContent] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const fetchGalleryData = async () => {
            try {
            const response = await fetch('http://localhost:3000/posts'); // 너 백엔드 주소
            if (!response.ok) throw new Error('Failed to fetch gallery');
            const data = await response.json();
            setGalleryList(data);
            } catch (error) {
            console.error('갤러리 불러오기 실패:', error);
            }
    };

    useEffect(() => {
        fetchGalleryData();
    }, []);

    const handleBack = () => {
        navigate('/home');
    };

    const handlePhotoClick = (photo) => {
        console.log('Photo clicked:', photo);
        // TODO: Implement photo detail view
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
                onLoad={(e) => {
                    const img = e.target;
                    const container = img.parentElement;
                    const aspectRatio = img.naturalWidth / img.naturalHeight;

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
                    뒤로가기
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
        </div>
    );
}

export default Gallery;