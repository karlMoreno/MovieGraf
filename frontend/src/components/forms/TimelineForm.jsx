import React, { useState, useRef } from 'react';
import './TimelineForm.css'; 
import { Button } from '@mui/material';

const TimelineForm = () => {
  const [clips, setClips] = useState([]);
  const [currentClip, setCurrentClip] = useState(null);
  const videoRef = useRef(null);
  const frameRate = 24; 
  const handleAddClip = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newClip = {
        id: clips.length + 1,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file)
      };
      setClips([...clips, newClip]);
    }
  };

  const handleClipSelect = (clip) => {
    setCurrentClip(clip);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  const handleSeek = (event) => {
    const seekTime = (event.target.value * videoRef.current.duration) / 100;
    videoRef.current.currentTime = seekTime;
  };

  const handleFrameStep = (step) => {
    if (videoRef.current) {
      const frameDuration = 1 / frameRate;
      let newTime = videoRef.current.currentTime + frameDuration * step;
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, newTime));
    }
  };

  return (
    <div className="timeline-container">
      <input type="file" onChange={handleAddClip} accept="video/*" />
      <div className="video-player">
        {currentClip && (
          <>
            <video ref={videoRef} width="640" controls>
              <source src={currentClip.url} type={currentClip.type} />
            </video>
            <div className="controls">
            <Button variant="outlined" onClick={() => handleFrameStep(-1)}>&lt; Frame</Button>
              <input type="range" min="0" max="100" defaultValue="0" onMouseUp={handleSeek} />
              <Button variant="outlined" onClick={() => handleFrameStep(1)}>Frame &gt;</Button>
            </div>
          </>
        )}
      </div>
      <div className="clip-list">
        {clips.map((clip, index) => (
          <div key={index} className="clip" onClick={() => handleClipSelect(clip)}>
            {clip.name} - {Math.round(clip.size / 1024)} KB
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineForm;
