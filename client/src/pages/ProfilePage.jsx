import React, { useContext , useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets  from '../assets/assets';
import { AuthContext } from '../../context/authContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedimage, setSelectedimage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = React.useState(authUser.fullname);
  const [bio, setBio] = React.useState(authUser.bio);

  // ✅ Helper function to convert file to base64
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

    if (selectedimage) {
      try {
        base64Image = await convertToBase64(selectedimage);
      } catch (error) {
        console.error("Image conversion failed:", error);
        toast.error("Image upload failed");
        return;
      }
    }

    const res = await updateProfile({
      fullname: name,
      bio: bio,
      profilepic: base64Image,   // ✅ base64 string or empty
    });

    if (res.success) {
      navigate('/');   // ✅ Navigate ONLY if update was successful
    }
  };
  
  

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>Profile Details</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e) => setSelectedimage(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden />
            <img src={selectedimage ? URL.createObjectURL(selectedimage) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedimage && 'rounded-full'}`} />
            Upload profile picture
          </label>
          <input onChange={(e) => setName(e.target.value)} value={name} type="text" required placeholder='Your Name' className='p-2 border border-grey-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} required placeholder='Your Bio' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>

          <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>
            Save
          </button>
        </form>
        <img className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10' src={authUser?.profilepic || assets.logo_icon} alt="" />
      </div>
    </div>
  );
};

export default ProfilePage;
