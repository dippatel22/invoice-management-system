import React, { useRef, useState } from 'react';
import { storage, auth, db } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export const Setting = () => {
  const [cName, setCName] = useState(localStorage.getItem('cName'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(localStorage.getItem('displayName'));
  const [file, setFile] = useState(null);
  const [imageURL, setImageURL] = useState(localStorage.getItem('photoUrl'));
  const fileInputRef = useRef(null);

  const onSelectFile = (e) => {
    setFile(e.target.files[0]);
    setImageURL(URL.createObjectURL(e.target.files[0]));
  };

  const updateCompanyName = async () => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: cName
      });
      localStorage.setItem('cName', cName);
      alert('Company name updated successfully');
      updateDoc(doc(db, 'users', localStorage.getItem('uid')), {
        displayName: displayName
      }).then(res => {
        window.location.reload()
      })

    } catch (error) {
      console.error('Error updating company name:', error);
      alert('Error updating company name');
    }
  };

  const updateLogo = () => {
    if (file) {
      const storageRef = ref(storage, `profile_pics/${auth.currentUser.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // You can handle progress here if needed
        },
        (error) => {
          console.error('Error uploading file:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          try {
            await updateProfile(auth.currentUser, {
              photoURL: downloadURL,
            });
            localStorage.setItem('photoUrl', downloadURL);
            setImageURL(downloadURL);
            alert('Profile picture updated successfully');
            window.location.reload()
          } catch (error) {
            console.error('Error updating profile picture:', error);
            alert('Error updating profile picture');
          }
        }
      );
    }
  };

  return (
    <div className='setting-wrapper'>
      <div className='profile-info update-cName'>
        <img
          onClick={() => fileInputRef.current.click()}
          alt='profile-pic'
          src={imageURL || 'default-profile-pic-url'} // You can set a default profile pic URL here
        />
        <input
          onChange={onSelectFile}
          style={{ display: 'none' }}
          type='file'
          ref={fileInputRef}
        />
        {file && <button onClick={updateLogo}>Update Profile Pic</button>}
      </div>
      <div className='update-cName'>
        <input
          onChange={e => setCName(e.target.value)}
          type='text'
          value={cName}
          placeholder='Company Name'
        />
        <button onClick={updateCompanyName}>Update Company Name</button>
      </div>
    </div>
  );
};
