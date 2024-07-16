import { Button, Card, Modal, Select, Table, Tag, Typography } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { axiosJson } from '../axios/axiosCustomize';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../axios/AuthContext';

const { Option } = Select;

const HistoryUser = () => {
  const { user } = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sortType, setSortType] = useState('newest');
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const navigate = useNavigate();

  const fetchBooking = async () => {
    const token = localStorage.getItem('jwt');
    try {
      const decodedToken = jwtDecode(token);
      const email = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      const response = await axiosJson.get(`/Bookings/getbookingbyuser?email=${email}`);
      setBookingHistory(response.data);
    } catch (error) {
      console.error('Error fetching booking:', error);
      if (axiosJson.isAxiosError(error)) {
        toast.error('Error fetching booking. Please try again later.');
      } else {
        toast.error('Unexpected error fetching booking.');
      }
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  const showModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const showCancelModal = (booking) => {
    setBookingToCancel(booking);
    setIsCancelModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCancelBooking = async () => {
    if (bookingToCancel) {
      try {
        const response = await axiosJson.post(`/Bookings/cancle-booking`, {
          userId: user?.id,
          bookingCode: bookingToCancel.bookingCode,
          status: 2,
        });
        if (response.status === 200) {
          toast.success('Đã hủy đơn hàng thành công');
          fetchBooking();
          setIsCancelModalVisible(false);
        }
      } catch (error) {
        console.error('Error canceling booking:', error);
        toast.error('Không thể hủy bây giờ. Hãy thử lại sau.');
      }
    }
  };

  const columns = [
    {
      title: 'Loại phòng',
      dataIndex: 'roomTypeName',
      key: 'roomTypeName'
    },
    {
      title: 'Số lượng',
      dataIndex: 'roomCount',
      key: 'roomCount'
    },
    {
      title: 'Thành tiền',
      key: 'totalPrice',
      render: (_, record) => formatCurrency(record.unitPrice)
    }
  ];

  const formatDate = (dateString) => {
    return moment(dateString).format('DD-MM-YYYY');
  };

  const getStatusTag = (status) => {
    switch (status) {
      case -1:
        return <Tag color="red">Thanh toán thất bại</Tag>;
      case 0:
        return <Tag color="blue">Đã thanh toán</Tag>;
      case 1:
        return <Tag color="green">Đã hoàn tất</Tag>;
      case 2:
        return <Tag color="orange">Đã hủy</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  };

  const sortedBookings = bookingHistory.sort((a, b) => {
    if (sortType === 'newest') {
      return moment(b.createDate) - moment(a.createDate);
    } else {
      return moment(a.createDate) - moment(b.createDate);
    }
  });

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const handleSortChange = (value) => {
    setSortType(value);
  };

  const shouldShowCancelButton = (booking) => {
    const currentDate = moment();
    const checkinDate = moment(booking.checkinDate);
    return booking.status === 0 && currentDate.isBefore(checkinDate.clone().subtract(1, 'day'));
  };

  const shouldShowReviewButton = (booking) => {
    const currentDate = moment();
    const checkoutDate = moment(booking.checkOutDate);
    return (booking.status === 0 || booking.status == 1 && checkoutDate.isSameOrBefore(currentDate, 'day')) || booking.status === 1;
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography.Title level={2}>
          Lịch sử đặt phòng
        </Typography.Title>
        <Select defaultValue="newest" style={{ textAlign: 'center' }} onChange={handleSortChange}>
          <Option value="newest">Mới nhất</Option>
          <Option value="oldest">Cũ nhất</Option>
        </Select>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: 20, justifyContent: 'center' }}>
        {sortedBookings.map((booking, index) => (
          <Card
            key={index}
            style={{ margin: 10, width: 350 }}
            type="inner"
            title={<div>Booking ID: {booking.bookingCode}</div>}
          >
            <p>Khách hàng: {booking.customerName}</p>
            <p>Email: {booking.email}</p>
            <p>Tạo ngày: {formatDate(booking.createDate)}</p>
            <p>Ngày checkin: {formatDate(booking.checkinDate)}</p>
            <p>Ngày checkout: {formatDate(booking.checkOutDate)}</p>
            <p>Tổng cộng: {formatCurrency(booking.totalPrice)}</p>
            <p>Trạng thái: {getStatusTag(booking.status)}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              <Button className='button-user' onClick={() => showModal(booking)}>Xem chi tiết</Button>
              {shouldShowCancelButton(booking) && (
                <Button style={{ borderRadius: '18px' }} danger onClick={() => showCancelModal(booking)}>Hủy đơn hàng</Button>
              )}
              {shouldShowReviewButton(booking) && (
                <Button className='button-user' onClick={() => navigate(`/review?email=${booking.email}&bookingcode=${booking.bookingCode}`)}>Đánh giá</Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal width={800} title="Chi tiết Booking" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {selectedBooking && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Typography.Title level={5}>Thông tin người đặt</Typography.Title>
              <p>Mã Booking: {selectedBooking.bookingCode}</p>
              <p>Họ tên người đặt: {selectedBooking.customerName}</p>
              <p>Email: {selectedBooking.email}</p>
              <p>Ngày checkin: {formatDate(selectedBooking.checkinDate)}</p>
              <p>Ngày checkout: {formatDate(selectedBooking.checkOutDate)}</p>
              <p>Số phòng: {selectedBooking.bookingDetails.reduce((total, detail) => total + detail.roomCount, 0)} phòng</p>
              <p>Người lớn: {selectedBooking.numberOfAdults} người</p>
              <p>Trẻ em: {selectedBooking.numberOfChildren} trẻ</p>
              <p>Ghi chú: {selectedBooking.note}</p>
              <p>Tổng cộng: {formatCurrency(selectedBooking.totalAmount)}</p>
              <p>Trạng thái: {getStatusTag(selectedBooking.status)}</p>
            </div>
            <div>
              <Typography.Title level={5}>Thông tin khách sạn</Typography.Title>
              <p>Khách sạn: {selectedBooking.hotelName}</p>
              <p>Địa chỉ: {selectedBooking.hotelAddress}</p>
              <p>Số điện thoại: {selectedBooking.hotelPhoneNumber}</p>
              <p>Email: {selectedBooking.hotelEmail}</p>
            </div>
          </div>
        )}
        <h4>Chi tiết:</h4>
        <Table
          dataSource={selectedBooking ? selectedBooking.bookingDetails : []}
          columns={columns}
          pagination={false}
          rowKey="roomTypeId"
          summary={() => (
            <>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={2}>Tạm tính</Table.Summary.Cell>
                <Table.Summary.Cell>{selectedBooking && formatCurrency(selectedBooking.totalPrice)}</Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={2}>Giảm giá</Table.Summary.Cell>
                <Table.Summary.Cell>{selectedBooking && formatCurrency(selectedBooking.discount)}</Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={2}>Tổng cộng</Table.Summary.Cell>
                <Table.Summary.Cell>{selectedBooking && formatCurrency(selectedBooking.totalAmount)}</Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )}
        />
      </Modal>

      <Modal
        title="Xác nhận hủy đơn hàng"
        visible={isCancelModalVisible}
        onOk={handleCancelBooking}
        onCancel={() => setIsCancelModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn hủy đơn hàng có ID <strong>{bookingToCancel?.bookingCode}</strong> không?</p>
      </Modal>
    </>
  );
};

export default HistoryUser;
