import React, { useState } from 'react';

function AvatarUploader() {
  const token = localStorage.getItem('access-token')
    const [avatar, setAvatar] = useState(null);

    const handleAvatarChange = (event) => {
        setAvatar(event.target.files[0]);
    };

    const handleAvatarUpload = async () => {
      try {
        const formData = new FormData();
        formData.append('avatar', avatar);
        console.log(formData);
    
        const response = await fetch('http://localhost:8000/uploadAvatar ', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData,
        });
    
        if (response.ok) {
          const imageUrl = await response.text(); // parse the file URL from the response
          console.log(imageUrl); // log the file URL
        } else {
          throw new Error('Failed to upload avatar');
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    return (
        <div>
            <input type="file" onChange={handleAvatarChange} />
            <button onClick={handleAvatarUpload}>Upload Avatar</button>
        </div>
    );
}
export default AvatarUploader;
