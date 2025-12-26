import { Link } from "react-router-dom";
import api from "../services/api";

export default function VideoCard({ video, onDelete }) {
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Delete this video?")) return;

    try {
      await api.delete(`/videos/${video._id}`);
      onDelete(video._id);
    } catch (error) {
      console.error(error);
      alert("Failed to delete video");
    }
  };

  return (
    <Link to={`/videos/${video._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video bg-gray-200 flex items-center justify-center">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">
            {video.title || video.filename}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {new Date(video.createdAt).toLocaleDateString()}
          </p>

          <div className="flex gap-2 mt-3">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                video.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : video.status === "processing"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {video.status}
            </span>

            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                video.sensitivity === "safe"
                  ? "bg-green-100 text-green-800"
                  : video.sensitivity === "flagged"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {video.sensitivity}
            </span>
          </div>

          {video.status === "processing" && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${video.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {video.progress}% processed
              </p>
            </div>
          )}

          <button
            onClick={handleDelete}
            className="text-xs text-red-600 hover:underline mt-3"
          >
            Delete
          </button>
        </div>
      </div>
    </Link>
  );
}
