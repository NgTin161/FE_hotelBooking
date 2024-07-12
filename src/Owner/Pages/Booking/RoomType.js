import React, { useContext, useEffect, useState } from 'react';
import { Table, Switch, Button, Modal, Form, Input, InputNumber, Checkbox, Upload, Row, Col, Typography, Image } from 'antd';
import { EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { AuthContext } from '../../../axios/AuthContext';
import { axiosFormData, axiosJson } from '../../../axios/axiosCustomize';
import { IoMdPerson } from 'react-icons/io';
import { toast } from 'react-toastify';

const RoomType = () => {
  const { user } = useContext(AuthContext);
  const [roomTypes, setRoomTypes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [editRoomType] = Form.useForm();
  const [addRoomType] = Form.useForm();


  useEffect(() => {
    if (user && user.id) {
      fetchRoomTypes(user.id);
    } else {
      console.log('User không có ID hoặc không tồn tại');
    }
  }, [user]); // Chỉ gọi fetchHotel khi user đã được xác định


  const fetchRoomTypes = async (userId) => {
    try {
      const response = await axiosJson.get(`/Owner/get-room-types-by-owner`, {
        params: {
          userId: userId,
        },
      });
      if (response.status === 200) {
        setRoomTypes(response.data);
        console.log(response.data);

      } else {
        console.log('Có lỗi xảy ra khi lấy thông tin khách sạn');
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
    }
  };

  const showEditModalHandler = (room) => {
    setCurrentRoom(room);
    setFileList(room?.imageURL ? [{ uid: '-1', name: 'Image', status: 'done', url: room.imageURL }] : []);
    editRoomType.setFieldsValue(room || {});
    setShowEditModal(true);
  };

  const showAddModalHandler = () => {
    setShowAddModal(true);
  };


  const handleAddModalOk = () => {
    addRoomType
      .validateFields()
      .then(values => {
        addRoomTypeAPI(values);
        setShowAddModal(false);
        addRoomType.resetFields();
      })
      .catch(errorInfo => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const handleEditModalOk = () => {
    editRoomType
      .validateFields()
      .then(values => {
        updateRoomTypeAPI(currentRoom.id, values);
        setShowEditModal(false);
        setCurrentRoom(null);
        editRoomType.resetFields();
      })
      .catch(errorInfo => {
        console.log('Validation failed:', errorInfo);
      });
  };


  const handleCancel = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setCurrentRoom(null);
    setFileList([])
    editRoomType.resetFields();
    addRoomType.resetFields();
  };

  const handleSwitchChange = async (checked, record) => {
    try {
      if (!user || !user.id) {
        console.log('User or user.id is not available');
        return;
      }
      const response = await axiosJson.post(`/Owner/room-type-status?Id=${record.id}`);
      // Assuming userId should be part of URL path based on RESTful conventions

      if (response.status === 200) {
        toast.success("Cập nhật thành công");
        // Optionally update local state after successful update
        fetchRoomTypes(user.id); // Ensure fetchHotel updates the hotel data after toggle
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật trạng thái khách sạn");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái khách sạn:", error);
      toast.error("Có lỗi xảy ra");
    }
  };


  const handleUploadChange = ({ fileList }) => setFileList(fileList);

  const updateRoomTypeAPI = async (roomTypeId, values) => {
    // console.log(values);
    const formData = new FormData();
    // console.log('roomtypeId', roomTypeId);

    Object.keys(values).forEach(key => {
      if (typeof values[key] === 'boolean') {
        formData.append(key, values[key]);
      } else if (typeof values[key] === 'undefined') {
        formData.append(key, false); // Gán false nếu giá trị undefined
      } else {
        formData.append(key, values[key]);
      }
    });
    if (fileList[0]?.originFileObj) {
      formData.append('imageFile', fileList[0].originFileObj);
    }

    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const response = await axiosFormData.post(`/Owner/update-room-type?roomTypeId=${roomTypeId}`, formData);

      if (response.status === 200) {
        toast.success("Cập nhật loại phòng thành công");
        fetchRoomTypes(user.id);
      } else {
        toast.error("Có lỗi xảy ra khi thêm mới loại phòng");
      }
    } catch (error) {
      console.error("Lỗi khi thêm mới loại phòng:", error);
      toast.error("Có lỗi xảy ra");
    }
  };

  const addRoomTypeAPI = async (values) => {
    // console.log(values);
    // console.log(fileList[0]?.url);
    // console.log(fileList[0]?.originFileObj);
    const formData = new FormData();

    // Lấy tất cả giá trị từ values và thêm vào formData
    Object.keys(values).forEach(key => {
      if (typeof values[key] === 'boolean') {
        formData.append(key, values[key]);
      } else if (typeof values[key] === 'undefined') {
        formData.append(key, false); // Gán false nếu giá trị undefined
      } else {
        formData.append(key, values[key]);
      }
    });
    if (fileList[0]?.originFileObj) {
      formData.append('imageFile', fileList[0].originFileObj);
    }
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ': ' + pair[1]);
    // }

    try {
      const response = await axiosFormData.post(`/Owner/add-room-type?userId=${user.id}`, formData);

      if (response.status === 201) {
        toast.success("Thêm mới loại phòng thành công");
        fetchRoomTypes(user.id);
      } else {
        toast.error("Có lỗi xảy ra khi thêm mới loại phòng");
      }
    } catch (error) {
      console.error("Lỗi khi thêm mới loại phòng:", error);
      toast.error("Có lỗi xảy ra");
    }
  };
  const handleRemoveImage = () => {
    setFileList([]);
    setCurrentRoom((prevRoom) => ({
      ...prevRoom,
      imageURL: null,
    }));
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => <div style={{ textAlign: 'center' }}>{index + 1}</div>,
      align: 'center',
    },
    {
      title: 'Ảnh đại diện',
      dataIndex: 'imageURL',
      key: 'imageURL',
      render: (text, record) => <Image src={record.imageURL} alt={record.name} style={{ width: 50, height: 50 }} />,
      align: 'center',
    },
    {
      title: 'Tên phòng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá mặc định',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
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
      title: 'Tổng số phòng',
      dataIndex: 'totalRoom',
      key: 'totalRoom',
    },
    {
      title: 'Trạng thái hoạt động',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (text, record) => (
        <Switch
          checked={record.isActive}
          onChange={(checked) => handleSwitchChange(checked, record)}
        />
      ),
      align: 'center',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button type="link" icon={<EditOutlined />} onClick={() => showEditModalHandler(record)} />
        </span>
      ),
      align: 'center',
    },
  ];

  const roomDetailsLabels = {
    haveFreeDrinkWater: "Nước uống miễn phí",
    haveMiniBar: "Mini bar",
    haveClothesHanger: "Móc treo quần áo",
    haveClosets: "Tủ quần áo",
    haveBathtubAndShower: "Bồn tắm và vòi sen",
    haveAirConditioner: "Máy điều hòa",
    haveBalcony: "Ban công",
    haveTvScreen: "Màn hình TV",
    haveFreeWifi: "Wi-Fi miễn phí",
    haveNoSmoking: "Không hút thuốc",
    haveFreeBreakfast: "Bữa sáng miễn phí",
    haveFreeCleaningRoom: "Dọn phòng miễn phí",
    haveFreeLaundry: "Giặt là miễn phí",
    haveNiceView: "View đẹp",
  };

  return (
    <>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showAddModalHandler}
        style={{ marginBottom: 16 }}
      >
        Thêm loại phòng
      </Button>
      <Table columns={columns} dataSource={roomTypes} rowKey="id" />
      <Modal
        title="Chỉnh sửa loại phòng"
        visible={showEditModal}
        onOk={handleEditModalOk}
        onCancel={handleCancel}
        width="60%"
        okText="Cập nhật"
        cancelText="Hủy bỏ"

      >
        <Form
          form={editRoomType}
          initialValues={currentRoom || {}}
        >
          <Form.Item label="Tên phòng" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên phòng!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số người tối đa" name="maxPeople" rules={[{ required: true, message: 'Vui lòng nhập số người tối đa!' }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Giá mặc định" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá mặc định!' }]}>
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Giá cuối tuần" name="weekendPrice">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Giá ngày lễ" name="holidayPrice">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Số giường" name="numberOfBed" rules={[{ required: true, message: 'Vui lòng nhập số giường!' }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item label="Tổng số phòng" name="totalRoom" rules={[{ required: true, message: 'Vui lòng nhập tổng số phòng!' }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Typography.Title level={5}>Chi tiết phòng:</Typography.Title>
          <div style={{ display: 'flex', flexFlow: 'wrap', gap: 30 }}>
            {Object.keys(roomDetailsLabels).map((key) => (
              <Form.Item key={key} name={key} valuePropName="checked">
                <Checkbox>{roomDetailsLabels[key]}</Checkbox>
              </Form.Item>
            ))}
          </div>
          <Typography.Title level={5}>Ảnh đại diện:</Typography.Title>
          <Form.Item label="">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              onRemove={handleRemoveImage}
              beforeUpload={() => false}
            >
              {fileList.length === 0 && (
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm loại phòng mới"
        visible={showAddModal}
        onOk={handleAddModalOk}
        onCancel={handleCancel}
        width="60%"
        okText="Xác nhận"
        cancelText="Hủy bỏ"
      >
        <Form
          form={addRoomType}

        >
          <Form.Item label="Tên phòng" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên phòng!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Số người tối đa" name="maxPeople" rules={[{ required: true, message: 'Vui lòng nhập số người tối đa!' }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Giá mặc định" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá mặc định!' }]}>
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Giá cuối tuần" name="weekendPrice">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Giá ngày lễ" name="holidayPrice">
                <InputNumber min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Số giường" name="numberOfBed" rules={[{ required: true, message: 'Vui lòng nhập số giường!' }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Form.Item label="Tổng số phòng" name="totalRoom" rules={[{ required: true, message: 'Vui lòng nhập tổng số phòng!' }]}>
            <InputNumber min={1} />
          </Form.Item>
          <Typography.Title level={5}>Chi tiết phòng:</Typography.Title>
          <div style={{ display: 'flex', flexFlow: 'wrap', gap: 30 }}>
            {Object.keys(roomDetailsLabels).map((key) => (
              <Form.Item key={key} name={key} valuePropName="checked">
                <Checkbox>{roomDetailsLabels[key]}</Checkbox>
              </Form.Item>
            ))}
          </div>
          <Typography.Title level={5}>Ảnh đại diện:</Typography.Title>
          <Form.Item label="">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              onRemove={handleRemoveImage}
              beforeUpload={() => false}
            >
              {fileList.length === 0 && (
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default RoomType;
