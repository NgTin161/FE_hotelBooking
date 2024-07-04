import React, { useEffect, useState } from 'react';
import { Card, Typography, Table } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const { Column } = Table;

const formatNumberWithDot = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const ConfirmPayment = () => {
    const [bookingCode, setBookingCode] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState(0);
    const [imgUrl, setImgUrl] = useState('/asset/images/check.png'); // Mặc định là hình ảnh check.png

    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const bookingCodeParam = urlParams.get('bookingcode');
        const fullNameParam = urlParams.get('fullName');
        const emailParam = urlParams.get('email');
        const amountParam = urlParams.get('amount');
        const errorParam = urlParams.get('errorCode');

        setBookingCode(bookingCodeParam || '');
        setFullName(fullNameParam || '');
        setEmail(emailParam || '');
        setAmount(amountParam || '');
        setError(parseInt(errorParam) || 0);


        if (parseInt(errorParam) !== 0) {
            setImgUrl('/asset/images/close.png');
        }
    }, [location.search]);

    const data = [
        { key: '1', field: 'Mã booking', value: bookingCode },
        { key: '2', field: 'Họ tên người đặt phòng', value: fullName },
        { key: '3', field: 'Email', value: email },
        { key: '4', field: 'Tổng cộng', value: `${formatNumberWithDot(amount)} VNĐ` },
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card style={{ width: 400, textAlign: 'center', border: '1px solid black' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    <img src={imgUrl} alt={error ? 'failed' : 'success'} style={{ width: 80, height: 80 }} />
                </div>
                <Typography.Title level={4}>{error ? 'Thanh toán thất bại' : 'Thanh toán thành công'}</Typography.Title>
                <Typography.Paragraph>Vui lòng kiểm tra email để xem chi tiết đơn hàng.</Typography.Paragraph>
                <Table
                    dataSource={data}
                    size="small"
                    pagination={false}
                    style={{ marginBottom: 20 }}
                    bordered
                    showHeader={false}
                >
                    <Column title="Field" dataIndex="field" key="field" />
                    <Column title="Value" dataIndex="value" key="value" />
                </Table>
                <Link to="/">
                    <button className="buttonPayment">
                        <i className="home-icon"></i>Quay về trang chủ
                    </button>
                </Link>
            </Card>
        </div>
    );
};

export default ConfirmPayment;
