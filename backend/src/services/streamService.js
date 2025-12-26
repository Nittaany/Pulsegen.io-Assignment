const fs = require('fs');
const path = require('path');

/**
 * Video Streaming Service with Range Request Support
 * Enables video seeking and progressive playback
 */

class StreamService {
  /**
   * Stream video file with range request support
   * @param {Object} video - Video document from MongoDB
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  streamVideo(video, req, res) {
    const videoPath = video.filePath;

    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({
        success: false,
        error: 'Video file not found'
      });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle range request (for video seeking)
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      
      const chunkSize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });

      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': video.mimeType
      };

      res.writeHead(206, headers);
      file.pipe(res);
    } else {
      // Stream entire video
      const headers = {
        'Content-Length': fileSize,
        'Content-Type': video.mimeType,
        'Accept-Ranges': 'bytes'
      };

      res.writeHead(200, headers);
      fs.createReadStream(videoPath).pipe(res);
    }

    // Increment view count (optional)
    this.incrementViews(video._id);
  }

  /**
   * Increment video view count (async, don't wait)
   */
  async incrementViews(videoId) {
    try {
      const Video = require('../models/Video');
      await Video.findByIdAndUpdate(videoId, {
        $inc: { views: 1 }
      });
    } catch (error) {
      console.error('Error incrementing views:', error);
    }
  }

  /**
   * Get video metadata for preview
   */
  getVideoInfo(video) {
    return {
      id: video._id,
      title: video.title,
      duration: video.duration,
      size: video.size,
      mimeType: video.mimeType,
      url: `/api/videos/${video._id}/stream`
    };
  }
}

module.exports = new StreamService();