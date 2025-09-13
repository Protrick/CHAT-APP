import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/authContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState(authUser.fullname);
  const [bio, setBio] = useState(authUser.bio);
  const navigate = useNavigate();

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let base64Image = "";
    if (selectedImage) {
      try {
        base64Image = await convertToBase64(selectedImage);
      } catch (error) {
        toast.error("Image upload failed");
        return;
      }
    }
    const res = await updateProfile({
      fullname: name,
      bio: bio,
      profilepic: base64Image,
    });
    if (res.success) navigate('/');
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center px-4">
      <div className="w-full max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile Details</h3>
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input onChange={(e) => setSelectedImage(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden />
            <img src={selectedImage ? URL.createObjectURL(selectedImage) : authUser.profilepic || assets.avatar_icon} alt="" className="w-12 h-12 rounded-full" />
            Upload profile picture
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" required placeholder="Your Name" className="p-2 border border-gray-500 rounded-md" />
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} required placeholder="Your Bio" rows={4} className="p-2 border border-gray-500 rounded-md"></textarea>
          <button type="submit" className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer">Save</button>
        </form>
        <img className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10" src={authUser?.profilepic || assets.avatar_icon} alt="" />
      </div>
    </div>
  );
};

export default ProfilePage;
