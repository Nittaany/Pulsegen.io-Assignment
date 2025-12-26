import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

import VideoCard from "../components/VideoCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DashboardPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const { getSocket, connected } = useSocket();
  const { user } = useAuth();

  /**
   * Fetch videos (filtered)
   */
  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);

      const params = filter !== "all" ? { status: filter } : {};
      const res = await api.get("/videos", { params });

      setVideos(res.data.data.videos);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  /**
   * Fetch videos when filter changes
   */
  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  /**
   * Socket: listen for video processing progress
   */
  useEffect(() => {
    if (!connected) return;

    const socket = getSocket();
    if (!socket) return;

    const handleProgress = (data) => {
      setVideos((prev) =>
        prev.map((video) =>
          video._id === data.videoId
            ? {
                ...video,
                progress: data.progress,
                status: data.progress === 100 ? "completed" : "processing",
                sensitivity: data.sensitivity || video.sensitivity,
              }
            : video
        )
      );
    };

    socket.on("video-progress", handleProgress);

    return () => {
      socket.off("video-progress", handleProgress);
    };
  }, [connected, getSocket]);

  /**
   * Remove video locally after delete
   */
  const handleDelete = (videoId) => {
    setVideos((prev) => prev.filter((v) => v._id !== videoId));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Videos</h1>

        {(user?.role === "editor" || user?.role === "admin") && (
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Upload Video
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        {["all", "processing", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No videos found</p>

          {(user?.role === "editor" || user?.role === "admin") && (
            <Link
              to="/upload"
              className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
            >
              Upload your first video
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video._id}
              video={video}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
