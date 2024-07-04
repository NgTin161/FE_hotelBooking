import React, { useState } from 'react';
import { Table, Switch, Button, Modal, Form, Input, InputNumber, Checkbox, Upload, Row, Col, Typography, Image } from 'antd';
import { EditOutlined, UploadOutlined } from '@ant-design/icons';
import EditRoomTypesModal from '../../Components/EditRoomTypesModal';

const RoomType = () => {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Luxury Room",
      imageURL: "https://localhost:7186/Images/71d05988-0136-4468-bfd5-4956e4ccbb04/48a07c91-0f95-4ae4-ba62-7bd2d4085978.jpg",
      maxPeople: 3,
      price: 1200000,
      weekendPrice: 1300000,
      holidayPrice: 1400000,
      numberOfBed: 1,
      totalRoom: 20,
      availableRooms: 20,
      haveFreeDrinkWater: true,
      haveMiniBar: true,
      haveClothesHanger: true,
      haveClosets: true,
      haveBathtubAndShower: true,
      haveAirConditioner: true,
      haveBalcony: true,
      haveTvScreen: true,
      haveFreeWifi: true,
      haveNoSmoking: true,
      haveFreeBreakfast: true,
      haveFreeCleaningRoom: true,
      haveFreeLaundry: false,
      haveNiceView: false,
      hotelId: 1,
      isActive: true,
    },
    {
      id: 2,
      name: "Room B",
      imageURL: "https://localhost:7186/Images/some-other-image.jpg",
      maxPeople: 2,
      price: 800000,
      weekendPrice: 900000,
      holidayPrice: 1000000,
      numberOfBed: 1,
      totalRoom: 10,
      availableRooms: 5,
      haveFreeDrinkWater: false,
      haveMiniBar: false,
      haveClothesHanger: true,
      haveClosets: false,
      haveBathtubAndShower: false,
      haveAirConditioner: true,
      haveBalcony: false,
      haveTvScreen: true,
      haveFreeWifi: true,
      haveNoSmoking: true,
      haveFreeBreakfast: false,
      haveFreeCleaningRoom: false,
      haveFreeLaundry: false,
      haveNiceView: false,
      hotelId: 1,
      isActive: false,
    },
  ]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);


  const showModal = (room) => {
    setCurrentRoom(room);
    setFileList(room.imageURL ? [{ uid: '-1', name: 'Image', status: 'done', url: room.imageURL }] : []);
    setShowEditModal(true);
  };

  const handleOk = () => {
    setShowEditModal(false);
  };

  const handleCancel = () => {
    setShowEditModal(false);
  };

  const handleSwitchChange = (checked, record) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === record.id ? { ...room, isActive: checked } : room
      )
    );
  };

  const [fileList, setFileList] = useState([]);

  const handleUploadChange = (info) => {
    if (info.file.status === 'done' || info.file.status === 'uploading') {
      const newFileList = info.fileList.map((file) => {
        if (file.originFileObj) {
          return {
            ...file,
            url: URL.createObjectURL(file.originFileObj),
          };
        }
        return file;
      });
      setFileList(newFileList);
      setCurrentRoom((prevRoom) => ({
        ...prevRoom,
        imageURL: newFileList[0]?.url,
      }));
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
          checkedChildren="ON"
          unCheckedChildren="OFF"
        />
      ),
      align: 'center',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button type="link" icon={<EditOutlined />} onClick={() => showModal(record)} />
        </span>
      ),
      align: 'center',
    },
  ];

  const roomDetails = [
    'haveFreeDrinkWater',
    'haveMiniBar',
    'haveClothesHanger',
    'haveClosets',
    'haveBathtubAndShower',
    'haveAirConditioner',
    'haveBalcony',
    'haveTvScreen',
    'haveFreeWifi',
    'haveNoSmoking',
    'haveFreeBreakfast',
    'haveFreeCleaningRoom',
    'haveFreeLaundry',
    'haveNiceView',
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
      <Table columns={columns} dataSource={rooms} rowKey="id" />
      <Modal
        title="Chi tiết phòng"
        visible={showEditModal}
        onOk={handleOk}
        onCancel={handleCancel}
        width="60%"
        okText="Cập nhật"
        cancelText="Hủy bỏ"
      >
        {currentRoom && (
          <Form
            initialValues={{
              name: currentRoom.name,
              maxPeople: currentRoom.maxPeople,
              price: currentRoom.price,
              weekendPrice: currentRoom.weekendPrice,
              holidayPrice: currentRoom.holidayPrice,
              numberOfBed: currentRoom.numberOfBed,
              totalRoom: currentRoom.totalRoom,
              availableRooms: currentRoom.availableRooms,
              ...currentRoom,
            }}
          >
            <Form.Item label="Tên phòng" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="Số người tối đa" name="maxPeople">
              <InputNumber />
            </Form.Item>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Giá mặc định" name="price">
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Giá cuối tuần" name="weekendPrice">
                  <InputNumber />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Giá ngày lễ" name="holidayPrice">
                  <InputNumber />
                </Form.Item>
              </Col>
            </Row >
            <p>Lưu ý: Hệ thống sẽ phụ thu 15% của mỗi hóa đơn</p>
            <Form.Item label="Số giường" name="numberOfBed">
              <InputNumber />
            </Form.Item>
            <Form.Item label="Tổng số phòng" name="totalRoom">
              <InputNumber />
            </Form.Item>
            <Typography.Title level={5}>Chọn dịch vụ của phòng:</Typography.Title>
            <div style={{ display: 'flex', flexFlow: 'wrap', gap: 30 }}>
              <Form.Item label="Nước uống miễn phí" name="haveFreeDrinkWater" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveFreeDrinkWater : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveFreeDrinkWater: e.target.checked })}
                />
              </Form.Item>

              <Form.Item label="Có minibar" name="haveMiniBar" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveMiniBar : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveMiniBar: e.target.checked })}
                />
              </Form.Item>

              <Form.Item label="Có móc treo quần áo" name="haveClothesHanger" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveClothesHanger : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveClothesHanger: e.target.checked })}
                />
              </Form.Item>

              <Form.Item label="Có tủ quần áo" name="haveClosets" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveClosets : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveClosets: e.target.checked })}
                />
              </Form.Item>

              <Form.Item label="Có bồn tắm và vòi sen" name="haveBathtubAndShower" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveBathtubAndShower : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveBathtubAndShower: e.target.checked })}
                />
              </Form.Item>

              <Form.Item label="Có điều hòa không khí" name="haveAirConditioner" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveAirConditioner : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveAirConditioner: e.target.checked })}
                />
              </Form.Item>

              <Form.Item label="Có ban công" name="haveBalcony" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveBalcony : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveBalcony: e.target.checked })}
                />
              </Form.Item>

              <Form.Item label="Có màn hình TV" name="haveTvScreen" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveTvScreen : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveTvScreen: e.target.checked })}
                />
              </Form.Item>

              <Form.Item label="Có Wifi miễn phí" name="haveFreeWifi" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveFreeWifi : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveFreeWifi: e.target.checked })}
                />
              </Form.Item>

              <Form.Item label="Không hút thuốc" name="haveNoSmoking" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveNoSmoking : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveNoSmoking: e.target.checked })}
                />
              </Form.Item>

              <Form.Item label="Có bữa sáng miễn phí" name="haveFreeBreakfast" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveFreeBreakfast : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveFreeBreakfast: e.target.checked })}
                />
              </Form.Item>

              <Form.Item label="Dọn phòng miễn phí" name="haveFreeCleaningRoom" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveFreeCleaningRoom : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveFreeCleaningRoom: e.target.checked })}
                />
              </Form.Item>

              <Form.Item label="Giặt ủi miễn phí" name="haveFreeLaundry" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveFreeLaundry : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveFreeLaundry: e.target.checked })}
                />
              </Form.Item>

              <Form.Item label="Có view đẹp" name="haveNiceView" valuePropName="checked">
                <Checkbox
                  checked={currentRoom ? currentRoom.haveNiceView : false}
                  onChange={(e) => setCurrentRoom({ ...currentRoom, haveNiceView: e.target.checked })}
                />
              </Form.Item>
            </div>
            <Form.Item label="Ảnh" name="image">
              <Upload
                name="image"
                listType="picture-card"
                showUploadList={true}
                fileList={currentRoom.imageURL ? [{ uid: '-1', name: 'Image', status: 'done', url: currentRoom.imageURL }] : []}
                beforeUpload={() => true}
                onChange={handleUploadChange}
                onRemove={handleRemoveImage}
                maxCount={1}
              >

                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>

              </Upload>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* <EditRoomTypesModal
        showEditModal={showEditModal}
        onHide={() => setShowEditModal(false)}
        currentRoom={currentRoom}
      /> */}
    </>
  );
};

export default RoomType;
