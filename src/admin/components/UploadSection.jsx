import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react';
import galleryData from '../../client/data/gallery'; // Import your gallery data

const UploadSection = () => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState('');
  const [gallery, setGallery] = useState(galleryData); // State for gallery images
  const maxFileSizeMB = 5;

  // Handle file selection and validation
  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    const validFiles = selectedFiles.filter(file =>
      validImageTypes.includes(file.type) && file.size / 1024 / 1024 <= maxFileSizeMB
    );

    if (validFiles.length !== selectedFiles.length) {
      setError('Some files were not added because they are invalid or exceed the size limit.');
    } else {
      setError('');
    }

    // Set files and preview URLs for display
    setFiles([...files, ...validFiles]);
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);

    // Simulate uploading to the backend and getting new image URLs
    validFiles.forEach(file => {
      uploadImage(file).then(newImageUrl => {
        setGallery([...gallery, { id: Date.now(), name: file.name, size: file.size, src: newImageUrl }]);
      }).catch(() => {
        setError('Error uploading image.');
      });
    });
  };

  // Simulate image upload to a backend service
  const uploadImage = async (imageFile) => {
    // Replace this with actual upload logic, e.g., a POST request to a server
    // Here we're just simulating with a local URL
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(URL.createObjectURL(imageFile));
      }, 1000);
    });
  };

  // Handle file removal
  const handleFileRemove = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col w-full p-4 h-auto lg:h-[50vh]">
      {/* File upload and preview section */}
      <div className='flex flex-col lg:flex-row lg:h-2/3 gap-10'>
        
        {/* File upload area */}
        <div className="border-2 border-dashed border-[#CCCCCD] py-16 h-full w-full lg:flex-1 text-center rounded-2xl flex justify-center items-center">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            accept="image/png, image/jpeg, image/gif"
            className="hidden"
            id="fileUpload"
          />
          <label htmlFor="fileUpload" className="cursor-pointer">
            <div className="flex flex-col items-center">
              <div className='bg-[#FFE5E5] hover:bg-[#fdcdcd] p-4 rounded-full mb-3'>
                <Icon icon='gravity-ui:file-arrow-up' className='text-red-600 h-7 w-7'/>
              </div>
              <div>Drag and drop files here or <span className="text-red-600">Upload</span></div>
              <div className="text-sm text-gray-500">Upload images here, maximum size 5MB each</div>
            </div>
          </label>
        </div>

        {/* Image preview area */}
        <div className='h-48 lg:h-full lg:w-1/3 border-2 border-[#E8E9ED] flex flex-col justify-center items-center rounded-2xl overflow-hidden'>
          {!previewUrls.length ? (
            <div className='flex flex-col items-center'>
              <div className='bg-[#EFF0F3] p-4 rounded-full mb-3'>
                <Icon icon='radix-icons:image' className='h-6 w-6 text-[#6E7786]'/> 
              </div>
              <div className='text-[#6E7786]'>Preview Image</div>
            </div>
          ) : (
            <div>
              <img src={previewUrls[previewUrls.length - 1]} alt="Preview" className='w-48 h-48 object-cover rounded' />
            </div>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 text-red-600">
          {error}
        </div>
      )}

      {/* File details display */}
      {files.length > 0 && (
        <div className="mt-4">
          <div className='mb-3'>Files</div>
          <div className='flex gap-3'>
            {files.map((file, index) => (
              <div key={index} className="relative w-full sm:w-64 py-2 px-3 mb-2 border-2 border-[#f0f0f1] text-[#6E7786] rounded-lg">
                <div>{file.name}</div>
                <div className='flex text-sm mt-1'>
                  <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  <span className='ml-2 text-[#08C352]'>Completed</span>
                </div>
                <Icon
                  icon='ic:round-close'
                  className='absolute top-2 right-2 h-5 w-5 text-[#B3B4B5] cursor-pointer'
                  onClick={() => handleFileRemove(index)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadSection;
