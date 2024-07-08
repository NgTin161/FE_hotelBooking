import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, Modal, Button, Tag, Typography } from "antd";
import "./SlidesReview.css"; // Import custom CSS file for styling
import SpinComponents from "./Spin";
import { axiosJson } from "../axios/axiosCustomize";
import { useParams } from "react-router-dom";
import moment from "moment";

const { Title, Text } = Typography;

const SlidesReview = () => {
  const { id: hotelId } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewDetails, setReviewDetails] = useState(null);

  useEffect(() => {
    fetchReview(hotelId);
  }, [hotelId]); // Fetch reviews when hotelId changes

  const fetchReview = async (id) => {
    try {
      const response = await axiosJson.get(`/Reviews/review-of-hotel?hotelId=${id}`);
      const results = response.data.map(item => item.result); // Lấy dữ liệu từ result
      setReviews(results || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const openModal = (email, bookingCode, date, rating, comment) => {
    setReviewDetails({ email, bookingCode, date, rating, comment });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const settings = {
    dots: true,
    infinite: reviews.length > 1,
    slidesToShow: Math.min(3, reviews.length),
    slidesToScroll: Math.min(1, reviews.length),
    autoplay: reviews.length > 1,
    speed: 2000,
    autoplaySpeed: 5000,
    cssEase: "ease",
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
    if (text?.length <= limit) {
      return text;
    }
    return text?.substring(0, limit) + "...";
  };

  if (!reviews.length) {
    return <></>;
  }

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div key={index}>
            <Card
              style={{ borderColor: "#379AE6FF" }}
              hoverable
              className="review-card"
              onClick={() =>
                openModal(
                  review.email,
                  review.bookingCode,
                  review.createDate,
                  review.rate,
                  review.comment
                )
              }
            >
              <Title level={5}>{review?.email}</Title>
              <Text>ID Booking: {review?.bookingCode}</Text>
              <p>Ngày đánh giá: {moment(review?.createDate).format("DD-MM-YYYY")}</p>
              <p>Đánh giá: {review?.rate}/10 {renderRatingDescription(review?.rate)}</p>
              <p>"{truncateText(review?.comment, 50)} "</p>
            </Card>
          </div>
        ))}
      </Slider>

      <Modal
        title="Chi tiết đánh giá"
        visible={modalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Đóng
          </Button>,
        ]}
      >
        {reviewDetails && (
          <div>
            <p>
              <strong>Email:</strong> {reviewDetails.email}
            </p>
            <p>
              <strong>ID Booking:</strong> {reviewDetails.bookingCode}
            </p>
            <p>
              <strong>Ngày đánh giá:</strong>{" "}
              {moment(reviewDetails.date).format("DD-MM-YYYY")}
            </p>
            <p>
              <strong>Đánh giá:</strong> {reviewDetails.rating}/10{" "}
              {renderRatingDescription(reviewDetails.rating)}
            </p>
            <p>
              <strong>Bình luận:</strong> {reviewDetails.comment}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SlidesReview;
