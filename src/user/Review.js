import { Button, Card, Rate, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import Header from "./Header";
import Footer from "./Footer";
import { axiosJson } from "../axios/axiosCustomize";
import moment from 'moment';
import SpinComponents from "../Components/Spin";
import NotFound from "./NotFound";
import { toast } from "react-toastify";

const Review = () => {
    const [value, setValue] = useState(0);
    const [comment, setComment] = useState('');
    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false); // State to track if review has been submitted

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const bookingcode = urlParams.get('bookingcode');
        const email = urlParams.get('email');

        if (bookingcode && email) {
            fetchBookingData(bookingcode, email);
        }
    }, []);

    const fetchBookingData = async (bookingCode, email) => {
        try {
            const response = await axiosJson.get(`/Reviews/getbookingreview`, {
                params: {
                    bookingCode: bookingCode,
                    email: email
                },
            });

            if (response.status === 200) {
                setBookingData(response.data);
                console.log(response.data);
            } else {
                setError('Error fetching data');
                console.log('Error fetching:', response.data.error);
            }
        } catch (error) {
            setError('Error fetching data');
            console.error('Error fetching:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkinDate = bookingData ? moment(bookingData.checkinDate).format("DD-MM-YYYY") : 'N/A';
    const checkOutDate = bookingData ? moment(bookingData.checkOutDate).format("DD-MM-YYYY") : 'N/A';
    const totalDays = bookingData ? moment(bookingData.checkOutDate).diff(moment(bookingData.checkinDate), 'days') : 0;

    const handleRateChange = (value) => {
        setValue(value);
    };

    const handleTextChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async () => {
        if (value === 0 && comment.trim() === '') {
            // Prevent submission if both rating and comment are empty
            console.log('Please provide a rating or comment.');
            return;
        }

        const data = {
            bookingCode: bookingData.bookingCode,
            rate: value,
            comment: comment,
            email: bookingData.email,
            hotelId: bookingData.hotelId,
        };

        try {
            const response = await axiosJson.post(`/Reviews/addreview`, data);
            if (response.status === 200 || response.status === 201) {
                toast.success("Cảm ơn nhận xét của bạn. Chúc bạn một ngày tốt lành.");
                setSubmitted(true); // Set state to true after successful submission
            } else {
                toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error("Đã có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.");
        }
    };

    const desc = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

    if (loading) return <SpinComponents />;
    if (error) return <NotFound />;

    return (
        <>
            <Header />
            <div className="container" style={{ display: 'flex', justifyContent: 'center', margin: 30 }}>
                <Card style={{ textAlign: 'center', border: '1px solid #379AE6FF', width: '700px' }}>
                    <Typography.Title style={{ margin: 0, padding: 0 }} level={4}>Phiếu đánh giá khách sạn</Typography.Title>
                    <Typography.Title style={{ margin: 0, padding: 0 }} level={5}>ID Booking: {bookingData?.bookingCode}</Typography.Title>
                    {submitted ? (
                        <Card style={{ margin: 10 }}>
                            <Typography.Title level={5}>Cảm ơn bạn đã đánh giá khách sạn!</Typography.Title>
                            <Typography.Paragraph>Xin chân thành cảm ơn bạn đã dành thời gian để đánh giá dịch vụ của chúng tôi.</Typography.Paragraph>
                        </Card>
                    ) : (
                        <>
                            <Card style={{ margin: 10 }}>
                                <Typography.Title level={5}> Thông tin khách sạn</Typography.Title>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <h6 style={{ color: '#379AE6FF' }}>{bookingData?.hotelName}</h6>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>

                                        <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}><FaLocationDot size={25} style={{ color: '#379AE6FF' }} />{bookingData?.hotelAddress}</div>
                                        <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}><MdOutlineEmail size={25} style={{ color: '#379AE6FF' }} />{bookingData?.hotelEmail}</div>
                                        <div style={{ display: 'flex', gap: 5, marginBottom: 5 }}><FaPhoneAlt size={25} style={{ color: '#379AE6FF' }} />{bookingData?.hotelPhoneNumber}</div>

                                        <div style={{ display: 'flex', gap: 20, }}>
                                            <div><strong> Làm thủ tục:</strong> {checkinDate}</div>
                                            <div><strong> Trả phòng:</strong> {checkOutDate}</div>
                                        </div>
                                        <div><strong>Tổng thời gian lưu trú:</strong> {totalDays} ngày</div>
                                        <div><strong>Tổng giá trị hóa đơn:</strong> {((bookingData?.totalAmount).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }))}</div>
                                    </div>
                                </div>
                            </Card>
                            <Card style={{ margin: 10 }}>
                                <Typography.Title level={5}>Đánh giá</Typography.Title>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 10 }}>
                                    <div><strong>Khách hàng: </strong>{bookingData?.customerName}</div>
                                    <div><strong>Email:</strong> {bookingData?.email}</div>
                                    <div><strong>SĐT:</strong> {bookingData?.phoneNumber}</div>
                                </div>
                                <Rate style={{ display: 'flex', justifyContent: 'center', gap: 15 }} tooltips={desc} onChange={handleRateChange} value={value} count={10} />
                                <TextArea
                                    showCount
                                    maxLength={300}
                                    onChange={handleTextChange}
                                    placeholder="Nhận xét của bạn..."
                                    style={{ marginTop: 20, marginBottom: 20, height: 120, resize: 'none' }}
                                />
                                <Button type="primary" onClick={handleSubmit} disabled={value === 0 && comment.trim() === ''}>
                                    Xác nhận
                                </Button>
                            </Card>
                        </>
                    )}
                </Card>
            </div>
            <Footer />
        </>
    );
};

export default Review;
