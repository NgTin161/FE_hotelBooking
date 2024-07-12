import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { axiosJson } from '../axios/axiosCustomize';
import { AuthContext } from '../axios/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [initialValues, setInitialValues] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const fetchInformation = async (email) => {
      try {
        const response = await axiosJson.get(`/Users/get-profile`, {
          params: { email: email },
        });
        if (response.status === 200) {
          const { fullName, email, phoneNumber } = response.data;
          console.log('user', response.data);
          setInitialValues({ fullName, email, phoneNumber });
          form.setFieldsValue({ fullName, email, phoneNumber });
        }
      } catch (error) {
        console.error('Failed to fetch user information:', error);
      }
    };

    if (user?.email) {
      fetchInformation(user.email);
    }
  }, [user, form]);

  const onFieldsChange = (_, allFields) => {
    const isModified =
      allFields.find(field => field.name[0] === 'fullName').value !== initialValues.fullName ||
      allFields.find(field => field.name[0] === 'phoneNumber').value !== initialValues.phoneNumber;
    setIsChanged(isModified);
  };

  const onFinish = async (values) => {
    const { email, fullName, phoneNumber } = values;
    const updateProfile = { email, fullName, phoneNumber };
    try {
      const response = await axiosJson.post('/Users/update-profile', updateProfile);
      if (response.status === 200) {
        toast.success('Cập nhật thành công');
        setIsChanged(false);
        setInitialValues({ ...initialValues, fullName, phoneNumber });
      } else {
        toast.error('Có lỗi khi cập nhật thông tin');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const onChangePasswordFinish = async (values) => {
    const { currentPassword, newPassword } = values;
    const changePasswordDTO = {
      email: user.email,
      currentPassword,
      newPassword
    };
    try {
      const response = await axiosJson.post('/Users/change-password', changePasswordDTO);
      if (response.status === 200) {
        toast.success('Mật khẩu đã được thay đổi thành công');
        passwordForm.resetFields();
      } else {
        toast.error('Có lỗi khi thay đổi mật khẩu');
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau')
      console.error('Error changing password:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
      <Typography.Title level={3}>Thông tin tài khoản</Typography.Title>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={onFinish}
        onFieldsChange={onFieldsChange}
        layout="vertical"
        style={{ width: 400, margin: '0 auto' }}
      >
        <Form.Item
          label="Email"
          name="email"
        >
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Họ và tên"
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phoneNumber"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={!isChanged}>
            Thay đổi
          </Button>
        </Form.Item>
      </Form>

      <Typography.Title level={4} style={{ marginTop: '2rem' }}>Đổi mật khẩu</Typography.Title>
      <Form
        form={passwordForm}
        onFinish={onChangePasswordFinish}
        layout="vertical"
        style={{ width: 400, margin: '0 auto' }}
      >
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmNewPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Profile;
