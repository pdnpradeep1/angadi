import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiUser, FiMail, FiPhone, FiMapPin, FiImage, FiSave, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import "../styles/ProfilePage.css";

const ProfilePage = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Set up form with react-hook-form
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await axios.get('http://localhost:8080/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setUserData(response.data);
        
        // Populate form fields with user data
        Object.keys(response.data).forEach(key => {
          setValue(key, response.data[key]);
        });
        
        // Set image preview if exists
        if (response.data.profilePicture) {
          setImagePreview(response.data.profilePicture);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load your profile. Please try again.');
        
        // For development: Set mock data
        if (process.env.NODE_ENV === 'development') {
          const mockData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+91 98765 43210',
            address: '123 Main Street, Bangalore, Karnataka, India'
          };
          
          setUserData(mockData);
          Object.keys(mockData).forEach(key => {
            setValue(key, mockData[key]);
          });
        }
      }
    };

    fetchUserData();
  }, [setValue]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) return null;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      setUploadProgress(0);
      const token = localStorage.getItem('jwtToken');
      const response = await axios.put(
        'http://localhost:8080/user/update-profile-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );
      
      return response.data;
    } catch (err) {
      console.error('Error uploading image:', err);
      throw new Error('Failed to upload profile picture');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('jwtToken');
      
      // Upload profile picture if selected
      if (selectedFile) {
        await uploadImage();
      }
      
      // Update profile data
      await axios.put(
        'http://localhost:8080/user/update-profile',
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setSuccess(true);
      setUserData(data);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!userData && !error) {
    return (
      <div className="profile-page flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="profile-page bg-white dark:bg-gray-800 shadow-md rounded-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account information and preferences</p>
      </div>

      {error && (
        <div className="mx-6 mt-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-md">
          <div className="flex items-center">
            <FiAlertCircle className="text-red-500 mr-2" size={20} />
            <span className="text-red-700 dark:text-red-400">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mx-6 mt-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-md">
          <div className="flex items-center">
            <FiCheckCircle className="text-green-500 mr-2" size={20} />
            <span className="text-green-700 dark:text-green-400">Profile updated successfully!</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Picture Section */}
          <div className="md:col-span-1">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 relative mb-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <FiUser className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                  </div>
                )}
                <label
                  htmlFor="profile-picture"
                  className="absolute bottom-0 right-0 bg-primary-600 hover:bg-primary-700 text-white rounded-full p-2 cursor-pointer shadow-lg"
                >
                  <FiImage size={18} />
                </label>
                <input
                  type="file"
                  id="profile-picture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
                Click the icon to upload a new profile picture
              </p>
              
              {uploadProgress > 0 && selectedFile && (
                <div className="w-full mt-2">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                    <div 
                      className="bg-primary-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Profile Information Form */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              <div className="input-group">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400" />
                  </div>
                  <input
                    {...register("name", { required: "Name is required" })}
                    id="name"
                    className="input pl-10 block w-full"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    id="email"
                    type="email"
                    className="input pl-10 block w-full"
                    placeholder="Enter your email address"
                    readOnly
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    {...register("phone", { 
                      required: "Phone number is required"
                    })}
                    id="phone"
                    className="input pl-10 block w-full"
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FiMapPin className="text-gray-400" />
                  </div>
                  <textarea
                    {...register("address", { required: "Address is required" })}
                    id="address"
                    className="input pl-10 block w-full"
                    placeholder="Enter your address"
                    rows={3}
                  ></textarea>
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 inline-flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;