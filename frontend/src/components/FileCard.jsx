import React from "react";
import {
  FileText,
  Image,
  Archive,
  Video,
  Music,
  Code,
  Download,
  Trash2,
} from "lucide-react";

function chooseIcon(name) {
  const ext = (name || "").split(".").pop().toLowerCase();
  if (/(png|jpg|jpeg|gif|svg|webp)/.test(ext)) return <Image className="w-5 h-5" />;
  if (/(zip|rar|7z|tar|gz)/.test(ext)) return <Archive className="w-5 h-5" />;
  if (/(mp4|mkv|mov|webm)/.test(ext)) return <Video className="w-5 h-5" />;
  if (/(mp3|wav|ogg)/.test(ext)) return <Music className="w-5 h-5" />;
  if (/(json)/.test(ext)) return <Code className="w-5 h-5" />;
  if (/(txt|md|csv)/.test(ext)) return <FileText className="w-5 h-5" />;
  return <FileText className="w-5 h-5" />;
}

export default function FileCard({ file, onRemove, onDownload }) {
  const name = file.fileName || file.name || "Unnamed";
  const size = file.size != null ? file.size : 0;
  const sizeKB = (size / 1024).toFixed(2);
  const status = file.status;

  return (
    <div className="flex items-center justify-between gap-4 p-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="text-gray-600 dark:text-gray-300">{chooseIcon(name)}</div>
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{sizeKB} KB</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {status && (
          <span className="px-2 py-1 rounded text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            {status}
          </span>
        )}

        {onDownload && (
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => onDownload(file)} aria-label="download">
            <Download className="w-4 h-4" />
          </button>
        )}

        {onRemove && (
          <button className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-700" onClick={() => onRemove(file)} aria-label="remove">
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
}
