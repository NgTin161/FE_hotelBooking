import { Button, Card, Modal, Select, Table, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import moment from 'moment';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { axiosJson } from '../axios/axiosCustomize';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const { Option } = Select;

// const mockBookings = [
//   {
//     "id": 15,
//     "customerName": "Tín",
//     "email": "tinnguyentrung2002@gmail.com",
//     "phoneNumber": "0902427957",
//     "bookingCode": "638552943104280805",
//     "note": "1",
//     "numberOfAdults": 2,
//     "numberOfChildren": 0,
//     "createDate": "2024-06-30T04:45:10.4283694",
//     "checkinDate": "2024-07-01T00:00:00",
//     "checkOutDate": "2024-07-02T00:00:00",
//     "totalPrice": 1200000,
//     "couponCode": "",
//     "discount": 0,
//     "totalAmount": 1200000,
//     "hotelName": "The IMPERIAL Vung Tau Hotel",
//     "hotelPhoneNumber": "0902427957",
//     "hotelEmail": "tinnguyentrung2002@gmail.com",
//     "hotelAddress": "159 Thùy Vân, Phường Thắng Tam, Thành phố Vũng Tàu",
//     "roomTypeName": null,
//     "status": -1,
//     "bookingDetails": [
//       {
//         "roomTypeName": "Luxury Room",
//         "unitPrice": 1200000,
//         "roomCount": 1,
//         "roomTypeId": 17
//       },
//       {
//         "roomTypeName": "Double Room",
//         "unitPrice": 1200000,
//         "roomCount": 1,
//         "roomTypeId": 1
//       }
//     ]
//   },
//   {
//     "id": 15,
//     "customerName": "Tín",
//     "email": "tinnguyentrung2002@gmail.com",
//     "phoneNumber": "0902427957",
//     "bookingCode": "638552943104280805",
//     "note": "1",
//     "numberOfAdults": 2,
//     "numberOfChildren": 0,
//     "createDate": "2024-06-15T04:45:10.4283694",
//     "checkinDate": "2024-07-01T00:00:00",
//     "checkOutDate": "2024-07-02T00:00:00",
//     "totalPrice": 1200000,
//     "couponCode": "",
//     "discount": 0,
//     "totalAmount": 1200000,
//     "hotelName": "The IMPERIAL Vung Tau Hotel",
//     "hotelPhoneNumber": "0902427957",
//     "hotelEmail": "tinnguyentrung2002@gmail.com",
//     "hotelAddress": "159 Thùy Vân, Phường Thắng Tam, Thành phố Vũng Tàu",
//     "roomTypeName": null,
//     "status": -1,
//     "bookingDetails": [
//       {
//         "roomTypeName": "Luxury Room",
//         "unitPrice": 1200000,
//         "roomCount": 1,
//         "roomTypeId": 17
//       },
//       {
//         "roomTypeName": "Double Room",
//         "unitPrice": 1200000,
//         "roomCount": 1,
//         "roomTypeId": 1
//       }
//     ]
//   },
//   {
//     "id": 15,
//     "customerName": "Tín",
//     "email": "tinnguyentrung2002@gmail.com",
//     "phoneNumber": "0902427957",
//     "bookingCode": "638552943104280805",
//     "note": "1",
//     "numberOfAdults": 2,
//     "numberOfChildren": 0,
//     "createDate": "2024-06-30T04:45:10.4283694",
//     "checkinDate": "2024-06-21T00:00:00",
//     "checkOutDate": "2024-07-02T00:00:00",
//     "totalPrice": 1200000,
//     "couponCode": "",
//     "discount": 0,
//     "totalAmount": 1200000,
//     "hotelName": "The IMPERIAL Vung Tau Hotel",
//     "hotelPhoneNumber": "0902427957",
//     "hotelEmail": "tinnguyentrung2002@gmail.com",
//     "hotelAddress": "159 Thùy Vân, Phường Thắng Tam, Thành phố Vũng Tàu",
//     "roomTypeName": null,
//     "status": -1,
//     "bookingDetails": [
//       {
//         "roomTypeName": "Luxury Room",
//         "unitPrice": 1200000,
//         "roomCount": 1,
//         "roomTypeId": 17
//       },
//       {
//         "roomTypeName": "Double Room",
//         "unitPrice": 1200000,
//         "roomCount": 1,
//         "roomTypeId": 1
//       }
//     ]
//   }
// ];

const HistoryUser = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sortType, setSortType] = useState('newest');
  const [bookingHistory, setBookingHistory] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBooking = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const decodedToken = jwtDecode(token);
        const email = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
        const response = await axiosJson.get(`/Bookings/getbookingbyuser?email=${email}`);
        setBookingHistory(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching booking:', error);
        if (axiosJson.isAxiosError(error)) {
          toast.error('Error fetching booking. Please try again later.');
        } else {
          // Handle other types of errors
          toast.error('Unexpected error fetching booking.');
        }
      }
    };

    fetchBooking();
  }, []);
  const showModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // const totalRoomPrice = (bookingDetails) => {
  //   if (!bookingDetails || bookingDetails.length === 0) {
  //     return 0;
  //   }
  //   return bookingDetails.reduce((total, detail) => {
  //     return total + (detail.unitPrice * detail.roomCount);
  //   }, 0);
  // };

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
        return <Tag color="gray">Đã hủy</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  };

  // const sortedBookings = bookingHistory.sort((a, b) => {
  //   if (sortType === 'newest') {
  //     return moment(b.checkinDate) - moment(a.checkinDate);
  //   } else {
  //     return moment(a.checkinDate) - moment(b.checkinDate);
  //   }
  // });

  const sortedBookings = bookingHistory.sort((a, b) => {
    if (sortType === 'newest') {
      return moment(b.createDate) - moment(a.createDate);
    } else {
      return moment(a.createDate) - moment(b.createDate);
    }
  });


  const handleSortChange = (value) => {
    setSortType(value);
  };

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
        <Typography.Title level={2}>
          Lịch sử đặt phòng
        </Typography.Title>

        <Select defaultValue="newest" className='custom-select' style={{ textAlign: 'center' }} onChange={handleSortChange}>
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
            title={<div>Mã Booking: {booking.bookingCode}   </div>}
            extra={<div style={{ marginLeft: '10px' }}>
              <Button className='button-user' onClick={() => showModal(booking)}>Xem chi tiết</Button>
            </div>}
          >

            <p>Khách hàng: {booking.customerName}</p>
            <p>Email: {booking.email}</p>
            <p>Tạo ngày: {formatDate(booking.createDate)}</p>
            <p>Ngày checkin: {formatDate(booking.checkinDate)}</p>
            <p>Ngày checkout: {formatDate(booking.checkOutDate)}</p>
            <p>Tổng cộng: {formatCurrency(booking.totalPrice)}</p>
            <p>Trạng thái: {getStatusTag(booking.status)}</p>
          </Card >
        ))}
      </div >

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
                <Table.Summary.Cell>{formatCurrency(selectedBooking ? selectedBooking.totalPrice : [])}</Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={2}>Giảm giá</Table.Summary.Cell>
                <Table.Summary.Cell>{formatCurrency(selectedBooking ? selectedBooking.discount : 0)}</Table.Summary.Cell>
              </Table.Summary.Row>
              <Table.Summary.Row>
                <Table.Summary.Cell colSpan={2}>Tổng tiền phòng</Table.Summary.Cell>
                <Table.Summary.Cell>{formatCurrency(selectedBooking ? selectedBooking.totalAmount : 0)}</Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          )}
        />
      </Modal>
    </>
  );
};

const formatCurrency = (amount) => {
  return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

export default HistoryUser;
