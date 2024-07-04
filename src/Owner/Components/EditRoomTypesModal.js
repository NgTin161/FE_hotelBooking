// import React from 'react'

// const EditRoomTypesModal = ({ showEditModal, onHide, currentRoom }) => {


//   const [fileList, setFileList] = useState([]);

//   const handleUploadChange = (info) => {
//     if (info.file.status === 'done' || info.file.status === 'uploading') {
//       const newFileList = info.fileList.map((file) => {
//         if (file.originFileObj) {
//           return {
//             ...file,
//             url: URL.createObjectURL(file.originFileObj),
//           };
//         }
//         return file;
//       });
//       setFileList(newFileList);
//       setCurrentRoom((prevRoom) => ({
//         ...prevRoom,
//         imageURL: newFileList[0]?.url,
//       }));
//     }
//   };

//   const handleRemoveImage = () => {
//     setFileList([]);
//     setCurrentRoom((prevRoom) => ({
//       ...prevRoom,
//       imageURL: null,
//     }));
//   };
//   const handleOk = () => {
//     setShowEditModal(false);
//   };

//   const handleCancel = () => {
//     setShowEditModal(false);
//   };

//   return (
//     <Modal
//       title="Chi tiết phòng"
//       visible={isModalVisible}
//       onOk={handleOk}
//       onCancel={handleCancel}
//       width="60%"
//     >
//       {currentRoom && (
//         <Form
//           initialValues={{
//             name: currentRoom.name,
//             maxPeople: currentRoom.maxPeople,
//             price: currentRoom.price,
//             weekendPrice: currentRoom.weekendPrice,
//             holidayPrice: currentRoom.holidayPrice,
//             numberOfBed: currentRoom.numberOfBed,
//             totalRoom: currentRoom.totalRoom,
//             availableRooms: currentRoom.availableRooms,
//             ...currentRoom,
//           }}
//         >
//           <Form.Item label="Tên phòng" name="name">
//             <Input />
//           </Form.Item>
//           <Form.Item label="Số người tối đa" name="maxPeople">
//             <InputNumber />
//           </Form.Item>
//           <Row gutter={16}>
//             <Col span={8}>
//               <Form.Item label="Giá mặc định" name="price">
//                 <InputNumber />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item label="Giá cuối tuần" name="weekendPrice">
//                 <InputNumber />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item label="Giá ngày lễ" name="holidayPrice">
//                 <InputNumber />
//               </Form.Item>
//             </Col>
//           </Row >
//           <p>Lưu ý: Hệ thống sẽ phụ thu 15% của mỗi hóa đơn</p>
//           <Form.Item label="Số giường" name="numberOfBed">
//             <InputNumber />
//           </Form.Item>
//           <Form.Item label="Tổng số phòng" name="totalRoom">
//             <InputNumber />
//           </Form.Item>
//           <Typography.Title level={5}>Chọn dịch vụ của phòng:</Typography.Title>
//           <div style={{ display: 'flex', flexFlow: 'wrap', gap: 30 }}>
//             <Form.Item label="Nước uống miễn phí" name="haveFreeDrinkWater" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveFreeDrinkWater : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveFreeDrinkWater: e.target.checked })}
//               />
//             </Form.Item>

//             <Form.Item label="Có minibar" name="haveMiniBar" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveMiniBar : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveMiniBar: e.target.checked })}
//               />
//             </Form.Item>

//             <Form.Item label="Có móc treo quần áo" name="haveClothesHanger" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveClothesHanger : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveClothesHanger: e.target.checked })}
//               />
//             </Form.Item>

//             <Form.Item label="Có tủ quần áo" name="haveClosets" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveClosets : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveClosets: e.target.checked })}
//               />
//             </Form.Item>

//             <Form.Item label="Có bồn tắm và vòi sen" name="haveBathtubAndShower" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveBathtubAndShower : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveBathtubAndShower: e.target.checked })}
//               />
//             </Form.Item>

//             <Form.Item label="Có điều hòa không khí" name="haveAirConditioner" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveAirConditioner : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveAirConditioner: e.target.checked })}
//               />
//             </Form.Item>

//             <Form.Item label="Có ban công" name="haveBalcony" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveBalcony : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveBalcony: e.target.checked })}
//               />
//             </Form.Item>

//             <Form.Item label="Có màn hình TV" name="haveTvScreen" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveTvScreen : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveTvScreen: e.target.checked })}
//               />
//             </Form.Item>

//             <Form.Item label="Có Wifi miễn phí" name="haveFreeWifi" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveFreeWifi : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveFreeWifi: e.target.checked })}
//               />
//             </Form.Item>

//             <Form.Item label="Không hút thuốc" name="haveNoSmoking" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveNoSmoking : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveNoSmoking: e.target.checked })}
//               />
//             </Form.Item>

//             <Form.Item label="Có bữa sáng miễn phí" name="haveFreeBreakfast" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveFreeBreakfast : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveFreeBreakfast: e.target.checked })}
//               />
//             </Form.Item>

//             <Form.Item label="Dọn phòng miễn phí" name="haveFreeCleaningRoom" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveFreeCleaningRoom : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveFreeCleaningRoom: e.target.checked })}
//               />
//             </Form.Item>

//             <Form.Item label="Giặt ủi miễn phí" name="haveFreeLaundry" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveFreeLaundry : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveFreeLaundry: e.target.checked })}
//               />
//             </Form.Item>

//             <Form.Item label="Có view đẹp" name="haveNiceView" valuePropName="checked">
//               <Checkbox
//                 checked={currentRoom ? currentRoom.haveNiceView : false}
//                 onChange={(e) => setCurrentRoom({ ...currentRoom, haveNiceView: e.target.checked })}
//               />
//             </Form.Item>
//           </div>
//           <Form.Item label="Ảnh" name="image">
//             <Upload
//               name="image"
//               listType="picture-card"
//               showUploadList={true}
//               fileList={currentRoom.imageURL ? [{ uid: '-1', name: 'Image', status: 'done', url: currentRoom.imageURL }] : []}
//               beforeUpload={() => true}
//               onChange={handleUploadChange}
//               onRemove={handleRemoveImage}
//               maxCount={1}
//             >

//               <div>
//                 <UploadOutlined />
//                 <div style={{ marginTop: 8 }}>Upload</div>
//               </div>

//             </Upload>
//           </Form.Item>
//         </Form>
//       )}
//     </Modal>

//   )
// }

// export default EditRoomTypesModal;
