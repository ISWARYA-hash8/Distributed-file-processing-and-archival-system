import React from "react";
import { X, Upload, CheckCircle, Archive } from "lucide-react";

export default function FileDetailsModal({ file, onClose }) {
  if (!file) return null;

  const rows = [
    ["ID", file.id],
    ["File Name", file.fileName ?? file.file_name ?? "-"],
    ["Content Type", file.content_type ?? file.contentType ?? "-"],
    ["Size (bytes)", file.size ?? "-"],
    ["Status", file.status ?? "-"],
    ["Upload Duration (ms)", file.upload_duration_ms ?? file.uploadDurationMs ?? "-"],
    ["Upload Started At", file.upload_started_at ?? file.uploadStartedAt ?? file.uploadStart ?? file.created_at ?? "-"],
    ["Uploaded At", file.uploaded_at ?? file.uploadedAt ?? file.createdAt ?? "-"],
    ["Archived At", file.archived_at ?? file.archivedAt ?? "-"],
    ["Blob URL", file.blob_url ?? file.blobUrl ?? "-"],
    ["User ID", file.user?.id ?? file.userId ?? "-"],
  ];

  /* LIFECYCLE FLOW */
  const status = file.status;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">File Details</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X />
          </button>
        </div>

        {/* LIFECYCLE */}
        <div className="mb-5">
          <div className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
            File Lifecycle
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Step icon={<Upload size={14} />} label="Uploaded" active />

            {(status === "PROCESSED" || status === "ARCHIVED") && (
              <>
                <Arrow />
                <Step icon={<CheckCircle size={14} />} label="Processed" active />
              </>
            )}

            {status === "ARCHIVED" && (
              <>
                <Arrow />
                <Step icon={<Archive size={14} />} label="Archived" active />
              </>
            )}
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="p-2 border rounded bg-gray-50 dark:bg-gray-700"
            >
              <div className="text-xs text-gray-500 dark:text-gray-300">
                {label}
              </div>
              <div
                className="font-mono text-xs truncate"
                title={String(value ?? "")}
              >
                {value ?? "-"}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* STEP COMPONENT */
function Step({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-1 px-2 py-1 rounded-full
      ${active ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-500"}`}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

/* ARROW */
function Arrow() {
  return <span className="text-gray-400">→</span>;
}
