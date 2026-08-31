import { useState } from "react";
import axios from "axios";

function UploadContracts() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload-contracts",
        formData
      );

      alert(response.data.message);
    } catch (error) {
      console.log(error);
      alert("Upload Failed");
    }
  };

  return (
    <div>
      <h1>Upload Legal Contracts</h1>

      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={handleFileChange}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Upload Contracts
      </button>
    </div>
  );
}

export default UploadContracts;
