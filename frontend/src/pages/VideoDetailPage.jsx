import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../services/api";
import VideoPlayer from "../components/VideoPlayer";
import LoadingSpinner from "../components/LoadingSpinner";

export default function VideoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Fetch single video
   */
  const fetchVideo = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/videos/${id}`);
      setVideo(res.data.data.video);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to load video");
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * Load video on mount / id change
   */
  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  /**
   * Delete video
   */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await api.delete(`/videos/${id}`);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete video");
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 text-blue-600 hover:text-blue-700"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Video / Placeholder */}
        {video.status === "completed" ? (
          <VideoPlayer videoId={id} />
        ) : (
          <div className="aspect-video bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-xl mb-2">Video is {video.status}</p>

              {video.status === "processing" && (
                <div className="text-sm">
                  <p>Processing progress: {video.progress}%</p>
                  <div className="w-64 bg-gray-700 rounded-full h-2 mt-2 mx-auto">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${video.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {video.title || video.filename}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Uploaded on{" "}
                {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                className={`px-3 py-1 rounded-full text-xs font-medium ${
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
          </div>

          {/* Meta */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              <p>
                Size: {(video.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>

            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50"
            >
              Delete Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
