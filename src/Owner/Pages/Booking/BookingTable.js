import React, { useState } from 'react';
import { Table, Modal, Button, Select, Tag, Tabs, DatePicker } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const statusMap = {
  1: 'Đã thanh toán',
  2: 'Đã xác nhận',
  3: 'Đã hoàn tất',
  4: 'Từ chối',
};

const statusColors = {
  1: 'green',
  2: 'blue',
  3: 'cyan',
  4: 'red',
};

const mockData = [
  {
    key: '1',
    customer: 'John Doe',
    bookingId: 'BK001',
    checkin: '2024-06-01',
    checkout: '2024-06-05',
    totalBill: 2000,
    amountReceived: 2000,
    status: 1,
  },
  {
    key: '2',
    customer: 'Jane Smith',
    bookingId: 'BK002',
    checkin: '2024-06-02',
    checkout: '2024-06-06',
    totalBill: 1500,
    amountReceived: 1500,
    status: 2,
  },
  {
    key: '3',
    customer: 'Alice Johnson',
    bookingId: 'BK003',
    checkin: '2024-06-03',
    checkout: '2024-06-07',
    totalBill: 1800,
    amountReceived: 1800,
    status: 3,
  },
  {
    key: '4',
    customer: 'Bob Brown',
    bookingId: 'BK004',
    checkin: '2024-06-04',
    checkout: '2024-06-08',
    totalBill: 2200,
    amountReceived: 2200,
    status: 4,
  },
  {
    key: '5',
    customer: 'Charlie Davis',
    bookingId: 'BK005',
    checkin: '2024-06-05',
    checkout: '2024-06-09',
    totalBill: 2500,
    amountReceived: 2500,
    status: 1,
  },
  {
    key: '6',
    customer: 'Diana Evans',
    bookingId: 'BK006',
    checkin: '2024-06-06',
    checkout: '2024-06-10',
    totalBill: 2700,
    amountReceived: 2700,
    status: 2,
  },
  {
    key: '7',
    customer: 'Ethan Fox',
    bookingId: 'BK007',
    checkin: '2024-06-07',
    checkout: '2024-06-11',
    totalBill: 3000,
    amountReceived: 3000,
    status: 3,
    totalroom: 3,
    roomtype: {
      doubleroom: 1,
      singleroom: 2,
    }
  },
  {
    key: '8',
    customer: 'Fiona Green',
    bookingId: 'BK008',
    checkin: '2024-06-08',
    checkout: '2024-06-12',
    totalBill: 3200,
    amountReceived: 3200,
    status: 4,
  },
  {
    key: '9',
    customer: 'George Hill',
    bookingId: 'BK009',
    checkin: '2024-06-09',
    checkout: '2024-06-13',
    totalBill: 3400,
    amountReceived: 3400,
    status: 1,
  },
  {
    key: '10',
    customer: 'Hannah Ivy',
    bookingId: 'BK010',
    checkin: '2024-06-10',
    checkout: '2024-06-14',
    totalBill: 3600,
    amountReceived: 3600,
    status: 2,
  },
];

const BookingTable = () => {
  const [data, setData] = useState(mockData);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [selectedTab, setSelectedTab] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);

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

  const handleUpdateOk = () => {
    const updatedData = data.map((item) =>
      item.key === selectedBooking.key
        ? { ...item, status: updatingStatus }
        : item
    );
    setData(updatedData);
    setIsUpdateModalVisible(false);
    setSelectedBooking(null);
    setUpdatingStatus(null);
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

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const filteredData = data.filter((item) => {
    const isStatusMatch =
      selectedTab === 'all' || statusMap[item.status] === selectedTab;
    const isDateMatch =
      (!dateRange[0] && !dateRange[1]) ||
      (dayjs(item.checkin).isSameOrAfter(dateRange[0]) &&
        dayjs(item.checkout).isSameOrBefore(dateRange[1]));
    return isStatusMatch && isDateMatch;
  });

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'ID Booking',
      dataIndex: 'bookingId',
      key: 'bookingId',
    },
    {
      title: 'Checkin',
      dataIndex: 'checkin',
      key: 'checkin',
    },
    {
      title: 'Checkout',
      dataIndex: 'checkout',
      key: 'checkout',
    },
    {
      title: 'Tổng hóa đơn',
      dataIndex: 'totalBill',
      key: 'totalBill',
      render: (text) => `$${text}`,
    },
    {
      title: 'Thực nhận',
      dataIndex: 'amountReceived',
      key: 'amountReceived',
      render: (text) => `$${text}`,
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
            style={{ marginRight: 8 }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => showUpdateModal(record)}
          />
        </span>
      ),
    },
  ];

  return (
    <>
      <RangePicker
        onChange={handleDateRangeChange}
        style={{ marginBottom: 16 }}
        defaultValue={[dayjs().startOf('day'), dayjs().endOf('day')]}
      />

      <Tabs defaultActiveKey="all" onChange={handleTabChange}>
        <TabPane tab="Tất cả" key="all">
          <Table columns={columns} dataSource={filteredData} />
        </TabPane>
        <TabPane tab="Đã thanh toán" key="Đã thanh toán">
          <Table columns={columns} dataSource={filteredData} />
        </TabPane>
        <TabPane tab="Đã xác nhận" key="Đã xác nhận">
          <Table columns={columns} dataSource={filteredData} />
        </TabPane>
        <TabPane tab="Đã hoàn tất" key="Đã hoàn tất">
          <Table columns={columns} dataSource={filteredData} />
        </TabPane>
        <TabPane tab="Từ chối" key="Từ chối">
          <Table columns={columns} dataSource={filteredData} />
        </TabPane>
      </Tabs>

      <Modal
        title="Chi tiết Booking"
        visible={isDetailModalVisible}
        onOk={handleDetailOk}
        onCancel={handleDetailCancel}
      >
        {selectedBooking && (
          <div>
            <p>Khách hàng: {selectedBooking.customer}</p>
            <p>ID Booking: {selectedBooking.bookingId}</p>
            <p>Checkin: {selectedBooking.checkin}</p>
            <p>Checkout: {selectedBooking.checkout}</p>
            <p>Tổng hóa đơn: ${selectedBooking.totalBill}</p>
            <p>Thực nhận: ${selectedBooking.amountReceived}</p>
            <p>Trạng thái: {statusMap[selectedBooking.status]}</p>
            {selectedBooking.roomtype && (
              <div>
                <p><strong>Chi tiết phòng:</strong></p>
                <p>- Phòng đôi: {selectedBooking.roomtype.doubleroom}</p>
                <p>- Phòng đơn: {selectedBooking.roomtype.singleroom}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="Cập nhật trạng thái"
        visible={isUpdateModalVisible}
        onOk={handleUpdateOk}
        onCancel={handleUpdateCancel}
      >
        <p>Bạn có chắc chắn muốn cập nhật trạng thái?</p>
        <Select
          value={updatingStatus}
          onChange={handleStatusChange}
          style={{ width: '100%' }}
        >
          {Object.keys(statusMap).map((key) => (
            <Option key={key} value={parseInt(key)}>
              {statusMap[key]}
            </Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default BookingTable;
