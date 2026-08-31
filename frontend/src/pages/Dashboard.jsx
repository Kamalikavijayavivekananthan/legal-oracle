import { useState } from "react";
import axios from "axios";

function Dashboard() {

  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);

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
        "/api-backend/upload-contracts",
        formData
      );

      setResults(response.data.results);

    } catch (error) {
      console.log(error);
      alert("Upload Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold mb-8">
        Legal Oracle Dashboard
      </h1>

      <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow mb-8">

        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileChange}
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 text-white px-6 py-2 rounded ml-4"
        >
          Analyze Contracts
        </button>

      </div>

      <div className="grid gap-6">

        {results.map((item, index) => (

          <div
            key={index}
            className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-md"
          >

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-2xl font-semibold">
                Contradiction Detected
              </h2>

              <span className={`text-white px-4 py-1 rounded ${
                item.risk_level === "HIGH"
                  ? "bg-red-500"
                  : item.risk_level === "MEDIUM"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}>
                {item.risk_level} RISK
              </span>

            </div>

            <div className="mb-3">
              <p className="font-medium">Clause 1:</p>
              <p>{item.clause1}</p>
            </div>

            <div className="mb-3">
              <p className="font-medium">Clause 2:</p>
              <p>{item.clause2}</p>
            </div>

            <div className="mb-3">
              <p className="font-medium">
                Similarity Score:
              </p>

              <p>{item.similarity}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded">

              <p className="font-semibold">
                AI Legal Analysis:
              </p>

              <p>{item.ai_explanation}</p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Dashboard;
