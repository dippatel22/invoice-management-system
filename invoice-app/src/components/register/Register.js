import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, storage, db } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import './register.css'; // Updated import for the CSS file

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [file, setFile] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [imageURL, setImageURL] = useState(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const onSelectFile = (e) => {
        setFile(e.target.files[0]);
        setImageURL(URL.createObjectURL(e.target.files[0]));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const newUser = await createUserWithEmailAndPassword(auth, email, password);
            console.log(newUser);

            if (file) {
                const date = new Date().getTime();
                const storageRef = ref(storage, `${displayName + date}`);

                // Upload the file to Firebase Storage
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);

                await updateProfile(newUser.user, {
                    displayName: displayName,
                    photoURL: downloadURL,
                });

                await setDoc(doc(db, 'users', newUser.user.uid), {
                    uid: newUser.user.uid,
                    displayName: displayName,
                    email: email,
                    photoURL: downloadURL,
                });

                console.log('File uploaded and accessible at:', downloadURL);

                localStorage.setItem('cName', displayName);
                localStorage.setItem('photoUrl', downloadURL);
                localStorage.setItem('email', newUser.user.email);
                localStorage.setItem('uid', newUser.user.uid);
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-container">
                <div className="register-box register-left"></div>
                <div className="register-box register-right">
                    <form onSubmit={submitHandler}>
                        <h2 className="register-heading">Create Your Account</h2>
                        <input onChange={(e) => setEmail(e.target.value)} className="register-input" type="email" placeholder="Enter Email" required />
                        <input onChange={(e) => setDisplayName(e.target.value)} className="register-input" type="text" placeholder="Company Name" required />
                        <input onChange={(e) => setPassword(e.target.value)} className="register-input" type="password" placeholder="Enter Password" required />
                        <input onChange={onSelectFile} style={{ display: 'none' }} className="register-input" type="file" ref={fileInputRef} />
                        <input className="register-input" type="button" value="Select Your Logo" onClick={() => fileInputRef.current.click()} />
                        {imageURL && <img className="image-preview" src={imageURL} alt="preview" />}
                        <input className="register-input register-btn" type="submit" value="Create Account" />
                    </form>
                    <Link to="/login" className="register-link">Login With Your Account</Link>
                </div>
            </div>
        </div>
    );
};
