// src/components/ProfilePage.js

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import FilePond from "filepond";
// import "filepond/dist/filepond.min.css";
// import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// import "filepond-plugin-file-input/dist/filepond-plugin-file-input.css";

// const schema = yup.object().shape({
//   name: yup.string().required("Name is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   phone: yup.string().required("Phone number is required"),
//   address: yup.string().required("Address is required"),
// });

// const ProfilePage = () => {
//   const [imagePreview, setImagePreview] = useState(null);
//   const { register, handleSubmit, formState: { errors } } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const onSubmit = async (data) => {
//     console.log(data);
//     // Here you would typically send the data to your backend API
//   };

//   return (
//     <div className="profile-page">
//       <h1>Design Profile Page</h1>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="input-group">
//           <label htmlFor="name">Name</label>
//           <input {...register("name")} id="name" placeholder="Enter your name" />
//           {errors.name && <span>{errors.name.message}</span>}
//         </div>

//         <div className="input-group">
//           <label htmlFor="email">Email</label>
//           <input {...register("email")} id="email" type="email" placeholder="Enter your email" />
//           {errors.email && <span>{errors.email.message}</span>}
//         </div>

//         <div className="input-group">
//           <label htmlFor="phone">Phone Number</label>
//           <input {...register("phone")} id="phone" placeholder="Enter your phone number" />
//           {errors.phone && <span>{errors.phone.message}</span>}
//         </div>

//         <div className="input-group">
//           <label htmlFor="address">Address</label>
//           <textarea {...register("address")} id="address" placeholder="Enter your address" rows={3} />
//           {errors.address && <span>{errors.address.message}</span>}
//         </div>

//         <div className="file-input">
//           <FilePond
//             name="profilePicture"
//             labelIdle={`Drag & Drop your picture or <span class=\"filepond--label-action\">Browse</span>`}
//             allowImagePreview={true}
//             imagePreviewThumbnailSize={{ width: 120, height: 120 }}
//             maxFileSize={5000000}
//             server={{
//               process: (fieldName, fileSourcedata, metadata, load, error, progress, abort) => {
//                 // Here you would typically send the file to your backend API
//                 console.log(fieldName, fileSourcedata, metadata, load, error, progress, abort);
//                 return new Promise((resolve) => {
//                   // Simulating file upload
//                   setTimeout(() => {
//                     const response = {
//                       filename: fileSourcedata.name,
//                       secure_url: "https://example.com/123.jpg",
//                       width: 800,
//                       height: 600,
//                     };
//                     resolve({ filename: fileSourcedata.name });
//                   }, 200);
//                 });
//               },
//             }}
//             onupdatefiles={(newFiles) => {
//               setImagePreview(newFiles.length > 0 ? newFiles[0].getServerId() : null);
//             }}
//           />
//         </div>

//         {imagePreview && (
//           <img src={imagePreview} alt="Profile Picture Preview" className="profile-picture-preview" />
//         )}

//         <button type="submit">Update Profile</button>
//       </form>
//     </div>
//   );
// };

// export default ProfilePage;