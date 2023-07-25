
import { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileInputChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Creating a FormData object to send the file
    const formData = new FormData();
    formData.append('file', selectedFile);

    // Sending the file to the backend using an HTTP POST request
    axios.post('http://localhost:3000/upload', formData)
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input type="file" onChange={handleFileInputChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadForm;
