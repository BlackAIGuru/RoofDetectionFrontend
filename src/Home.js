import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
  // State variables for managing the image file, base64 string, and detected objects
  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Image, setBase64Image] = useState('');
  const [detectedObjects, setDetectedObjects] = useState([]);

  // Handle file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Handle form submission and send image to backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage) {
      alert('Please select an image first.');
      return;
    }

    // Create a form data object to send the file
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      // Send the image to the FastAPI backend using Axios
      const response = await axios.post('http://127.0.0.1:8000/detect/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Get the base64 image and detected objects from the response
      setBase64Image(response.data.annotated_image);
      setDetectedObjects(response.data.detected_objects);
    } catch (error) {
      console.error('Error uploading the image:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Upload Image for Foreign Debris Detection</h1>
      
      {/* Image Upload Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />
        <button type="submit">Detect</button>
      </form>

      {/* Display Detected Objects */}
      {detectedObjects.length > 0 && (
        <div>
          <h3>Detected Objects:</h3>
          <ul>
            {detectedObjects.map((object, index) => (
              <li key={index}>{object}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display Annotated Image */}
      {base64Image && (
        <div>
          <h3>Annotated Image:</h3>
          <img
            src={`data:image/jpeg;base64,${base64Image}`}
            alt="Annotated"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
