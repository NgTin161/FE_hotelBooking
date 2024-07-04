import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Row, Col, TimePicker, Button, Upload, Modal, Descriptions, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';
import axios from 'axios';
import { axiosJson } from '../../../axios/axiosCustomize';
import { AuthContext } from '../../../axios/AuthContext';
import { useContext } from 'react';

const { Option } = Select;

const mockData = {
  hotelName: 'Khách sạn XYZ',
  stars: 4,
  fullAddress: 'ABC Cao Thắng',
  checkInTime: '14:00',
  checkOutTime: '12:00',
  description: '<p>Khách sạn ABC </p>',
  images: [
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://via.placeholder.com/200',
    }
  ]
};

const Information = () => {
  const { user } = useContext(AuthContext);

  console.log('userINfor', user);
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [formValues, setFormValues] = useState(mockData);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [street, setStreet] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);



  const [hotel, setHotel] = useState();


  useEffect(() => {
    if (user && user.id) {
      console.log('userINfor', user); // Kiểm tra thông tin user
      fetchHotel(user.id);
    } else {
      console.log('User không có ID hoặc không tồn tại');
    }
  }, [user]); // Chỉ gọi fetchHotel khi user đã được xác định


  const fetchHotel = async (userId) => {
    try {
      const response = await axiosJson.get(`/Hotels/getHotelByOwner?IdUser=${userId}`);
      if (response.status === 200) {
        console.log(response.data)
        setHotel(response.data);
        localStorage.setItem('hotelId', response.data.id); // Lưu hotelId vào localStorage
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
    const province = provinces.find(province => province.id === value)?.name || '';
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
    const district = districts.find(district => district.id === value)?.name || '';
    setSelectedDistrict(district);
    axios.get(`https://esgoo.net/api-tinhthanh/3/${value}.htm`)
      .then(response => {
        setWards(response.data.data);
        setSelectedWard('');
      })
      .catch(error => console.error("There was an error fetching the wards!", error));
  };

  const handleWardChange = (value) => {
    const ward = wards.find(ward => ward.id === value)?.name || '';
    setSelectedWard(ward);
  };

  const handleStreetChange = (event) => {
    const newValue = event.target.value;
    setStreet(newValue);
  };

  const handleFinish = (values) => {
    setFormValues({
      ...values,
      checkInTime: values.checkInTime.format('HH:mm'),
      checkOutTime: values.checkOutTime.format('HH:mm'),
      description: values.description,
      images: values.upload.fileList
    });
    setIsModalVisible(false);
  };

  useEffect(() => {
    const address = `${selectedProvince}, ${selectedDistrict}, ${selectedWard}, ${street}`;
    setFullAddress(address);
  }, [selectedProvince, selectedDistrict, selectedWard, street]);

  useEffect(() => {
    form.setFieldsValue({
      ...formValues,
      checkInTime: moment(formValues.checkInTime, 'HH:mm'),
      checkOutTime: moment(formValues.checkOutTime, 'HH:mm'),
      specificAddress: fullAddress
    });
  }, [fullAddress, formValues, form]);

  return (
    <div>
      <p>Hoạt động: <Switch> </Switch></p>
      <Descriptions title="Thông tin khách sạn" bordered>
        <Descriptions.Item label="Tên khách sạn">{formValues.hotelName}</Descriptions.Item>
        <Descriptions.Item label="Số sao">{formValues.stars}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">{formValues.fullAddress}</Descriptions.Item>
        <Descriptions.Item label="Check-In">{formValues.checkInTime}</Descriptions.Item>
        <Descriptions.Item label="Check-Out">{formValues.checkOutTime}</Descriptions.Item>
        <Descriptions.Item label="Miêu tả">
          <div dangerouslySetInnerHTML={{ __html: formValues.description }} />
        </Descriptions.Item>
        <Descriptions.Item label="Hình ảnh">
          {formValues.images.map(image => (
            <img key={image.uid} src={image.url} alt={image.name} style={{ width: '100px', marginRight: '10px' }} />
          ))}
        </Descriptions.Item>
      </Descriptions>

      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginTop: '16px' }}>
        Chỉnh sửa thông tin khách sạn
      </Button>


      <Modal
        title="Edit Hotel Information"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width='60%'
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
                    <Option key={province.id} value={province.id}>{province.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Quận/Huyện" name="district">
                <Select onChange={handleDistrictChange}>
                  <Option value="">Chọn Quận/Huyện</Option>
                  {districts.map((district) => (
                    <Option key={district.id} value={district.id}>{district.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Phường/Xã" name="ward">
                <Select onChange={handleWardChange}>
                  <Option value="">Chọn Phường/Xã</Option>
                  {wards.map((ward) => (
                    <Option key={ward.id} value={ward.id}>{ward.name}</Option>
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

          <Form.Item label="Địa chỉ cụ thể" name="specificAddress">
            <Input value={fullAddress} readOnly />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giờ nhận phòng"
                name="checkInTime"
                rules={[{ required: true, message: 'Vui lòng chọn giờ nhận phòng!' }]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Giờ trả phòng"
                name="checkOutTime"
                rules={[{ required: true, message: 'Vui lòng chọn giờ trả phòng!' }]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả khách sạn" name="description">
            <Editor
              apiKey="0a6bh6skphg9vhlesue4sqiejdqnhp4paz9j1pj0c7js3u5b"
              init={{
                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
              }}
            />
          </Form.Item>

          <Form.Item label="Upload hình ảnh khách sạn" name="upload">
            <Upload
              listType="picture"
              defaultFileList={formValues.images}
              beforeUpload={() => false}
              onChange={(info) => form.setFieldsValue({ upload: { fileList: info.fileList } })}
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Information;
