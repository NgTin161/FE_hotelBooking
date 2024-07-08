import React, { useEffect, useState } from 'react';
import { LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Input, Form, Button, message } from 'antd';

import { Link, useParams } from 'react-router-dom';
import { axiosFormData, axiosJson } from '../axios/axiosCustomize';
import { toast } from 'react-toastify';

const ConfirmPass = () => {
    // Lấy token và email từ URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Lấy các giá trị từ query params
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    useEffect(() => {
        console.log('Token:', token);
        console.log('Email:', email);
    }, [token, email]);

    const [form] = Form.useForm();

    const validatePassword = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
        },
    });

    const validatePasswordLength = (_, value) => {
        if (value && value.length >= 6) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Mật khẩu phải có ít nhất 6 ký tự!'));
    };

    const onFinish = async (values) => {
        try {
            const formData = new FormData();
            formData.append('token', token);
            formData.append('email', email);
            formData.append('password', values.password);
            formData.append('confirmPassword', values.password2);
            console.log('Form values:', formData);

            const response = await axiosJson.post('/Users/reset-password', formData);

            console.log('Response:', response);

            if (response.status === 200) {
                toast.info('Đổi mật khẩu thành công. Vui lòng đăng nhập lại');
                localStorage.removeItem('jwt');


                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } else {
                toast.error(response.data || 'Đã xảy ra lỗi khi đổi mật khẩu');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Đã xảy ra lỗi khi thực hiện yêu cầu');
        }
    };


    return (
        <>
            <div className='Container-header'>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Link to="/">
                        <div style={{ marginTop: -12 }} className='logo' />
                    </Link>
                </div>
            </div>
            <div className="bg-img" style={{ height: '700px' }}>
                <div className="content" style={{ marginTop: '-100px', width: '400px' }} >
                    <h1 className='login-name'>Đặt lại mật khẩu</h1>
                    <Form
                        form={form}
                        name="reset-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập Mật khẩu!' },
                                { validator: validatePasswordLength }
                            ]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Mật khẩu"
                                prefix={<LockOutlined />}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                className="custom-input" // Thêm class để custom style
                            />
                        </Form.Item>

                        <Form.Item
                            name="password2"
                            rules={[
                                { required: true, message: 'Vui lòng nhập Mật khẩu!' },
                                validatePassword,
                                { validator: validatePasswordLength }
                            ]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Nhập lại mật khẩu"
                                prefix={<LockOutlined />}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                className="custom-input" // Thêm class để custom style
                            />
                        </Form.Item>

                        <div>
                            <Button type="primary" htmlType="submit" style={{ width: '100%', height: '50px' }}>
                                Gửi
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default ConfirmPass;
