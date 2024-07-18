import { Button, DatePicker, Input, Modal, Select, Table, Tag } from 'antd';
import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { CiLocationOn } from 'react-icons/ci';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { axiosJson } from '../../axios/axiosCustomize';
import { toast } from 'react-toastify';
import SpinComponents from '../../Components/Spin';
import { EyeOutlined } from '@ant-design/icons';
const { Option } = Select;
dayjs.extend(customParseFormat);

const statusColors = {
  "-1": 'orange',
  0: 'green',
  1: 'blue',
  2: 'red',
};

const statusMap = {
  "-1": 'Thất bại',
  0: 'Đã thanh toán',
  1: 'Đã hoàn tất',
  2: 'Đã hủy',
};

const BookingManager = () => {

  const [province, setProvince] = useState();
  const [options, setOptions] = useState([]);
  const [dataFromApi, setDataFromApi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);

  const [checkInDate, setCheckInDate] = useState(dayjs());
  const [checkOutDate, setCheckOutDate] = useState(dayjs());
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
        const data = response.data.data;
        setDataFromApi(data);
        setOptions(data.map(item => ({ value: item.full_name, label: item.full_name })));
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  const handleSelectChange = (value, option) => {
    setProvince(option.label);
  };

  const handleSearch = (event) => {
    const value = event.target.value.trim().toLowerCase();

    // Kiểm tra nếu value không tồn tại
    if (!value) {
      setFilteredHotels(bookings); // Hiển thị lại danh sách ban đầu nếu không có giá trị tìm kiếm
      return;
    }

    const filteredData = bookings.filter(hotel => {
      const hotelNameMatch = hotel.hotelName && hotel.hotelName.toLowerCase().includes(value);
      const bookingCodeMatch = hotel.bookingCode && hotel.bookingCode.toLowerCase().includes(value); // Sử dụng includes thay vì ===
      return hotelNameMatch || bookingCodeMatch;
    });

    setFilteredHotels(filteredData);
  };


  const fetchBookings = async () => {
    if (!province) {
      alert('Vui lòng chọn một tỉnh thành.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosJson.get(`/Admin/get-booking-by-admin`, {
        params: {
          province,
          checkinDate: checkInDate,
          checkOutDate: checkOutDate,
        }
      });
      toast.success("Cập nhật thành công")
      setBookings(response.data);
      setFilteredHotels(response.data);
    } catch (error) {
      toast.error("Cập nhật thất bại")
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInChange = (date, dateString) => {
    setCheckInDate(date ? dayjs(date).format('YYYY-MM-DD') : null);
  };

  const handleCheckOutChange = (date, dateString) => {
    setCheckOutDate(date ? dayjs(date).format('YYYY-MM-DD') : null);
  };
  const [bookingDetail, setBookingDetail] = useState(null);
  const [modalVisibleDetail, setModalVisibleDetail] = useState(false);



  const handleCloseModal = () => {
    setModalVisibleDetail(false);
    setBookingDetail(null);
  };

  const handleDetailClick = async (bookingDetail) => {
    setBookingDetail(bookingDetail);
    setModalVisibleDetail(true)
    // try {
    //   const response = await axiosJson.get(`/Admin/get-hotel-detail-by-admin`, {
    //     params:
    //     {
    //       Id: hotelId
    //     }
    //   });

    //   setHotelDetail(response.data);
    //   setFileList(response.data.imageUrls.map((url, index) => ({
    //     uid: index,
    //     name: `image-${index}`,
    //     status: 'done',
    //     url: url
    //   })));

    //   setModalVisible(true);
    // } catch (error) {
    //   toast.error("Cập nhật thất bại")
    //   console.error('Error fetching hotels:', error);
    // } finally {
    //   setLoading(false);
    // }
  };
  const columns = [
    {
      title: 'Tên khách sạn',
      dataIndex: 'hotelName',
      key: 'hotelName',
    },
    {
      title: 'SDT KS',
      dataIndex: 'hotelPhoneNumber',
      key: 'hotelPhoneNumber',

    },
    {
      title: 'ID Booking',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
    },
    {
      title: 'Tên KH',
      dataIndex: 'customerName',
      key: 'CustomerName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tổng hóa đơn',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text) => (
        <span>{Number(text).toLocaleString('vi-VN')} VND</span>
      ),
    },
    {
      title: 'Hệ thống nhận được',
      dataIndex: 'commission',
      key: 'commission',
      render: (text) => (
        <span>{Number(text).toLocaleString('vi-VN')} VND</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <Button icon={<EyeOutlined />} onClick={() => handleDetailClick(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  const columnsDetails = [
    {
      title: 'Loại phòng',
      dataIndex: 'roomTypeName',
      key: 'roomTypeName',
    },
    {
      title: 'Tạm tính',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (text) => `${text.toLocaleString('vi-VN')} VND`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'roomCount',
      key: 'roomCount',
    },
  ];
  return (
    <>
      <Select
        showSearch
        style={{ width: 250 }}
        placeholder={
          <div style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 'normal', color: 'gray' }}>
            <CiLocationOn style={{ fontSize: 20, marginTop: -3, marginRight: 8 }} />
            Chọn khu vực ?
          </div>
        }
        optionFilterProp="label"
        loading={loading}
        filterOption={(input, option) =>
          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={handleSelectChange}
      >
        {dataFromApi.map((province) => (
          <Option key={province.id} value={province.full_name} label={province.full_name}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <CiLocationOn style={{ marginRight: 8 }} />
              <span>{province.full_name}</span>
            </div>
          </Option>
        ))}
      </Select>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, marginTop: 10 }}>
        <p style={{ display: 'flex', alignItems: 'center' }}>Ngày đến:</p>
        <DatePicker
          value={checkInDate ? dayjs(checkInDate, 'YYYY-MM-DD') : null}
          format={'DD-MM-YYYY'}
          placeholder={'Ngày đến'}
          onChange={handleCheckInChange}
          style={{ marginBottom: 16 }}
        />

        <p style={{ display: 'flex', alignItems: 'center' }}>Ngày đi:</p>
        <DatePicker
          value={checkOutDate ? dayjs(checkOutDate, 'YYYY-MM-DD') : null}
          format={'DD-MM-YYYY'}
          placeholder={'Ngày đi'}
          onChange={handleCheckOutChange}
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" onClick={fetchBookings} style={{ marginLeft: 16 }}>
          Lấy danh sách booking
        </Button>
      </div>

      <div>
        {bookings.length > 0 && (
          <Input
            placeholder="Tìm kiếm theo tên khách sạn, ID Booking"
            onChange={handleSearch}
            style={{ width: 250, marginTop: 20 }}
          />
        )}
      </div>
      {loading ? (
        <SpinComponents style={{ marginTop: 20 }} />
      ) : (
        <Table columns={columns} dataSource={filteredHotels} rowKey="id" style={{ margin: 10 }} />
      )}


      {bookingDetail && (
        <Modal
          title={`Chi tiết booking ${bookingDetail.bookingCode}`}
          visible={modalVisibleDetail}
          onOk={handleCloseModal}
          onCancel={handleCloseModal}
          width={'70%'}
        >
          <div style={{ display: 'flex', gap: 10 }}>
            <div>
              <p>Tên KH: {bookingDetail.customerName}</p>
              <p>Điện thoại: {bookingDetail.phoneNumber}</p>
              <p>Email: {bookingDetail.email}</p>
              <p>Số lượng người lớn: {bookingDetail.numberOfAdults} người</p>
              <p>Số lượng trẻ em: {bookingDetail.numberOfChildren} trẻ</p>
              <p>Ghi chú: {bookingDetail.note}</p>
              <p>Tạo ngày: {dayjs(bookingDetail.createDate).format('DD-MM-YYYY')}</p>
              <p>Ngày đến: {dayjs(bookingDetail.checkinDate).format('DD-MM-YYYY')}</p>
              <p>Ngày đi: {dayjs(bookingDetail.checkOutDate).format('DD-MM-YYYY')}</p>
              <p>Tạm tính: {bookingDetail && Number(bookingDetail.totalPrice).toLocaleString('vi-VN')} VND</p>
              <p>Giảm giá: {bookingDetail && Number(bookingDetail.discount).toLocaleString('vi-VN')} VND</p>
              <p>Tổng hóa đơn: {bookingDetail && Number(bookingDetail.totalAmount).toLocaleString('vi-VN')} VND</p>
              <p>Khách sạn nhận được: {bookingDetail && Number(bookingDetail.moneyReceived).toLocaleString('vi-VN')} VND</p>
              <p>Hệ thống nhận được: {bookingDetail && Number(bookingDetail.commission).toLocaleString('vi-VN')} VND</p>
              <p>Trạng thái: <Tag color={statusColors[bookingDetail.status]}>{statusMap[bookingDetail.status]}</Tag></p>
            </div>
            <div>
              <p>Khách sạn: {bookingDetail.hotelName}</p>
              <p>Liên hệ: {bookingDetail.hotelPhoneNumber}</p>
              <p>Email: {bookingDetail.hotelEmail}</p>
              <p>Địa chỉ: {bookingDetail.hotelAddress} </p>
            </div>
          </div>
          {bookingDetail.bookingDetails && (
            <div>
              <p><strong>Chi tiết phòng:</strong></p>
              <Table columns={columnsDetails} dataSource={bookingDetail.bookingDetails} />
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default BookingManager;