import React, { useContext, useEffect, useState } from 'react';
import { Table, Switch, Button, Modal, Form, Input, InputNumber, Checkbox, Upload, Row, Col, Typography, Image } from 'antd';
import { EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';

import { IoMdPerson } from 'react-icons/io';
import { toast } from 'react-toastify';
import { AuthContext } from '../../axios/AuthContext';
import { axiosJson } from '../../axios/axiosCustomize';

const User = () => {
  const { user } = useContext(AuthContext);
  const [userList, setUserList] = useState([]);



  useEffect(() => {
    fetchUserList();
  }, []);


  const fetchUserList = async (userId) => {
    try {
      const response = await axiosJson.get(`/Admin/get-profile`);
      if (response.status === 200) {
        setUserList(response.data);
        console.log(response.data);

      } else {
        console.log('Có lỗi xảy ra khi lấy thông tin khách sạn');
      }
    } catch (error) {
      console.error('Đã xảy ra lỗi:', error);
    }
  };


  const handleSwitchChange = async (checked, record) => {
    try {
      if (!user || !user.id) {
        console.log('User or user.id is not available');
        return;
      }
      const response = await axiosJson.post(`/Admin/user-status?userId=${record.userId}`);
      // Assuming userId should be part of URL path based on RESTful conventions

      if (response.status === 200) {
        toast.success("Cập nhật thành công");

        fetchUserList(user.id); // Ensure fetchHotel updates the hotel data after toggle
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật trạng thái khách sạn");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái khách sạn:", error);
      toast.error("Có lỗi xảy ra");
    }
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
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',

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
  ]




  return (
    <>

      <Table columns={columns} dataSource={userList} rowKey="id" />

    </>
  );
};

export default User;
