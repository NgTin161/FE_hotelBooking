import React, { useEffect, useRef, useState, } from 'react';
import { Form, Input, Select, Row, Col, TimePicker, Button, Upload, Modal, Descriptions, Switch, Card, InputNumber, Checkbox, Divider, Typography, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import moment from 'moment';
import axios from 'axios';
import { Option } from 'antd/es/mentions';
import _ from 'lodash';
import dayjs from 'dayjs';
import { axiosFormData } from '../axios/axiosCustomize';
import Meta from 'antd/es/card/Meta';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';


const HotelRegister = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState();
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    setToken(jwt);

    if (!jwt) {
      toast.info('Bạn phải đăng nhập trước tiên')
      navigate('/login');
    } else {
      const decoded = jwtDecode(jwt);
      setDecodedToken(decoded);
    }
  }, [navigate]);

  const email = decodedToken ? decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] : null;

  const editorRef = useRef(null);
  const [form] = Form.useForm();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  // const [formValues, setFormValues] = useState(mockData);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [street, setStreet] = useState('');
  const [fullAddress, setFullAddress] = useState('');




  // lấy tỉnh thành chi tiết
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
    console.log('district', district)
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

  const [fileList, setFileList] = useState([]);

  const handleChange = ({ fileList }) => setFileList(fileList);


  useEffect(() => {
    const address = `${street}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;
    setFullAddress(address);
    form.setFieldsValue({ address: address }); // Cập nhật giá trị của form field
    console.log(address); // Log the full address to the console
  }, [street, selectedDistrict, selectedWard, selectedProvince]);
  const handleFinish = async (values) => {
    // Kiểm tra và lấy nội dung từ editor
    const description = editorRef.current ? editorRef.current.getContent() : '';

    // Định dạng thời gian CheckinTime và CheckoutTime
    const CheckinTime = dayjs(values.CheckinTime).format('HH:mm');
    const CheckoutTime = dayjs(values.CheckoutTime).format('HH:mm');


    // Chọn những giá trị cần thiết từ values và mặc định giá trị cho các checkbox nếu không có
    const pickedValues = _.pick(values, [
      'bankName', 'accountNumber', 'hotelName', 'email', 'phoneNumber', 'ratingStarts', 'address',
      'acceptChildren', 'acceptPet', 'supportPeopleWithDisabilities', 'haveElevator', 'haveSwimmingPool'
    ]);

    // Mặc định giá trị cho các checkbox nếu không được chọn
    pickedValues.acceptChildren = pickedValues.acceptChildren || false;
    pickedValues.acceptPet = pickedValues.acceptPet || false;
    pickedValues.supportPeopleWithDisabilities = pickedValues.supportPeopleWithDisabilities || false;
    pickedValues.haveElevator = pickedValues.haveElevator || false;
    pickedValues.haveSwimmingPool = pickedValues.haveSwimmingPool || false;

    // Tạo FormData để gửi đi
    const formData = new FormData();

    // Đưa các giá trị đã chọn từ values vào formData
    Object.keys(pickedValues).forEach(key => {
      formData.append(key, pickedValues[key]);
    });

    // Thêm description, CheckinTime, CheckoutTime vào formData
    formData.append('description', description);
    formData.append('CheckinTime', CheckinTime);
    formData.append('CheckoutTime', CheckoutTime);
    formData.append('province', selectedProvince);

    // Thêm các file từ fileList vào formData (nếu có)
    if (fileList && fileList.length > 0) {
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('imageFiles', file.originFileObj);
        }
      });
    }

    // Gửi yêu cầu POST bằng Axios
    try {
      const response = await axiosFormData.post('/Hotels', formData, {
        params: {
          email: email
        }
      });
      console.log('Create Hotel Response:', response.data);
      toast.success('Tạo khách sạn thành công! Vui lòng đăng nhập lại, tạo phòng và bắt đầu khách sạn của bạn');
      localStorage.removeItem('jwt');
      // Chuyển hướng về trang chủ sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error creating hotel:', error);
      message.error('Có lỗi xảy ra khi tạo khách sạn.');
    }
  };


  return (

    <div className="body-booking">


      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ width: '80%' }}>
          <Meta title="ĐĂNG KÝ KHÁCH SẠN CỦA BẠN"></Meta>
          <Form form={form}
            onFinish={handleFinish}
            layout="vertical">
            <Form.Item
              label="Tên khách sạn"
              name="hotelName"
              rules={[{ required: true, message: 'Vui lòng nhập tên khách sạn!' }]}
            >
              <Input />
            </Form.Item>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Điện thoại khách sạn"
                  name="phoneNumber"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có đúng 10 chữ số!' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label="Số sao"
                  name="ratingStarts"
                  rules={[{ required: true, message: 'Vui lòng chọn số sao!' }]}
                >
                  <Select>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Option key={star} value={star}>{star}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

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
                  <Input onChange={handleStreetChange} value={street} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Địa chỉ cụ thể" name="address">
              <Input value={fullAddress} readOnly />
            </Form.Item>

            <Row gutter={12}>
              <Col span={4}>
                <Form.Item
                  label="Giờ nhận phòng"
                  name="CheckinTime"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ nhận phòng!' }]}
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="Giờ trả phòng"
                  name="CheckoutTime"
                  rules={[{ required: true, message: 'Vui lòng chọn giờ trả phòng!' }]}
                >
                  <TimePicker format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>
            <Divider />

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
            <Form.Item label="Mô tả khách sạn" name="description">
              <Editor
                onInit={(evt, editor) => editorRef.current = editor}
                apiKey="0a6bh6skphg9vhlesue4sqiejdqnhp4paz9j1pj0c7js3u5b"
                init={{
                  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker',
                  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                }}
              />
            </Form.Item>
            <Typography.Title level={5}>Thông tin tài khoản</Typography.Title>
            <div style={{ display: 'flex', gap: 20 }}>
              <Form.Item label="Tên ngân hàng " name="bankName">
                <Input />
              </Form.Item>
              <Form.Item label="Số tài khoản" name="accountNumber">
                <Input />
              </Form.Item>
            </div>
            <Form.Item label="Upload hình ảnh khách sạn" name="upload">
              <Upload
                multiple
                listType="picture-card"
                maxCount={8}
                fileList={fileList}
                // defaultFileList={formValues.images}
                beforeUpload={() => false}
                onChange={handleChange}
                accept="image/*"
              >
                <Button>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Tạo khách sạn
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>

  )
}
export default HotelRegister;