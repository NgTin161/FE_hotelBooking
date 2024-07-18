import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Select, Row, Col, TimePicker, Button, Upload, Modal, Descriptions, Switch, Card, Image, Typography, Rate, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';
import axios from 'axios';
import { axiosJson } from '../../../axios/axiosCustomize';
import { AuthContext } from '../../../axios/AuthContext';
import { useContext } from 'react';
import dayjs from 'dayjs';
import SpinComponents from '../../../Components/Spin';
import ReactQuill from 'react-quill';
import '../../../../node_modules/react-quill/dist/quill.snow.css';
import { toast } from 'react-toastify';

const { Option } = Select;

const mockData = {
  hotelName: "The IMPERIAL Vung Tau Hotel",
  email: "tinnguyentrung2002@gmail.com",
  phoneNumber: "0902427957",
  ratingStarts: 5,
  province: "Tỉnh Bà Rịa - Vũng Tàu",
  address: "159 Thùy Vân, Phường Thắng Tam, Thành phố Vũng Tàu",
  location: {
    latitude: 10.34327498700003,
    longitude: 107.09471604300006
  },
  checkinTime: "11:00:00",
  checkoutTime: "14:00:00",
  description: "<pn>Khách sạn sang n<ulhách rng, dịch vụ    <li>Dining Room: Đồ ăn quốc tế và Việt Nam.</li>\r\n    <li>Hải sản: Hải sản tươi sống.</li>\r\n    <li>Lobby Lounge: Trà, cocktail, nhạc sống.</li>\r\n</ul>\r\n\r\n<h5>Tiện nghi</h5>\r\n<ul>\r\n    <li>Spa: Liệu pháp làm đẹp.</li>\r\n    <li>Gym: Thiết bị hiện đại.</li>\r\n    <li>Bể bơi: Bể vô cực, quầy bar.</li>\r\n    <li>Kinh doanh: Phòng họp, internet tốc độ cao.</li>\r\n</ul>\r\n\r\n<h5>Liên hệ</h5>\r\n<p>\r\n    159 Thùy Vân, Thắng Tam, Vũng Tàu, Bà Rịa - Vũng Tàu<br>\r\n    +84 254 362 8888<br>\r\n    reservations@imperialhotel.vn<br>\r\n    <a href=\"http://www.imperialhotel.vn\" target=\"_blank\">imperialhotel.vn</a>\r\n</p>",
  acceptChildren: true,
  acceptPet: false,
  supportPeopleWithDisabilities: true,
  haveElevator: true,
  haveSwimmingPool: true,
  imageUrls: [
    "https://localhost:7186/Images/71d05988-0136-4468-bfd5-4956e4ccbb04/8692acce-3762-45ae-bcf5-e839aaf4d093.jpg",
    "https://localhost:7186/Images/71d05988-0136-4468-bfd5-4956e4ccbb04/20653917-d669-4149-87f1-cf43f65b5ef5.jpg",
    "https://localhost:7186/Images/71d05988-0136-4468-bfd5-4956e4ccbb04/5f6af434-5261-4e1f-b750-ff5788b1e65a.jpg",
    "https://localhost:7186/Images/71d05988-0136-4468-bfd5-4956e4ccbb04/235125b6-d70f-47a7-a0c1-0cc07f8d70fe.jpg",
    "https://localhost:7186/Images/71d05988-0136-4468-bfd5-4956e4ccbb04/9a68950e-7efc-46cc-bea3-5dba452de490.jpg"
  ],
  isActive: true
};

const Information = () => {
  const { user } = useContext(AuthContext);

  const reactQuillRef = useRef < ReactQuill > (null);
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [formValues, setFormValues] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [street, setStreet] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([])

  const [hotel, setHotel] = useState();


  useEffect(() => {
    if (user && user.id) {
      fetchHotel(user.id);
    } else {
      console.log('User không có ID hoặc không tồn tại');
    }
  }, [user]); // Chỉ gọi fetchHotel khi user đã được xác định


  const fetchHotel = async (userId) => {
    try {
      const response = await axiosJson.get(`/Owner/get-hotel-by-owner`, {
        params: {
          userId: userId,
        },
      });
      if (response.status === 200) {
        setHotel(response.data);
        console.log(response.data);
        setFormValues(response.data); // Set formValues after hotel data is fetched
        setFileList(response.data.imageUrls.map((url, index) => ({
          uid: index,
          name: `image-${index}`,
          status: 'done',
          url: url
        })));


      } else {
        console.log('Có lỗi xảy ra khi lấy thông tin khách sạn');
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
    }
  };


  useEffect(() => {
    axios.get(`https://esgoo.net/api-tinhthanh/1/0.htm`)
      .then(response => setProvinces(response.data.data))
      .catch(error => console.error("There was an error fetching the provinces!", error));
  }, []);

  const handleProvinceChange = (value) => {
    const province = provinces.find(province => province.id === value)?.full_name || '';
    setSelectedProvince(province);
    axios.get(`https://esgoo.net/api-tinhthanh/2/${value}.htm`)
      .then(response => {
        setDistricts(response.data.data);
        setWards([]);
        setSelectedDistrict('');
        setSelectedWard('');
      })
      .catch(error => console.error("There was an error fetching the districts!", error));
  };

  const handleDistrictChange = (value) => {
    const district = districts.find(district => district.id === value)?.full_name || '';
    setSelectedDistrict(district);
    axios.get(`https://esgoo.net/api-tinhthanh/3/${value}.htm`)
      .then(response => {
        setWards(response.data.data);
        setSelectedWard('');
      })
      .catch(error => console.error("There was an error fetching the wards!", error));
  };

  const handleWardChange = (value) => {
    const ward = wards.find(ward => ward.id === value)?.full_name || '';
    setSelectedWard(ward);
  };

  const handleStreetChange = (event) => {
    const newValue = event.target.value;
    setStreet(newValue);
  };

  const handleFinish = (values) => {

    const CheckinTime = dayjs(values.checkinTime).format('HH:mm');
    const CheckoutTime = dayjs(values.CheckoutTime).format('HH:mm');
    setFormValues({
      ...values,
      description: values.description,
      images: values.upload.fileList
    });
    console.log(values)
    // setIsModalVisible(false);
  };


  useEffect(() => {
    const address = `${street}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;
    setFullAddress(address);
    form.setFieldsValue({ address: address });
  }, [selectedProvince, selectedDistrict, selectedWard, street]);

  if (!hotel || !formValues) {
    return <SpinComponents />;
  };

  const handleOpenModal = () => {

    setIsModalVisible(true);
    form.setFieldsValue({
      hotelName: hotel?.hotelName,
      stars: hotel?.ratingStarts,
      fullAddress: hotel?.address,
      province: hotel?.province,
      checkinTime: dayjs(hotel?.checkinTime, 'HH:mm'),
      checkoutTime: dayjs(hotel?.checkoutTime, 'HH:mm'),
      acceptChildren: hotel?.acceptChildren,
      acceptPet: hotel?.acceptPet,
      supportPeopleWithDisabilities: hotel?.supportPeopleWithDisabilities,
      haveElevator: hotel?.haveElevator,
      haveSwimmingPool: hotel?.haveSwimmingPool,
      description: hotel?.description,
      upload: fileList
    });
  };



  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  const handleRemove = (file) => {
    setFileList(fileList.filter((item) => item.uid !== file.uid));
  };

  const handleStatusChange = async () => {
    try {
      if (!user || !user.id) {
        console.log('User or user.id is not available');
        return;
      }

      console.log('Attempting to toggle hotel status for userId:', user.id);

      const response = await axiosJson.post(`/Owner/hotel-status?userId=${user.id}`);
      // Assuming userId should be part of URL path based on RESTful conventions

      if (response.status === 200) {
        toast.success("Cập nhật thành công");
        // Optionally update local state after successful update
        fetchHotel(user.id); // Ensure fetchHotel updates the hotel data after toggle
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật trạng thái khách sạn");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái khách sạn:", error);
      toast.error("Có lỗi xảy ra");
    }
  };
  return (
    <>
      <div>
        Hoạt động: <Switch checked={hotel?.isActive} onChange={handleStatusChange} />

        <Typography.Title level={5}>Thông tin khách sạn</Typography.Title>

        <p><strong>Tên khách sạn:</strong> {hotel?.hotelName}</p>

        <p><strong>Số sao:</strong><Rate disabled value={hotel?.ratingStarts} /></p>

        <p><strong>Địa chỉ:</strong> {hotel?.address}</p>

        <div style={{ display: 'flex', gap: 10 }}>
          <p><strong>Giờ checkin:</strong> {hotel?.checkinTime}</p>

          <p><strong>Giờ checkout:</strong> {hotel?.checkoutTime}</p>
        </div>
        <p><strong>Miêu tả:</strong></p>
        <Card style={{ border: '1px solid', marginBottom: 10 }}>
          <div dangerouslySetInnerHTML={{ __html: hotel?.description }} />
        </Card>

        <h5>Thông tin tài khoản:</h5>
        <p><strong>Tên ngân hàng</strong> {hotel?.bankName}</p>
        <p><strong>Số tài khoản</strong> {hotel?.accountNumber}</p>
        <span><strong>Hình ảnh:</strong></span>
        <Row gutter={[8, 8]}>
          {hotel?.imageUrls.map((url, index) => (
            <Col key={index}>
              <Image
                width={100}
                src={url}
                alt={`hotel-image-${index}`}
              />
            </Col>
          ))}
        </Row>



        <Button type="primary" onClick={handleOpenModal} style={{ marginTop: '16px' }}>
          Chỉnh sửa thông tin khách sạn
        </Button>


        <Modal
          title="Chỉnh sửa thông tin khách sạn"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width='70%'
        >
          <Form form={form} onFinish={handleFinish} layout="vertical">
            <Form.Item
              label="Tên khách sạn"
              name="hotelName"
              rules={[{ required: true, message: 'Vui lòng nhập tên khách sạn!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Sao"
              name="stars"
              rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
            >
              <Select>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Option key={star} value={star}>{star}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Địa chỉ hiện tại" name="fullAddress">
              <Input value={fullAddress} readOnly />
            </Form.Item>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Tỉnh/Thành phố" name="province">
                  <Select onChange={handleProvinceChange}>
                    <Option value="">Chọn Tỉnh/Thành phố</Option>
                    {provinces.map((province) => (
                      <Option key={province.id} value={province.id}>{province.full_name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Quận/Huyện" name="district">
                  <Select onChange={handleDistrictChange}>
                    <Option value="">Chọn Quận/Huyện</Option>
                    {districts.map((district) => (
                      <Option key={district.id} value={district.id}>{district.full_name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Phường/Xã" name="ward">
                  <Select onChange={handleWardChange}>
                    <Option value="">Chọn Phường/Xã</Option>
                    {wards.map((ward) => (
                      <Option key={ward.id} value={ward.id}>{ward.full_name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Số/Tên đường" name="street">
                  <Input onChange={handleStreetChange} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Địa chỉ mới" name="address">
              <Input value={fullAddress} readOnly />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Giờ nhận phòng"
                  name="checkinTime"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ nhận phòng!' }]}
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Giờ trả phòng"
                  name="checkoutTime"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ trả phòng!' }]}
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>

            <Typography.Title level={5}>Chọn dịch vụ bao quát của khách sạn:</Typography.Title>
            <Row gutter={12}>

              <Form.Item name="acceptChildren" valuePropName="checked">
                <Checkbox>Chấp nhận trẻ em</Checkbox>
              </Form.Item>
              <Form.Item name="acceptPet" valuePropName="checked">
                <Checkbox>Chấp nhận thú cưng</Checkbox>
              </Form.Item>
              <Form.Item name="supportPeopleWithDisabilities" valuePropName="checked">
                <Checkbox>Hỗ trợ người khuyết tật</Checkbox>
              </Form.Item>
              <Form.Item name="haveElevator" valuePropName="checked">
                <Checkbox>Có thang máy</Checkbox>
              </Form.Item>
              <Form.Item name="haveSwimmingPool" valuePropName="checked">
                <Checkbox>Có bể bơi</Checkbox>
              </Form.Item>
            </Row>
            <Typography.Title level={5}>Thông tin tài khoản</Typography.Title>
            <div style={{ display: 'flex', gap: 20 }}>
              <Form.Item label="Tên ngân hàng " name="bankName">
                <Input />
              </Form.Item>
              <Form.Item label="Số tài khoản" name="accountNumber">
                <Input />
              </Form.Item>
            </div>
            <Form.Item
              label="Miêu tả"
              name="description"
              rules={[{ required: true, message: 'Vui lòng nhập miêu tả!' }]}
            >
              <ReactQuill
                ref={reactQuillRef}
                modules={{
                  toolbar: [
                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                    [{ size: [] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' },
                    { 'indent': '-1' }, { 'indent': '+1' }],
                    ['link', 'image', 'video'],
                    ['clean']
                  ],
                }}

              />
            </Form.Item>

            <Form.Item label="Upload hình ảnh khách sạn" name="upload">
              <Upload
                multiple
                maxCount={8}
                listType="picture-card"
                fileList={fileList}
                beforeUpload={() => false}
                onChange={handleUploadChange}
                onRemove={handleRemove}

              >
                <Button icon={<UploadOutlined />}>Chọn file</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Thay đổi
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div >
    </>
  );
};

export default Information;
