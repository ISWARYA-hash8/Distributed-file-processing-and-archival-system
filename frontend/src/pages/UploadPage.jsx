import { useState, useRef, useEffect } from "react";
import axios from "../api/api";
import {
  UploadCloud,
  FileUp,
  Loader2,
  CheckCircle,
} from "lucide-react";
import FileCard from "../components/FileCard";
import { useToast } from "../components/ToastContext";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [processingCount, setProcessingCount] = useState(0);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const consoleEndRef = useRef(null);
  const { addToast } = useToast();

  /** Auto scroll console */
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consoleLogs]);

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;
    setFiles((prev) => [...prev, ...picked]);
    fileInputRef.current.value = "";
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setUploading(true);
    setProcessingCount(files.length);

    setConsoleLogs((prev) => [
      ...prev,
      `🚀 Dispatching ${files.length} file(s) to server...`,
    ]);

    try {
      await axios.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setConsoleLogs((prev) => [
        ...prev,
        "📡 Server accepted upload request",
        "⚙️ Async processing started",
      ]);

      addToast(`${files.length} file(s) queued`, { type: "info" });

      setTimeout(() => {
        setProcessingCount(0);
        setConsoleLogs((prev) => [
          ...prev,
          `✅ ${files.length} file(s) uploaded successfully`,
        ]);
        addToast("Upload successful", { type: "success" });
        setUploading(false);
      }, 1500);

      setFiles([]);
    } catch (err) {
      setUploading(false);
      setConsoleLogs((prev) => [
        ...prev,
        "❌ Upload failed: " + (err.response?.data || err.message),
      ]);
      addToast("Upload failed", { type: "error" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      

      {/* Upload Card */}
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-xl shadow-xl p-6 mb-8">
        {/* Drop Zone */}
        <label
          className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-lg p-8 cursor-pointer hover:bg-blue-50 transition"
        >
          <FileUp size={40} className="text-blue-600 mb-2" />
          <p className="text-gray-700 font-medium">
            Drag & drop files here or{" "}
            <span className="text-blue-600 underline">browse</span>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Selected Files */}
        <div className="mt-6 space-y-3">
          {files.length === 0 && (
            <p className="text-gray-500 text-sm text-center">
              No files selected
            </p>
          )}

          {files.map((file, idx) => (
            <FileCard
              key={idx}
              file={file}
              onRemove={(fileToRemove) =>
                setFiles((prev) => prev.filter((f) => f !== fileToRemove))
              }
            />
          ))}
        </div>

        {/* Upload Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={uploadFiles}
            disabled={uploading || files.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium
              bg-gradient-to-r from-blue-600 to-purple-600
              hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Uploading...
              </>
            ) : (
              <>
                <UploadCloud size={18} />
                Upload Files
              </>
            )}
          </button>
        </div>
      </div>

      {/* Processing Console */}
      <div className="bg-gray-900 text-white rounded-xl shadow-lg p-5 font-mono text-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle size={18} className="text-green-400" />
            Processing Console
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <span>Processing</span>
            <span className="bg-white/10 px-3 py-1 rounded">
              {processingCount}
            </span>
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-2">
          {consoleLogs.length === 0 && (
            <p className="text-gray-400">Waiting for uploads...</p>
          )}

          {consoleLogs.map((log, idx) => (
            <div
              key={idx}
              className="bg-white/5 px-3 py-2 rounded flex gap-2 items-start"
            >
              <span className="text-green-400">{">"}</span>
              <span className="break-all">{log}</span>
            </div>
          ))}
          <div ref={consoleEndRef} />
        </div>
      </div>
    </div>
  );
}
