import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const SlidesDetails = ({ hotelDetail }) => {
  const images = hotelDetail?.imageUrls && Array.isArray(hotelDetail.imageUrls)
    ? hotelDetail.imageUrls.map((url) => ({
      original: url,
      thumbnail: url,
    }))
    : [];

  return (

    <div style={{ marginLeft: '30px', width: '70%', height: '100%' }}> {/* Adjust height as needed */}
      <ImageGallery
        items={images}
        showPlayButton={false}
        showFullscreenButton={true}
        showIndex={true}
        slideOnThumbnailOver={true}
        thumbnailPosition='right'
        autoPlay={true}
      />
    </div>

  );
};

export default SlidesDetails;
