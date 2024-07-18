import { Button, Select, Table, Spin, Input, Modal, Col, Image } from 'antd';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { CiLocationOn } from 'react-icons/ci';
import SpinComponents from '../../Components/Spin';
import { axiosJson } from '../../axios/axiosCustomize';
import { EyeOutlined } from '@ant-design/icons';

import { toast } from 'react-toastify';
import parse, { domToReact } from 'html-react-parser';
const { Option } = Select;

const HotelManager = () => {
  const [province, setProvince] = useState();
  const [options, setOptions] = useState([]);
  const [dataFromApi, setDataFromApi] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(false);


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

  const fetchHotels = async () => {
    if (!province) {
      alert('Vui lòng chọn một tỉnh thành.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosJson.get(`/Admin/get-hotel-by-admin-on-the-location`, {
        params: { province }
      });
      toast.success("Cập nhật thành công")
      setHotels(response.data);
      setFilteredHotels(response.data);
    } catch (error) {
      toast.error("Cập nhật thất bại")
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;

    // Kiểm tra nếu value không tồn tại
    if (!value) {
      setFilteredHotels(hotels); // Hiển thị lại danh sách ban đầu nếu không có giá trị tìm kiếm
      return;
    }

    const filteredData = hotels.filter(hotel =>
      hotel.hotelName && hotel.hotelName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredHotels(filteredData);
  };

  const [hotelDetail, setHotelDetail] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [fileList, setFileList] = useState([])
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [modalVisibleDetail, setModalVisibleDetail] = useState(false);
  const handleDetailClick = async (hotelId) => {
    try {
      const response = await axiosJson.get(`/Admin/get-hotel-detail-by-admin`, {
        params:
        {
          Id: hotelId
        }
      });

      setHotelDetail(response.data);
      setFileList(response.data.imageUrls.map((url, index) => ({
        uid: index,
        name: `image-${index}`,
        status: 'done',
        url: url
      })));

      setModalVisible(true);
    } catch (error) {
      toast.error("Cập nhật thất bại")
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetailRoomTypeClick = (roomType) => {
    setSelectedRoomType(roomType);
    setModalVisibleDetail(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setHotelDetail(null);
  };

  const handleCloseModalDetail = () => {
    setModalVisibleDetail(false);
    setSelectedRoomType(null);// Clear hotelDetail when closing modal
  };

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'imageUrl',
      key: 'ImageUrl',
      render: text => <img src={text} alt="Hotel" style={{ width: 100 }} />,
    },
    {
      title: 'Tên khách sạn',
      dataIndex: 'hotelName',
      key: 'HotelName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'Email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'PhoneNumber',
    },
    {
      title: 'Rating',
      dataIndex: 'ratingStarts',
      key: 'RatingStarts',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'Address',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'IsActive',
      render: text => (text ? 'Còn hoạt động' : 'Ngừng hoạt động'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <Button icon={<EyeOutlined />} onClick={() => handleDetailClick(record.id)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  const convertHtmlToParagraphs = (htmlString) => {
    if (typeof htmlString !== 'string') {
      return '';
    }
    // Loại bỏ các thẻ không phải là <p> và thay thế chúng bằng thẻ <p>
    return htmlString.replace(/<(\/?)(h[1-6]|ul|li|ol|div|span|a|img|strong|em|blockquote|code|pre)[^>]*>/gi, '<$1p>');
  };

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
      <Button type="primary" onClick={fetchHotels} style={{ marginLeft: 16 }}>
        Lấy danh sách khách sạn
      </Button>
      <div>
        {hotels.length > 0 && (
          <Input
            placeholder="Tìm kiếm theo tên khách sạn"
            onChange={handleSearch}
            style={{ width: 250, marginTop: 20 }}
          />
        )}
      </div>
      {loading ? (
        <SpinComponents style={{ marginTop: 20 }} />
      ) : (
        <Table columns={columns} dataSource={filteredHotels} rowKey="id" style={{ marginTop: 20 }} />
      )}
      <Modal
        visible={modalVisible}
        title="Chi tiết khách sạn"
        onCancel={handleCloseModal}
        width={'70%'}
      >
        {hotelDetail && (
          <>
            <h2>{hotelDetail.hotelName}</h2>
            <p>Email: {hotelDetail.email}</p>
            <p>Địa chỉ: {hotelDetail.address}</p>
            <p>SDT: {hotelDetail.phoneNumber}</p>
            <p>Miêu tả: </p>
            <div dangerouslySetInnerHTML={{ __html: convertHtmlToParagraphs(hotelDetail.description) }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <p>Giờ checkin: {hotelDetail.checkinTime} </p>
              <p>Giờ checkout: {hotelDetail.checkoutTime} </p>
            </div>
            <h5>Dịch vụ tổng quát:</h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              <span>Chấp nhận trẻ em: {hotelDetail.acceptChildren ? 'Có' : 'Không'}</span>
              <span>Chấp nhận thú cưng: {hotelDetail.acceptPet ? 'Có' : 'Không'}</span>
              <span>Hỗ trợ người khuyết tật: {hotelDetail.supportPeopleWithDisabilities ? 'Có' : 'Không'}</span>
              <span>Có thang máy: {hotelDetail.haveElevator ? 'Có' : 'Không'}</span>
              <span>Có hồ bơi: {hotelDetail.haveSwimmingPool ? 'Có' : 'Không'}</span>
            </div>
            <h5>Thông tin tài khoản:</h5>
            <p><strong>Tên ngân hàng</strong> {hotelDetail.bankName}</p>
            <p><strong>Số tài khoản</strong> {hotelDetail.accountNumber}</p>
            <p>Hỉnh ảnh</p>
            <div style={{ display: 'flex', gap: 5 }}>

              {hotelDetail?.imageUrls?.map((url, index) => (

                <Image
                  width={100}
                  src={url}
                  alt={`hotel-image-${index}`}
                />
              ))}
            </div>
            <p>Loại phòng:</p>
            <Table
              dataSource={hotelDetail.roomTypes}
              columns={[
                { title: 'Ảnh', dataIndex: 'imageURL', render: imageURL => <Image src={imageURL} width={80} />, },
                { title: 'Tên loại phòng', dataIndex: 'name', key: 'Name' },
                { title: 'Sức chứa tối đa', dataIndex: 'maxPeople', key: 'MaxPeople' },
                { title: 'Tổng số phòng', dataIndex: 'totalRoom', key: 'TotalRoom' },
                {
                  title: 'Hành động',
                  key: 'action',
                  render: (text, record) => (
                    <Button icon={<EyeOutlined />} onClick={() => handleDetailRoomTypeClick(record)}>
                      Chi tiết
                    </Button>
                  ),
                },
              ]}
              pagination={false}
            />
          </>
        )}
      </Modal>
      {selectedRoomType && (
        <Modal
          title={`Chi tiết loại phòng: ${selectedRoomType.name}`}
          visible={modalVisibleDetail}
          onOk={handleCloseModalDetail}
          onCancel={handleCloseModalDetail}
        >
          <p>Tên loại phòng: {selectedRoomType.name}</p>
          <Image src={selectedRoomType.imageURL} width={200} />
          <p>Sức chứa tối đa: {selectedRoomType.maxPeople}</p>
          <p>Tổng số phòng: {selectedRoomType.totalRoom}</p>
          <p>Giá: {selectedRoomType.price}</p>
          <p>Giá cuối tuần: {selectedRoomType.weekendPrice}</p>
          <p>Giá ngày lễ: {selectedRoomType.holidayPrice}</p>
          <p>Số giường: {selectedRoomType.numberOfBed}</p>
          <p>Số phòng trống: {selectedRoomType.availableRooms}</p>
          <p>Nước uống miễn phí: {selectedRoomType.haveFreeDrinkWater ? 'Có' : 'Không'}</p>
          <p>Mini bar: {selectedRoomType.haveMiniBar ? 'Có' : 'Không'}</p>
          <p>Máy treo quần áo: {selectedRoomType.haveClothesHanger ? 'Có' : 'Không'}</p>
          <p>Tủ quần áo: {selectedRoomType.haveClosets ? 'Có' : 'Không'}</p>
          <p>Bồn tắm và vòi hoa sen: {selectedRoomType.haveBathtubAndShower ? 'Có' : 'Không'}</p>
          <p>Điều hòa không khí: {selectedRoomType.haveAirConditioner ? 'Có' : 'Không'}</p>
          <p>Ban công: {selectedRoomType.haveBalcony ? 'Có' : 'Không'}</p>
          <p>TV màn hình: {selectedRoomType.haveTvScreen ? 'Có' : 'Không'}</p>
          <p>Wi-Fi miễn phí: {selectedRoomType.haveFreeWifi ? 'Có' : 'Không'}</p>
          <p>Không hút thuốc: {selectedRoomType.haveNoSmoking ? 'Có' : 'Không'}</p>
          <p>Bữa sáng miễn phí: {selectedRoomType.haveFreeBreakfast ? 'Có' : 'Không'}</p>
          <p>Dọn phòng miễn phí: {selectedRoomType.haveFreeCleaningRoom ? 'Có' : 'Không'}</p>
          <p>Giặt là miễn phí: {selectedRoomType.haveFreeLaundry ? 'Có' : 'Không'}</p>
          <p>View đẹp: {selectedRoomType.haveNiceView ? 'Có' : 'Không'}</p>
        </Modal>
      )}
    </>
  );
};

export default HotelManager;
