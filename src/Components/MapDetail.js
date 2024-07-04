import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '@goongmaps/goong-js';
import '@goongmaps/goong-js/dist/goong-js.css';
import { Modal, Button } from 'react-bootstrap';

const MapDetail = ({ hotelData }) => {
  const smallMapContainer = useRef(null);
  const largeMapContainer = useRef(null);
  const smallMap = useRef(null);
  const largeMap = useRef(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (hotelData && smallMapContainer.current && !smallMap.current) {
      smallMap.current = new mapboxgl.Map({
        container: smallMapContainer.current,
        style: 'https://tiles.goong.io/assets/goong_map_web.json',
        center: [hotelData.location.longitude, hotelData.location.latitude],
        zoom: 16,
        minZoom: 14,
        maxZoom: 20,
        accessToken: '7vnAVNobyzY89uRMLrNuOkvwAQiUeKY1I7LwqLyA',
      });

      new mapboxgl.Marker()
        .setLngLat([hotelData.location.longitude, hotelData.location.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${hotelData.hotelName}</h3><p>${hotelData.address}</p>`))
        .addTo(smallMap.current);
    }
  }, [hotelData]);

  useEffect(() => {
    if (showModal && hotelData && largeMapContainer.current) {
      if (largeMap.current) {
        largeMap.current.remove();
        largeMap.current = null;
      }

      largeMap.current = new mapboxgl.Map({
        container: largeMapContainer.current,
        style: 'https://tiles.goong.io/assets/goong_map_web.json',
        center: [hotelData.location.longitude, hotelData.location.latitude],
        zoom: 16,
        minZoom: 14,
        maxZoom: 20,
        accessToken: '7vnAVNobyzY89uRMLrNuOkvwAQiUeKY1I7LwqLyA',
      });

      new mapboxgl.Marker()
        .setLngLat([hotelData.location.longitude, hotelData.location.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h4>${hotelData.hotelName}</h4><p>${hotelData.address}</p>`))
        .addTo(largeMap.current);
    }
  }, [showModal, hotelData]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div style={{ width: '200px', height: '100px', marginLeft: 30 }}>
      {hotelData ? (
        <>
          <div ref={smallMapContainer} style={{ width: '200px', height: '200px' }} />
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <Button className='button-user' onClick={openModal}>
              Chi Tiết
            </Button>
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>No hotel data available.</p>
      )}

      <Modal show={showModal} onHide={closeModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Vị trí chi tiết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div ref={largeMapContainer} style={{ width: '100%', height: '600px' }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MapDetail;
