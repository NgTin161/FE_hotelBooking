import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, Modal, Button, Tag } from "antd";
import "./SlidesReview.css"; // Import custom CSS file for styling

const SlidesReview = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reviewDetails, setReviewDetails] = useState(null);

  const openModal = (email, date, rating, comment) => {
    setReviewDetails({ email, date, rating, comment });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
    cssEase: "ease" // CSS easing function for the transition
  };

  const renderRatingDescription = (rating) => {
    if (rating >= 1 && rating <= 3) {
      return <Tag color="red">Tệ</Tag>;
    } else if (rating > 3 && rating <= 5) {
      return <Tag color="orange">Tạm được</Tag>;
    } else if (rating > 5 && rating <= 8) {
      return <Tag color="blue">Tốt</Tag>;
    } else if (rating > 8 && rating <= 10) {
      return <Tag color="green">Xuất sắc</Tag>;
    }
    return null;
  };

  const truncateText = (text, limit) => {
    if (text.length <= limit) {
      return text;
    }
    return text.substring(0, limit) + "...";
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <Card style={{ borderColor: '#379AE6FF' }}
            hoverable
            className="review-card"
            onClick={() => openModal(
              "tinnguyentrung2002@gmail.com",
              "20/10/2023",
              9,
              "Khách sạn tuyệt vời"
            )}
          >
            <h5>tinnguyentrung2002@gmail.com</h5>
            <p>Ngày đánh giá: 20/10/2023</p>
            <p>Đánh giá: 9/10 {renderRatingDescription(9)}</p>
            <p>{truncateText("Khách sạn tuyệt vời", 50)}</p>
          </Card>
        </div>
        <div>
          <Card
            hoverable
            className="review-card"
            onClick={() => openModal(
              "tinnguyentrung2002@gmail.com",
              "20/10/2023",
              7,
              "Khách sạn tốt ddddddddddddddddddddddddddddd  ssssssssssssssssssssssssssss"
            )}
          >
            <h5>tinnguyentrung2002@gmail.com</h5>
            <p>Ngày đánh giá: 20/10/2023</p>
            <p>Đánh giá: 7/10 {renderRatingDescription(7)}</p>
            <p>{truncateText("Khách sạn tốt ddddddddddddddddddddddddddddd  ssssssssssssssssssssssssssss", 50)}</p>
          </Card>
        </div>
        <div>
          <Card
            hoverable
            className="review-card"
            onClick={() => openModal(
              "tinnguyentrung2002@gmail.com",
              "20/10/2023",
              7,
              "Khách sạn tốt ddddddddddddddddddddddddddddd  ssssssssssssssssssssssssssss"
            )}
          >
            <h5>tinnguyentrung2002@gmail.com</h5>
            <p>Ngày đánh giá: 20/10/2023</p>
            <p>Đánh giá: 7/10 {renderRatingDescription(7)}</p>
            <p>{truncateText("Khách sạn tốt ddddddddddddddddddddddddddddd  ssssssssssssssssssssssssssss", 50)}</p>
          </Card>
        </div> <div>
          <Card
            hoverable
            className="review-card"
            onClick={() => openModal(
              "tinnguyentrung2002@gmail.com",
              "20/10/2023",
              7,
              "Khách sạn tốt ddddddddddddddddddddddddddddd  ssssssssssssssssssssssssssss"
            )}
          >
            <h5>tinnguyentrung2002@gmail.com</h5>
            <p>Ngày đánh giá: 20/10/2023</p>
            <p>Đánh giá: 7/10 {renderRatingDescription(7)}</p>
            <p>{truncateText("Khách sạn tốt ddddddddddddddddddddddddddddd  ssssssssssssssssssssssssssss", 50)}</p>
          </Card>
        </div>
      </Slider>

      {/* Modal for displaying review details */}
      <Modal
        title="Chi tiết đánh giá"
        open={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Đóng
          </Button>
        ]}
      >
        {reviewDetails && (
          <div>
            <p><strong>Email:</strong> {reviewDetails.email}</p>
            <p><strong>Ngày đánh giá:</strong> {reviewDetails.date}</p>
            <p><strong>Đánh giá:</strong> {reviewDetails.rating}/10 ({renderRatingDescription(reviewDetails.rating)})</p>
            <p><strong>Bình luận:</strong> {reviewDetails.comment}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SlidesReview;
