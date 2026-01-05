import { useEffect, useState } from "react";
import axios from "../api/api";
import FileDetailsModal from "../components/FileDetailsModal";
import { RefreshCw, Search, Download, Trash2 } from "lucide-react";
import { useToast } from "../components/ToastContext";

export default function MyFilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const { addToast } = useToast();
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/files/all");
      setFiles(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
    const poll = async () => {
      try {
        const res = await axios.get("/files/all", { silent: true });
        setFiles(res.data);
      } catch {}
    };
    const interval = setInterval(poll, 15000);
    return () => clearInterval(interval);
  }, []);

  const filtered = [...files]
  .sort((a, b) => {
    const dateA = new Date(
      a.uploadStart || a.uploadStartedAt || a.createdAt || 0
    );
    const dateB = new Date(
      b.uploadStart || b.uploadStartedAt || b.createdAt || 0
    );
    return dateB - dateA; // newest first
  })
  .filter((f) =>
    f.fileName?.toLowerCase().includes(query.toLowerCase())
  );


  const resolvedDate = (f) =>
    f.uploadStart || f.uploadStartedAt || f.createdAt || null;

  /* DOWNLOAD */
  const handleDownload = async (file, e) => {
    e.stopPropagation();
    try {
      setActionLoadingId(file.id);
      const res = await axios.get(`/files/download/${file.id}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName;
      a.click();
      window.URL.revokeObjectURL(url);
      addToast("Download started", { type: "success" });
    } catch (err) {
      addToast("Download failed", { type: "error" });
    } finally {
      setActionLoadingId(null);
    }
  };

  /* DELETE */
  const handleDeleteConfirmed = async (file) => {
    setDeleteError(null);
    try {
      setActionLoadingId(file.id);
      await axios.delete(`/files/delete/${file.id}`);
      setFiles((prev) => prev.filter((x) => x.id !== file.id));
      setPendingDeleteId(null);
      addToast("File deleted", { type: "success" });
    } catch (err) {
      setDeleteError("Delete failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      

      {/* CONTROLS */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-3 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 dark:bg-gray-800"
          />
        </div>

        <button
          onClick={fetchFiles}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-3">S.No</th>
              <th className="p-3 text-left">File</th>
              <th className="p-3">Size</th>
              <th className="p-3">Upload Start</th>
              <th className="p-3">Upload End</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((f, idx) => (
              <tr
                key={f.id}
                onClick={() => setSelectedFile(f)}
                className="border-t hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer transition hover:scale-[1.005]"
              >
                <td className="p-3 text-center">{idx + 1}</td>

                <td className="p-3">
                  <div className="font-medium truncate">{f.fileName}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {f.description}
                  </div>
                </td>

                <td className="p-3 text-center">
                  {(f.size / 1024).toFixed(2)} KB
                </td>

                <td className="p-3 text-center text-xs">
                  {resolvedDate(f)
                    ? new Date(resolvedDate(f)).toLocaleString()
                    : "-"}
                </td>

                <td className="p-3 text-center text-xs">
                  {f.uploadedAt
                    ? new Date(f.uploadedAt).toLocaleString()
                    : "-"}
                </td>

                <td className="p-3 text-center">
                  <StatusBadge status={f.status} />
                </td>

                <td className="p-3">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={(e) => handleDownload(f, e)}
                      className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPendingDeleteId(f.id);
                      }}
                      className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            No files found
          </p>
        )}
      </div>

      {/* DETAILS MODAL */}
      {selectedFile && (
        <FileDetailsModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}

      {/* DELETE MODAL */}
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold text-red-600">
              Delete this file?
            </h3>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
              This action cannot be undone.
            </p>

            {deleteError && (
              <p className="text-sm text-red-500 mt-2">{deleteError}</p>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setPendingDeleteId(null)}
                className="px-4 py-1 rounded bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleDeleteConfirmed(
                    files.find((x) => x.id === pendingDeleteId)
                  )
                }
                className="px-4 py-1 rounded bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* STATUS BADGE */
function StatusBadge({ status }) {
  const map = {
    UPLOADING: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-yellow-100 text-yellow-700",
    PROCESSED: "bg-green-100 text-green-700",
    FAILED: "bg-red-100 text-red-700",
    ARCHIVED: "bg-gray-200 text-gray-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}>
      ● {status}
    </span>
  );
}
