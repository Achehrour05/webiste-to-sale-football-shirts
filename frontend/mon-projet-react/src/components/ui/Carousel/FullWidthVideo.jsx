import React from 'react';

const FullWidthVideo = ({ src, title,controls=false, autoPlay = true, muted = false, loop = true }) => {
  return (
    <div style={{
      width: '99vw',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw',
      overflow: 'hidden'
    }}>
      <video
        src={src}
        title={title}
        controls={false}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        style={{
          width: '100%',
          height: 'auto',
          display: 'block'
        }}
      />
    </div>
  );
};

export default FullWidthVideo;