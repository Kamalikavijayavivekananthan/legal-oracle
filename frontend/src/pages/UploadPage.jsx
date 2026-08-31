import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UploadCloud, File, X, Loader2, CheckCircle2, AlertCircle, HelpCircle, Lock } from "lucide-react";

export default function UploadPage({ setGlobalResults }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 contracts for comparison.");
      return;
    }
    setLoading(true);
    
    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));

    try {
      console.log("Sending request to backend...");
      const response = await axios.post("/api-backend/upload-contracts", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Response received:", response.data);
      setGlobalResults(response.data);
      navigate("/results");
    } catch (error) {
      console.error("Upload error details:", error);
      alert(`Analysis Failed: ${error.message || "Could not connect to server"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 lg:p-10 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 font-medium">
        <span>Dashboard</span>
        <span className="text-slate-300">/</span>
        <span className="text-blue-600">Upload Contracts</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Upload Contracts</h1>
        <p className="text-slate-500 font-medium">Upload multiple contract documents (PDF) to analyze and detect contradictions.</p>
      </div>
      
      <div className="flex flex-col xl:flex-row gap-8">
        {/* Main Column */}
        <div className="flex-1 space-y-6">
          
          {/* Box 1: Drag and Drop */}
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">1. Upload Contract Documents</h2>
            
            <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 rounded-xl p-12 flex flex-col items-center justify-center relative hover:bg-blue-50 transition-colors">
              <input 
                type="file" 
                multiple 
                accept=".pdf" 
                onChange={handleFileChange} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <UploadCloud size={48} className="text-blue-600 mb-4" />
              <p className="text-slate-700 dark:text-slate-200 font-medium mb-1">Drag & drop your PDF files here</p>
              <p className="text-slate-400 text-sm mb-5">or</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                Browse Files
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
              <File size={14} className="text-slate-400" />
              <span>Supports PDF files only. Max file size: 50MB per file.</span>
            </div>
          </div>

          {/* Box 2: Table */}
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">2. Uploaded Contracts ({files.length})</h2>
            
            <div className="overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 text-slate-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">File Name</th>
                    <th className="px-6 py-4">Size</th>
                    <th className="px-6 py-4">Pages</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {files.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-400">No files uploaded yet.</td>
                    </tr>
                  ) : (
                    files.map((file, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:bg-slate-950/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <File size={16} className="text-red-500" />
                            <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[200px]">{file.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{(file.size / 1024).toFixed(0)} KB</td>
                        <td className="px-6 py-4 text-slate-500">?</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-green-600 font-medium">
                            <CheckCircle2 size={16} />
                            <span>Ready</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Box 3: Start Analysis */}
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">3. Start Analysis</h2>
            <p className="text-sm font-medium text-slate-500 mb-6">Click the button below to analyze uploaded contracts and detect contradictions.</p>
            
            <button 
              onClick={handleUpload} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <UploadCloud size={18} />}
              {loading ? "Analyzing Contracts..." : "Analyze Contracts"}
            </button>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
              <Lock size={14} className="text-slate-400" />
              <span>Your documents are secure and will not be shared.</span>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="xl:w-80 space-y-6">
          
          {/* Guidelines */}
          <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">Upload Guidelines</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start text-sm text-slate-700 dark:text-slate-200 font-medium">
                <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                <p>Upload 2 or more contracts for comparison</p>
              </div>
              <div className="flex gap-3 items-start text-sm text-slate-700 dark:text-slate-200 font-medium">
                <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                <p>Files must be in PDF format</p>
              </div>
              <div className="flex gap-3 items-start text-sm text-slate-700 dark:text-slate-200 font-medium">
                <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                <p>Maximum file size: 50MB per file</p>
              </div>
              <div className="flex gap-3 items-start text-sm text-slate-700 dark:text-slate-200 font-medium">
                <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                <p>Ensure documents are clear and text-readable</p>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
            <div className="flex items-center gap-2 text-amber-700 font-bold mb-3">
              <AlertCircle size={18} />
              <h3>Note</h3>
            </div>
            <p className="text-sm text-amber-800 font-medium leading-relaxed">
              For best results, upload contracts with clear text. Scanned documents should have OCR text.
            </p>
          </div>

          {/* Help */}
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-2 text-blue-800 font-bold mb-3">
              <HelpCircle size={18} />
              <h3>Need Help?</h3>
            </div>
            <p className="text-sm text-blue-800 font-medium leading-relaxed mb-4">
              Learn how to get the best analysis results from your contract documents.
            </p>
            <button className="px-4 py-2 bg-white dark:bg-[#1e293b] border border-blue-200 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-50 transition-colors">
              View Help Guide
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
