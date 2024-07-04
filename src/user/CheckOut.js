import React, { useEffect } from 'react';
import { Card, Row, Col, Avatar, Space, Typography, Image, Divider, Input, Button, Radio, Form, Rate, Table } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, NotificationOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { FaLocationDot, FaMapLocationDot } from 'react-icons/fa6';
import { MdOutlineEmail } from 'react-icons/md';
import { FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import { toast } from 'react-toastify';
import { axiosJson } from '../axios/axiosCustomize';
import { AuthContext, AuthProvider, useAuth } from '../axios/AuthContext';
import { useContext } from 'react';

import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
const { Meta } = Card;
const { Title, Text } = Typography;
const CheckOut = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [note, setNote] = useState('');
    // useEffect(() => {
    //     const token = localStorage.getItem('jwt');
    //     if (token) {
    //         try {
    //             const decodedToken = jwtDecode(token);
    //             const email = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    //             setEmail(email)

    //             const fullName = decodedToken['fullName'];
    //             setFullName(fullName)
    //             const phoneNumber = decodedToken['phoneNumber'];
    //             setPhoneNumber(phoneNumber)
    //             console.log(email, fullName, phoneNumber)
    //         } catch (error) {
    //             console.error('Invalid token format:', error);

    //         }
    //     }
    // }, []);

    // useEffect(() => {
    //     if (user) {
    //         setFullName(user.fullName || '');
    //         setEmail(user.email || '');
    //         setPhoneNumber(user.phoneNumber || '');
    //     }
    // }, [user]);



    const [form] = Form.useForm();
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [hotelData, setHotelData] = useState(null);
    const [bookingData, setBookingData] = useState(null);
    const [checkinDate, setCheckinDate] = useState('');
    const [checkoutDate, setCheckoutDate] = useState('');
    const [totalStayDays, setTotalStayDays] = useState(0);

    useEffect(() => {
        const hotelJSON = localStorage.getItem('hotel');
        const bookingJSON = localStorage.getItem('booking');
        if (hotelJSON) {
            try {
                const parsedHotelData = JSON.parse(hotelJSON);
                const parsedBookingData = JSON.parse(bookingJSON);
                setBookingData(parsedBookingData);
                setHotelData(parsedHotelData);
                const checkinDate = parsedBookingData.checkInDate;
                const checkoutDate = parsedBookingData.checkOutDate;

                // Định dạng ngày theo 'dd-mm-yyyy'
                const formattedCheckinDate = moment(checkinDate).format('DD-MM-YYYY');
                const formattedCheckoutDate = moment(checkoutDate).format('DD-MM-YYYY');

                // Tính toán tổng số ngày lưu trú
                const startDate = moment(checkinDate, 'YYYY-MM-DD');
                const endDate = moment(checkoutDate, 'YYYY-MM-DD');
                const totalStayDays = endDate.diff(startDate, 'days');

                // Gán vào state
                setCheckinDate(formattedCheckinDate);
                setCheckoutDate(formattedCheckoutDate);
                setTotalStayDays(totalStayDays);
            } catch (error) {

                console.error('Error parsing hotel data from localStorage', error);
            }
        }
        else {
            navigate('/')
        }
    }, []);

    const handleRadioChange = (e) => {
        console.log('Selected payment method:', e.target.value);
        setPaymentMethod(e.target.value);
    };

    // const handlePayment = async () => {
    //     try {
    //         const values = form.getFieldsValue();
    //         const { customerName, email, phoneNumber, note } = values;

    //         // Loại bỏ thuộc tính `name` từ `bookingDetails`
    // //         const modifiedBookingDetails = bookingData.bookingDetails.map(({ name, ...rest }) => rest);

    //         const payload = {
    //             ...bookingData,
    //             customerName,
    //             email,
    //             phoneNumber,
    //             note,
    //             bookingDetails: modifiedBookingDetails,
    //         };

    //         let response;
    //         if (paymentMethod === 'MOMO') {
    //             response = await axiosJson.post('/Payment/momo-payment', payload);
    //         } else if (paymentMethod === 'VNPAY') {
    //             response = await axiosJson.post('/Payment/vnpay-payment', payload);
    //         }

    //         if (response.status === 200) {
    //             // toast.success('Payment successful');
    //             window.open(response.data.url, '_blank');
    //         } else {
    //             toast.error('Payment failed');
    //         }
    //     } catch (error) {
    //         console.error('Payment error:', error);
    //         toast.error('An error occurred during payment');
    //     }
    // };

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        switch (field) {
            case 'fullName':
                setFullName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'phoneNumber':
                setPhoneNumber(value);
                break;
            case 'note':
                setNote(value);
                break;
            default:
                break;
        }
    };


    const handleSubmit = async () => {
        const modifiedBookingDetails = bookingData.bookingDetails.map(({ name, ...rest }) => rest);

        try {
            const payload = {
                ...bookingData,
                customerName: fullName,
                email: email,
                phoneNumber: phoneNumber,
                note: note,
                bookingDetails: modifiedBookingDetails,
                // other fields as needed
            };

            let response;
            if (paymentMethod === 'MOMO') {
                response = await axiosJson.post('/Payment/momo-payment', payload);
            } else if (paymentMethod === 'VNPAY') {
                response = await axiosJson.post('/Payment/vnpay-payment', payload);
            }

            if (response && response.status === 200) {
                localStorage.removeItem('hotel');
                localStorage.removeItem('booking');
                window.location.href = response.data.url;
            } else {
                toast.error('Payment failed');
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('An error occurred during payment');
        }
    };


    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
            render: (_, record, index) => index + 1,
        },
        {
            title: 'Tên phòng',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số lượng phòng',
            dataIndex: 'roomCount',
            key: 'roomCount',
        },
        {
            title: 'Giá mỗi phòng',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            render: (unitPrice) => (
                <span>{unitPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
            ),
        },
    ];
    const data = bookingData?.bookingDetails?.map((detail, index) => ({
        ...detail,
        index,
        key: index, // Or use a unique identifier like detail.roomTypeId if available
    }));

    const totalPrice = bookingData?.totalPrice || 0;
    const discount = bookingData?.discount || 0;
    const totalAmount = bookingData?.totalAmount || 0;

    const summary = () => (
        <>
            <Table.Summary.Row >
                <Table.Summary.Cell index={1} colSpan={3}>Thành tiền:</Table.Summary.Cell>
                <Table.Summary.Cell>{totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
                <Table.Summary.Cell index={2} colSpan={3}>Giảm giá:</Table.Summary.Cell>
                <Table.Summary.Cell>{discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
                <Table.Summary.Cell index={3} colSpan={3}>Tổng cộng:</Table.Summary.Cell>
                <Table.Summary.Cell>{totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Table.Summary.Cell>
            </Table.Summary.Row>

        </>
    );


    return (
        <div className='container' style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>

            {hotelData && (
                <Card className='card-checkout'>
                    <Typography.Title level={5}>Thông tin khách sạn</Typography.Title>
                    <h4>{hotelData.hotelName}</h4>
                    <img src={hotelData.img} alt="Hotel" style={{ display: 'flex', width: '100%', height: '150px', justifyItems: 'center', alignItems: 'center' }} />
                    <div style={{ paddingTop: '60px', color: 'black' }}>
                        <span style={{ display: 'flex', gap: 10, margin: 10 }}>
                            <FaMapMarkerAlt size={20} /> {hotelData.address}
                        </span>
                        <span style={{ display: 'flex', gap: 20, margin: 10 }}>
                            <Rate disabled defaultValue={parseInt(hotelData.ratingStarts, 10)} />
                        </span>
                        <span style={{ display: 'flex', gap: 20, margin: 10 }}>
                            <MdOutlineEmail size={20} /> {hotelData.email}
                        </span>
                        <span style={{ display: 'flex', gap: 20, margin: 10 }}>
                            <FaPhoneAlt size={20} /> {hotelData.phoneNumber}
                        </span>
                    </div>
                </Card>
            )}
            {bookingData && (
                <Card className='card-checkout'>
                    <Typography.Title level={5}>Chi tiết đặt phòng</Typography.Title>
                    <div style={{ display: 'flex', flexDirection: 'column', color: 'black', textAlign: 'left', marginBottom: '20px', maxWidth: '30vw' }}>
                        <span >Ngày checkin:  {hotelData?.checkinTime}   {checkinDate}</span>
                        <span >Ngày checkout:  {hotelData?.checkoutTime}  {checkoutDate}</span>
                        <span >Tổng số ngày lưu trú: {totalStayDays} đêm</span>
                        <span >Người lớn: {bookingData?.numberOfAdults} người</span>
                        <span >Trẻ em: {bookingData?.numberOfChildren} trẻ</span>
                    </div>
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey={(record) => record.key.toString()} // Ensure a unique key for each row
                        pagination={false}
                        bordered
                        summary={summary} // Sử dụng const summary đã định nghĩa
                    />

                </Card>
            )}

            <Card className='card-checkout' style={{}}>

                <Typography.Title level={5} style={{ marginBottom: '16px' }}>Thông tin thanh toán</Typography.Title>
                <Input
                    size="large"
                    value={user?.fullName}
                    onChange={(e) => handleInputChange(e, 'fullName')}
                    placeholder="Thông tin khách hàng"
                    prefix={<UserOutlined />}
                    style={{ marginBottom: '5px' }}
                />
                <Input
                    size="large"
                    value={user?.email}
                    onChange={(e) => handleInputChange(e, 'email')}
                    placeholder="Email"
                    prefix={<MailOutlined />}
                    style={{ marginBottom: '5px' }}
                />
                <Input
                    size="large"
                    value={user?.phoneNumber}

                    onChange={(e) => handleInputChange(e, 'phoneNumber')}
                    placeholder="Số điện thoại"
                    prefix={<PhoneOutlined />}
                    style={{ marginBottom: '5px' }}
                />
                <Input.TextArea
                    showCount
                    maxLength={100}
                    onChange={(e) => handleInputChange(e, 'note')}
                    placeholder="Ghi chú"
                    style={{
                        height: 120,
                        resize: 'none',
                        marginBottom: '10px',
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', gap: '30px' }}>
                    <img src="/asset/images/momo.png" alt="Momo" style={{ width: '30%' }} />
                    <img src="/asset/images/vnpay.png" alt="VNPAY" style={{ width: '30%' }} />
                </div>
                <Radio.Group onChange={handleRadioChange} value={paymentMethod} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                    <Radio.Button value="MOMO" style={{ flex: 1 }}>
                        MOMO
                    </Radio.Button>
                    <Radio.Button value="VNPAY" style={{ flex: 1, marginLeft: '10px' }}>
                        VNPAY
                    </Radio.Button>
                </Radio.Group>
                <Button type="primary" block size="large" disabled={!paymentMethod} onClick={handleSubmit}>
                    Thanh toán
                </Button>
            </Card>
        </div>

    );
};

export default CheckOut;

