import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from '@goongmaps/goong-js';
import '@goongmaps/goong-js/dist/goong-js.css';
import { Modal, Button } from 'react-bootstrap';
import SpinComponents from './Spin';

const Map = (props) => {
  const { hotelData } = props;
  const smallMapContainer = useRef(null);
  const largeMapContainer = useRef(null);
  const smallMap = useRef(null);
  const largeMap = useRef(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (hotelData && hotelData.length > 0) {
      // Initialize small map
      if (!smallMap.current) {
        smallMap.current = new mapboxgl.Map({
          container: smallMapContainer.current,
          style: 'https://tiles.goong.io/assets/goong_map_web.json',
          center: [hotelData[0].location.longitude, hotelData[0].location.latitude], // Center of the first hotel
          zoom: 16,
          minZoom: 14,
          maxZoom: 20,
          bearing: 30,
          preserveDrawingBuffer: true,
          accessToken: '7vnAVNobyzY89uRMLrNuOkvwAQiUeKY1I7LwqLyA', // Replace with your access token
        });

        // Add markers and popups to small map
        hotelData.forEach((hotel) => {
          const customMarker = new mapboxgl.Marker()
            .setLngLat([hotel.location.longitude, hotel.location.latitude])
            .addTo(smallMap.current);

          const popupContent = `<h4>${hotel.hotelName}</h4><p>${hotel.address}</p>`;
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(popupContent);

          customMarker.setPopup(popup);
        });
      }
    }
  }, [hotelData]);

  useEffect(() => {
    // Initialize large map when modal is shown
    if (showModal && hotelData && hotelData.length > 0) {
      if (!largeMap.current) {
        largeMap.current = new mapboxgl.Map({
          container: largeMapContainer.current,
          style: 'https://tiles.goong.io/assets/goong_map_web.json',
          center: [hotelData[0].location.longitude, hotelData[0].location.latitude], // Center of the first hotel
          zoom: 16,
          minZoom: 14,
          maxZoom: 20,
          bearing: 30,
          preserveDrawingBuffer: true,
          accessToken: '7vnAVNobyzY89uRMLrNuOkvwAQiUeKY1I7LwqLyA', // Replace with your access token
        });

        // Add markers and popups to large map
        hotelData.forEach((hotel) => {
          const customMarker = new mapboxgl.Marker()
            .setLngLat([hotel.location.longitude, hotel.location.latitude])
            .addTo(largeMap.current);

          const popupContent = `<h4>${hotel.hotelName}</h4><p>${hotel.address}</p>`;
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(popupContent);

          customMarker.setPopup(popup);
        });

        // Resize the map to ensure proper rendering
        setTimeout(() => {
          largeMap.current.resize();
        }, 200); // Ensure the map resizes when the modal is fully open
      }
    }

    return () => {
      // Cleanup when modal is closed
      if (largeMap.current) {
        largeMap.current.remove();
        largeMap.current = null;
      }
    };
  }, [showModal, hotelData]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div style={{ padding: '10px' }}>
      {hotelData && hotelData.length > 0 ? (
        <>
          <div ref={smallMapContainer} style={{ height: '300px', borderRadius: '18px' }} />
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button variant="primary" onClick={openModal}>
              Xem bản đồ lớn
            </Button>
          </div>
        </>
      ) : (
        <SpinComponents />
      )}

      <Modal show={showModal} onHide={closeModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Bản đồ phóng lớn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div ref={largeMapContainer} style={{ width: '100%', height: '80vh' }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Map;
