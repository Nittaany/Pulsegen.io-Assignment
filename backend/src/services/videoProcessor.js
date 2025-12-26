const Video = require('../models/Video');
const { getIO } = require('../config/socket');

/**
 * Mock Video Sensitivity Processor
 * Simulates video content analysis with realistic processing time
 * In production, this would integrate with services like:
 * - AWS Rekognition
 * - Google Video Intelligence API
 * - Azure Video Analyzer
 * - Custom ML model
 */

class VideoProcessor {
  constructor() {
    this.processingQueue = new Map();
  }

  /**
   * Start processing a video
   * @param {String} videoId - MongoDB video ID
   */
  async processVideo(videoId) {
    try {
      const video = await Video.findById(videoId);
      
      if (!video) {
        throw new Error('Video not found');
      }

      // Prevent duplicate processing
      if (this.processingQueue.has(videoId)) {
        console.log(`Video ${videoId} is already being processed`);
        return;
      }

      this.processingQueue.set(videoId, true);

      // Update status to processing
      video.status = 'processing';
      video.processingProgress = 0;
      await video.save();

      // Emit initial progress
      this.emitProgress(videoId, 0, 'Starting analysis...');

      // Simulate processing with progress updates
      await this.simulateProcessing(video);

      // Perform sensitivity analysis
      const analysisResult = this.performSensitivityAnalysis(video);

      // Update video with results
      video.status = 'completed';
      video.processingProgress = 100;
      video.sensitivity = analysisResult.sensitivity;
      video.sensitivityScore = analysisResult.score;
      video.sensitivityDetails = analysisResult.details;
      await video.save();

      // Emit completion
      this.emitProgress(videoId, 100, 'Processing completed', {
        sensitivity: analysisResult.sensitivity,
        details: analysisResult.details
      });

      this.processingQueue.delete(videoId);

      console.log(`Video ${videoId} processed successfully: ${analysisResult.sensitivity}`);
    } catch (error) {
      console.error('Error processing video:', error);
      
      try {
        await Video.findByIdAndUpdate(videoId, {
          status: 'failed',
          sensitivityDetails: error.message
        });
        
        this.emitProgress(videoId, 0, 'Processing failed', { error: error.message });
      } catch (updateError) {
        console.error('Failed to update video status:', updateError);
      }
      
      this.processingQueue.delete(videoId);
    }
  }

  /**
   * Simulate video processing with realistic progress
   */
  async simulateProcessing(video) {
    // Processing time based on file size (10-20 seconds)
    const baseDuration = 10000; // 10 seconds
    const sizeFactor = Math.min(video.size / (100 * 1024 * 1024), 2); // Up to 2x for large files
    const totalDuration = baseDuration + (sizeFactor * 5000);
    
    const steps = 20; // Number of progress updates
    const stepDuration = totalDuration / steps;

    for (let i = 1; i <= steps; i++) {
      await this.sleep(stepDuration);
      
      const progress = Math.floor((i / steps) * 95); // 0-95%
      const stage = this.getProcessingStage(progress);
      
      await Video.findByIdAndUpdate(video._id, {
        processingProgress: progress
      });
      
      this.emitProgress(video._id, progress, stage);
    }
  }

  /**
   * Get human-readable processing stage
   */
  getProcessingStage(progress) {
    if (progress < 20) return 'Extracting video frames...';
    if (progress < 40) return 'Analyzing visual content...';
    if (progress < 60) return 'Detecting sensitive elements...';
    if (progress < 80) return 'Running AI analysis...';
    return 'Finalizing results...';
  }

  /**
   * Mock sensitivity analysis
   * Returns: safe (80% chance) or flagged (20% chance)
   */
  performSensitivityAnalysis(video) {
    // Generate random score between 0 and 1
    const score = Math.random();
    
    // 80% safe, 20% flagged (threshold at 0.8)
    const isSafe = score < 0.8;
    
    const result = {
      sensitivity: isSafe ? 'safe' : 'flagged',
      score: score,
      details: this.generateAnalysisDetails(isSafe, score, video)
    };

    return result;
  }

  /**
   * Generate realistic analysis details
   */
  generateAnalysisDetails(isSafe, score, video) {
    if (isSafe) {
      return `Content analysis completed. Video passed all safety checks with confidence score ${(score * 100).toFixed(1)}%. No sensitive content detected.`;
    } else {
      const reasons = [
        'Potentially sensitive visual content detected',
        'Content requires manual review',
        'Automated flagging for quality assurance'
      ];
      
      const reason = reasons[Math.floor(Math.random() * reasons.length)];
      return `${reason}. Confidence score: ${(score * 100).toFixed(1)}%. Please review before publishing.`;
    }
  }

  /**
   * Emit progress via Socket.io
   */
  emitProgress(videoId, progress, message, additionalData = {}) {
    try {
      const io = getIO();
      io.emit('video:progress', {
        videoId,
        progress,
        message,
        timestamp: new Date().toISOString(),
        ...additionalData
      });
    } catch (error) {
      console.error('Error emitting progress:', error);
    }
  }

  /**
   * Helper sleep function
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
module.exports = new VideoProcessor();