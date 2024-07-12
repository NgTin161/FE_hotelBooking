import React, { useState } from 'react';
import { Table, Image, InputNumber, Button, Input, Card } from 'antd';
import { IoMdPerson } from 'react-icons/io';
import SpinComponents from './Spin';
import Search from 'antd/es/transfer/search';
import { useNavigate } from 'react-router-dom';


const formatTime = (time) => time.slice(0, 5);
const RoomTypesTable = ({ roomTypes, hotelDetail, checkinDate, checkoutDate, adults, children }) => {
  const navigate = useNavigate();
  const [roomQuantities, setRoomQuantities] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const columns = [
    {
      title: 'Hình đại diện',
      dataIndex: 'imageURL',
      render: imageURL => <Image src={imageURL} width={80} />,
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
    },
    {
      title: 'Số người',
      dataIndex: 'maxPeople',
      render: maxPeople => (
        <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '170px' }}>
          {Array.from({ length: maxPeople }, (_, index) => (
            <IoMdPerson key={index} style={{ margin: '2px', fontSize: 20 }} />
          ))}
        </div>
      ),
    },
    {
      title: 'Số giường',
      dataIndex: 'numberOfBed',


    },
    {
      title: 'Dịch vụ',
      render: (_, record) => {
        const services = [
          record.haveFreeDrinkWater && 'Miễn phí nước suối',
          record.haveMiniBar && 'Có mini bar',
          record.haveClothesHanger && 'Móc quần áo',
          record.haveClosets && 'Tủ quần áo',
          record.haveBathtubAndShower && 'Bồn tắm và vòi sen',
          record.haveAirConditioner && 'Máy lạnh',
          record.haveBalcony && 'Ban công',
          record.haveTvScreen && 'Màn hình TV lớn',
          record.haveFreeWifi && 'Miễn phí Wifi',
          record.haveNoSmoking && 'Không hút thuốc',
          record.haveFreeBreakfast && 'Miễn phí buổi sáng',
          record.haveFreeCleaningRoom && 'Dọn phòng mỗi ngày',
          record.haveFreeLaundry && 'Miễn phí giặt ủi',
          record.haveNiceView && 'Có view đẹp',
        ].filter(Boolean).join(', ');

        return (
          <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxWidth: '300px' }}>
            {services}
          </div>
        );
      },
    },
    {
      title: `Giá tiền cho ${roomTypes?.numberOfDays} đêm`,
      dataIndex: 'price',
      render: (_, record) => (
        <span>
          {record.price.toLocaleString()} VND
          <br />
          {record.availableRooms.toLocaleString()} phòng loại này
        </span>
      ),
    },
    {
      title: 'Chọn số lượng',
      render: (_, record) => (
        <InputNumber
          min={0}
          max={record.availableRooms}
          defaultValue={0}
          changeOnWheel
          onChange={value => handleQuantityChange(record.id, value, record.price, roomTypes.numberOfDays, record.name)}
        />
      ),
    },
  ];

  const handleQuantityChange = (roomId, quantity, price, numberOfDays, name) => {
    const updatedQuantities = {
      ...roomQuantities,
      [roomId]: { quantity, price, numberOfDays, name },
    };
    setRoomQuantities(updatedQuantities);

    // Tính toán bookingDetails và totalPrice, totalAmount
    const updatedBookingDetails = Object.keys(updatedQuantities).map(roomId => {
      const { quantity, price, numberOfDays, name } = updatedQuantities[roomId];
      const unitPrice = price * quantity;
      return {
        roomTypeId: parseInt(roomId), // Giả sử roomId chính là roomTypeId
        roomCount: quantity,
        unitPrice: unitPrice,
        name: name, // Đảm bảo name được truyền đúng từ InputNumber
      };
    });

    const totalPrice = updatedBookingDetails.reduce((acc, detail) => acc + detail.unitPrice, 0);
    const totalAmount = totalPrice - booking.discount; // Có thể điều chỉnh theo logic của bạn

    setBooking(prevBooking => ({
      ...prevBooking,
      bookingDetails: updatedBookingDetails,
      totalPrice: totalPrice,
      totalAmount: totalAmount,
    }));

    // Cập nhật totalPrice để hiển thị cho người dùng
    setTotalPrice(totalPrice);
  };
  const [booking, setBooking] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
    numberOfAdults: adults,
    numberOfChildren: children,
    checkInDate: checkinDate,
    checkOutDate: checkoutDate,
    totalPrice: 0,
    couponCode: "",
    discount: 0,
    totalAmount: 0,
    note: "",
    hotelId: hotelDetail.id,
    bookingDetails: [],
  });

  const [hotel, setHotel] = useState({
    hotelName: hotelDetail.hotelName,
    address: hotelDetail.address,
    email: hotelDetail.email,
    phoneNumber: hotelDetail.phoneNumber,
    ratingStarts: hotelDetail.ratingStarts,
    img: hotelDetail.imageUrls[0],
    checkinTime: formatTime(hotelDetail.checkinTime),
    checkoutTime: formatTime(hotelDetail.checkoutTime)
  });


  const handleConfirmBooking = () => {
    console.log('Đã xác nhận đặt phòng');
    console.log('Thông tin số lượng phòng:', roomQuantities);
    console.log('Tổng số tiền:', totalPrice);

    // Lưu thông tin khách sạn vào localStorage
    const savedHotel = localStorage.getItem('hotel');
    let updatedHotel = { ...hotel };

    if (savedHotel) {
      const existingHotel = JSON.parse(savedHotel);
      updatedHotel = {
        ...existingHotel,
        ...hotel,
      };
    }

    const hotelJson = JSON.stringify(updatedHotel);
    localStorage.setItem('hotel', hotelJson);

    // Lưu thông tin đặt phòng vào localStorage
    const savedBooking = localStorage.getItem('booking');
    let updatedBooking = { ...booking };

    if (savedBooking) {
      const existingBooking = JSON.parse(savedBooking);
      updatedBooking = {
        ...existingBooking,
        ...booking,
      };
    }

    const bookingJson = JSON.stringify(updatedBooking);
    localStorage.setItem('booking', bookingJson);
    navigate('/checkout');
  };

  const handleApplyCoupon = () => {
    const isValidCoupon = checkCouponCode(couponCode);

    if (isValidCoupon) {
      const discount = calculateDiscount(totalPrice, couponCode);
      const discountedPrice = totalPrice - discount;

      setTotalPrice(discountedPrice);

      setBooking(prevBooking => ({
        ...prevBooking,
        couponCode: couponCode,
        discount: discount,
        totalAmount: discountedPrice,
      }));

      alert(`Áp dụng mã khuyến mãi thành công! Giảm giá: ${discount.toLocaleString()} VND`);
    } else {
      alert('Mã khuyến mãi không hợp lệ. Vui lòng thử lại.');
    }
  };
  const checkCouponCode = (couponCode) => {

    return couponCode.length === 6 && couponCode.startsWith('SALE');
  };

  const calculateDiscount = (totalPrice, couponCode) => {
    let discount = 0;


    if (couponCode === 'SALE10') {
      discount = totalPrice * 0.1; // Giảm giá 10%
    }

    return discount;
  };

  const isBookingDisabled = totalPrice <= 0;

  if (!roomTypes) {
    return <SpinComponents />;
  }


  return (
    <div style={{ marginTop: '20px' }}>

      <Table
        columns={columns}
        dataSource={roomTypes.roomTypes}
        rowKey="id"
        pagination={false}
        bordered
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'column', marginTop: '20px' }}>

        <Input type="text" placeholder="Nhập mã khuyến mãi..." style={{ padding: '5px', width: '200px', }} />
        <Button type="primary" style={{ width: '200px', marginTop: 10, marginBottom: 20 }} onClick={handleApplyCoupon}>
          Gửi
        </Button>


        <h4 style={{ marginRight: '20px' }}>Tổng số tiền: {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h4>
        <Button type="primary" disabled={isBookingDisabled} onClick={handleConfirmBooking} style={{ width: '200px' }}>
          Xác nhận đặt phòng
        </Button>
      </div>
    </div>
  );
};

export default RoomTypesTable;
