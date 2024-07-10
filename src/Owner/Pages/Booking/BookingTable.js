import React, { useState } from 'react';
import { Table, Modal, Button, Select, Tag, Tabs, DatePicker } from 'antd';
import { EyeOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { axiosJson } from '../../../axios/axiosCustomize';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../../axios/AuthContext';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { toast } from 'react-toastify';
import { Document, Packer, Paragraph, TableCell, TableRow, TextRun, Table as DocxTable } from 'docx';
import { saveAs } from 'file-saver';
dayjs.extend(customParseFormat);

const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';
const urlDateFormat = 'YYYY-MM-DD';


const { Option } = Select;
const { TabPane } = Tabs;

// const mockData = [
//   {
//     key: '1',
//     customer: 'John Doe',
//     bookingId: 'BK001',
//     checkin: '2024-06-01',
//     checkout: '2024-06-05',
//     totalBill: 2000,
//     amountReceived: 2000,
//     status: 1,
//   },
//   {
//     key: '2',
//     customer: 'Jane Smith',
//     bookingId: 'BK002',
//     checkin: '2024-06-02',
//     checkout: '2024-06-06',
//     totalBill: 1500,
//     amountReceived: 1500,
//     status: 2,
//   },
//   {
//     key: '3',
//     customer: 'Alice Johnson',
//     bookingId: 'BK003',
//     checkin: '2024-06-03',
//     checkout: '2024-06-07',
//     totalBill: 1800,
//     amountReceived: 1800,
//     status: 3,
//   },
//   {
//     key: '4',
//     customer: 'Bob Brown',
//     bookingId: 'BK004',
//     checkin: '2024-06-04',
//     checkout: '2024-06-08',
//     totalBill: 2200,
//     amountReceived: 2200,
//     status: 4,
//   },
//   {
//     key: '5',
//     customer: 'Charlie Davis',
//     bookingId: 'BK005',
//     checkin: '2024-06-05',
//     checkout: '2024-06-09',
//     totalBill: 2500,
//     amountReceived: 2500,
//     status: 1,
//   },
//   {
//     key: '6',
//     customer: 'Diana Evans',
//     bookingId: 'BK006',
//     checkin: '2024-06-06',
//     checkout: '2024-06-10',
//     totalBill: 2700,
//     amountReceived: 2700,
//     status: 2,
//   },
//   {
//     key: '7',
//     customer: 'Ethan Fox',
//     bookingId: 'BK007',
//     checkin: '2024-06-07',
//     checkout: '2024-06-11',
//     totalBill: 3000,
//     amountReceived: 3000,
//     status: 3,
//     totalroom: 3,
//     roomtype: {
//       doubleroom: 1,
//       singleroom: 2,
//     }
//   },
//   {
//     key: '8',
//     customer: 'Fiona Green',
//     bookingId: 'BK008',
//     checkin: '2024-06-08',
//     checkout: '2024-06-12',
//     totalBill: 3200,
//     amountReceived: 3200,
//     status: 4,
//   },
//   {
//     key: '9',
//     customer: 'George Hill',
//     bookingId: 'BK009',
//     checkin: '2024-06-09',
//     checkout: '2024-06-13',
//     totalBill: 3400,
//     amountReceived: 3400,
//     status: 1,
//   },
//   {
//     key: '10',
//     customer: 'Hannah Ivy',
//     bookingId: 'BK010',
//     checkin: '2024-06-10',
//     checkout: '2024-06-14',
//     totalBill: 3600,
//     amountReceived: 3600,
//     status: 2,
//   },
// ];

const statusMap = {
  "-1": 'Thất bại',
  0: 'Đã thanh toán',
  1: 'Đã hoàn tất',
  2: 'Đã hủy',
};

const statusColors = {
  "-1": 'orange',
  0: 'green',
  1: 'blue',
  2: 'red',
};

const BookingTable = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [checkInDate, setCheckInDate] = useState(dayjs());
  const [checkOutDate, setCheckOutDate] = useState(dayjs());
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    const today = dayjs();
    try {
      if (user && user.id) {
        fetchBooking(user.id, today);
      }
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  const fetchBooking = async (userId, checkIn, checkOut = null) => {
    const checkin = dayjs(checkIn).format('YYYY-MM-DD');
    const checkout = checkOut ? dayjs(checkOut).format('YYYY-MM-DD') : null;
    try {
      const response = await axiosJson.get(`/Owner/get-booking-by-owner`, {
        params: {
          userId: userId,
          checkinDate: checkin,
          checkoutDate: checkout,
        },
      });
      if (response.status === 200) {
        setData(response.data);
        console.log(response.data);
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra!')
      console.error('Error fetching bookings:', error);
    }
  };

  const handleCheckInChange = (date, dateString) => {
    setCheckInDate(date ? dayjs(date).format('YYYY-MM-DD') : null);
  };

  const handleCheckOutChange = (date, dateString) => {
    setCheckOutDate(date ? dayjs(date).format('YYYY-MM-DD') : null);
  };

  const handleUpdateClick = () => {
    fetchBooking(user.id, checkInDate, checkOutDate);
    toast.success('Cập nhật thành công');
  };

  const showDetailModal = (record) => {
    setSelectedBooking(record);
    setIsDetailModalVisible(true);
  };

  const handleDetailOk = () => {
    setIsDetailModalVisible(false);
    setSelectedBooking(null);
  };

  const handleDetailCancel = () => {
    setIsDetailModalVisible(false);
    setSelectedBooking(null);
  };

  const showUpdateModal = (record) => {
    setSelectedBooking(record);
    setUpdatingStatus(record.status);
    setIsUpdateModalVisible(true);
  };

  const handleUpdateOk = async () => {
    if (selectedBooking) {
      try {
        const response = await axiosJson.post('/Owner/update-status', {
          userId: user.id,
          bookingCode: selectedBooking.bookingCode,
          status: updatingStatus,
        });

        if (response.status === 200) {
          const updatedData = data.map((item) =>
            item.id === selectedBooking.id
              ? { ...item, status: updatingStatus }
              : item
          );
          setData(updatedData);
          setIsUpdateModalVisible(false);
          setSelectedBooking(null);
          setUpdatingStatus(null);
          toast.success("Cập nhật thành công")
        } else {
          toast.error('Đã có lỗi xảy ra.')
          console.error('Failed to update booking status:', response.data);
        }
      } catch (error) {
        console.error('Error updating booking status:', error);
      }
    }
  };


  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    setSelectedBooking(null);
    setUpdatingStatus(null);
  };

  const handleStatusChange = (value) => {
    setUpdatingStatus(value);
  };

  const handleTabChange = (key) => {
    setSelectedTab(key);
  };

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const handlePageChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  const getSTT = (index) => {
    const { current, pageSize } = pagination;
    return (current - 1) * pageSize + index + 1;
  };
  const columns = [
    {
      title: 'STT',
      key: 'stt',
      render: (text, record, index) => getSTT(index),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'ID Booking',
      dataIndex: 'bookingCode',
      key: 'bookingCode',
    },
    {
      title: 'Ngày đến',
      dataIndex: 'checkinDate',
      key: 'checkinDate',
      render: (text) => dayjs(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Ngày đi',
      dataIndex: 'checkOutDate',
      key: 'checkOutDate',
      render: (text) => dayjs(text).format('DD-MM-YYYY'),
    },
    {
      title: 'Tổng hóa đơn',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => (
        <span>{Number(text).toLocaleString('vi-VN')} VND</span>
      ),
    },
    {
      title: 'Thực nhận',
      dataIndex: 'moneyReceived',
      key: 'moneyReceived',
      render: (text) => (
        <span>{Number(text).toLocaleString('vi-VN')} VND</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>{statusMap[status]}</Tag>
      ),
    },
    {
      title: 'Chức năng',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showDetailModal(record)}
            style={{ marginRight: 5 }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => showUpdateModal(record)}
            style={{ marginRight: 5 }}
          />
          <Button
            icon={<DownloadOutlined />}
            onClick={() => downloadBooking(record)}
          />
        </span>
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
  const downloadBooking = (booking) => {
    if (!booking) {
      toast.error("No booking selected");
      return;
    }

    const table = new DocxTable({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Loại phòng")],
            }),
            new TableCell({
              children: [new Paragraph("Tạm tính")],
            }),
            new TableCell({
              children: [new Paragraph("Số lượng phòng")],
            }),
          ],
        }),
        ...booking.bookingDetails.map((detail) =>
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph(detail.roomTypeName)],
              }),
              new TableCell({
                children: [new Paragraph(Number(detail.unitPrice).toLocaleString('vi-VN') + " VND")],
              }),
              new TableCell({
                children: [new Paragraph(detail.roomCount.toString())],
              }),
            ],
          })
        ),
      ],
    });


    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "PHIẾU ĐẶT PHÒNG",
                bold: true,
                size: 30,
              })
            ],
            alignment: 'center'
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `ID Booking: ${booking.bookingCode}`,
                bold: true,
                size: 20,
              })
            ],
            alignment: 'center'
          }),
          new Paragraph("\n"),
          new Paragraph("\n"),
          new Paragraph(`Khách hàng: ${booking.customerName}`),
          new Paragraph(`Email: ${booking.email}`),
          new Paragraph(`SĐT: ${booking.phoneNumber}`),
          new Paragraph(`ID Booking: ${booking.bookingCode}`),
          new Paragraph(`Ngày đến: ${dayjs(booking.checkinDate).format('DD-MM-YYYY')}`),
          new Paragraph(`Ngày đi: ${dayjs(booking.checkOutDate).format('DD-MM-YYYY')}`),
          new Paragraph(`Tổng hóa đơn: ${Number(booking.totalAmount).toLocaleString('vi-VN')} VND`),
          new Paragraph(`Thực nhận: ${Number(booking.moneyReceived).toLocaleString('vi-VN')} VND`),
          new Paragraph(`Người lớn: ${booking.numberOfAdults} người`),
          new Paragraph(`Trẻ em: ${booking.numberOfChildren} trẻ`),
          new Paragraph(`Ghi chú: ${booking.note || ''}`),
          new Paragraph("\n"),
          new Paragraph("Chi tiết phòng:"),
          table,
          new Paragraph("\n"),
          new Paragraph({
            children: [
              new TextRun("Khách hàng"),
              new TextRun("\t\t\t\t\t\t\t"),
              new TextRun("Khách sạn"),
            ],
            alignment: 'both'
          }),
          new Paragraph("\n"),
          new Paragraph("\n"),
          new Paragraph("\n"),
          new Paragraph({
            children: [
              new TextRun("__________________"),
              new TextRun("\t\t\t\t\t\t"),
              new TextRun("__________________")
            ],
            alignment: 'both'
          }),
        ]
      }]
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `ID_${booking.bookingCode}.docx`);
    }).catch(error => {
      console.error('Error creating document:', error);
      toast.error('Đã có lỗi xảy ra khi tải xuống booking.');
    });
  };
  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, }}>
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
        <Button onClick={handleUpdateClick} type="primary">
          Thay đổi
        </Button>
      </div>


      <Tabs defaultActiveKey="all" onChange={handleTabChange}>
        <TabPane tab="Tất cả" key="all">
          <Table columns={columns} dataSource={data} rowKey="id" pagination={{
            ...pagination,
            onChange: handlePageChange,
          }} />
        </TabPane>
        <TabPane tab="Đã thanh toán" key="Đã thanh toán">
          <Table columns={columns} dataSource={data.filter(item => item.status === 0)} rowKey="id" pagination={{
            ...pagination,
            onChange: handlePageChange,
          }} />
        </TabPane>

        <TabPane tab="Đã hoàn tất" key="Đã hoàn tất">
          <Table columns={columns} dataSource={data.filter(item => item.status === 1)} rowKey="id" pagination={{
            ...pagination,
            onChange: handlePageChange,
          }} />
        </TabPane>
        <TabPane tab="Từ chối" key="Từ chối">
          <Table columns={columns} dataSource={data.filter(item => item.status === 2)} rowKey="id" pagination={{
            ...pagination,
            onChange: handlePageChange,
          }} />
        </TabPane>
        <TabPane tab="Thất bại" key="Thất bại">
          <Table columns={columns} dataSource={data.filter(item => item.status === -1)} rowKey="id" pagination={{
            ...pagination,
            onChange: handlePageChange,
          }} />
        </TabPane>
      </Tabs>

      <Modal
        title="Chi tiết Booking"
        visible={isDetailModalVisible}
        onOk={handleDetailOk}
        onCancel={handleDetailCancel}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        {selectedBooking && (
          <div>
            <p>Khách hàng: {selectedBooking.customerName}</p>
            <p>Email: {selectedBooking.email}</p>
            <p>SĐT: {selectedBooking.phoneNumber}</p>
            <p>ID Booking: {selectedBooking.bookingCode}</p>
            <p>Ngày đến: {dayjs(selectedBooking.checkinDate).format('DD-MM-YYYY')}</p>
            <p>Ngày đi: {dayjs(selectedBooking.checkOutDate).format('DD-MM-YYYY')}</p>
            <p>Tạm tính: {selectedBooking && Number(selectedBooking.totalPrice).toLocaleString('vi-VN')} VND</p>
            <p>Giảm giá: {selectedBooking && Number(selectedBooking.discount).toLocaleString('vi-VN')} VND</p>
            <p>Tổng hóa đơn: {selectedBooking && Number(selectedBooking.totalAmount).toLocaleString('vi-VN')} VND</p>
            <p>Thực nhận: {selectedBooking && Number(selectedBooking.moneyReceived).toLocaleString('vi-VN')} VND</p>
            <p>Trạng thái: <Tag color={statusColors[selectedBooking.status]}>{statusMap[selectedBooking.status]}</Tag></p>
            <p>Người lớn: {selectedBooking.numberOfAdults} người</p>
            <p>Trẻ em: {selectedBooking.numberOfChildren} trẻ</p>
            <p>Ghi chú: {selectedBooking.map}</p>
            {selectedBooking.bookingDetails && (
              <div>
                <p><strong>Chi tiết phòng:</strong></p>
                <Table columns={columnsDetails} dataSource={selectedBooking.bookingDetails} />
              </div>
            )}
          </div>
        )}
      </Modal >

      <Modal
        title="Cập nhật trạng thái Booking"
        visible={isUpdateModalVisible}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
      >
        {selectedBooking && (
          <div>

            <p>Trạng thái: <Tag color={statusColors[selectedBooking.status]}>{statusMap[selectedBooking.status]}</Tag></p>
            <Select
              value={updatingStatus}
              onChange={handleStatusChange}
              style={{ width: '100%' }}
            >
              {Object.keys(statusMap).map((key) => (
                <Option key={key} value={Number(key)}>
                  {statusMap[key]}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </Modal>
    </>
  );
};

export default BookingTable;