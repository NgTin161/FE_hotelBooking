import React, { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Input, Form, Button, message } from 'antd';
import { axiosJson } from '../axios/axiosCustomize';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const FogotPass = () => {
    const [form] = Form.useForm();
    const [secondsRemaining, setSecondsRemaining] = useState(0);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const validateEmail = (_, value) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Regex để kiểm tra định dạng email
        if (value && regex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Email không hợp lệ!'));
    };

    const onFinish = async (values) => {
        try {
            console.log(values.email)
            const response = await axiosJson.post(`/Users/forgot-password?email=${values.email}`);
            console.log('Response:', response);

            if (response.status === 200) {
                toast.success(`Liên kết khôi phục mật khẩu đã được gửi qua email ${values.email}`);
                setIsButtonDisabled(true); // Khóa nút sau khi gửi thành công
                setSecondsRemaining(60); // Đặt lại đếm ngược về 60 giây

                const intervalId = setInterval(() => {
                    if (secondsRemaining > 0) {
                        setSecondsRemaining(secondsRemaining - 1); // Giảm thời gian đếm ngược mỗi giây
                    } else {
                        clearInterval(intervalId); // Dừng đếm ngược khi hết thời gian
                        setIsButtonDisabled(false); // Mở khóa nút sau khi đếm ngược kết thúc
                    }
                }, 1000);
            } else {
                toast.error(response.data.message || 'Gửi yêu cầu khôi phục mật khẩu thất bại');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Đã xảy ra lỗi khi gửi yêu cầu khôi phục mật khẩu');
        }
    };

    return (
        <>
            <div className='Container-header'>
                <div className="grid-container" style={{ marginLeft: '55px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Link to="/">
                        <div className='logo' />
                    </Link>
                </div>
            </div>
            <div className="bg-img" style={{ height: '700px' }}>
                <div className="content" style={{ marginTop: '-70px', width: '500px' }} >
                    <h3 className='login-name'>Nhập email của bạn</h3>
                    <Form
                        form={form}
                        name="forgot-password-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        {/* Input cho Email hoặc Số điện thoại */}
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập Email' },
                                { validator: validateEmail }
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="Email"
                                prefix={<UserOutlined />}
                                className="custom-input" // Thêm class để custom style
                            />
                        </Form.Item>
                        <div>
                            <Button type="primary" htmlType="submit" style={{ width: '100%', height: '50px' }} disabled={isButtonDisabled}>
                                {secondsRemaining > 0 ? `Gửi lại sau ${secondsRemaining} giây` : 'Gửi'}
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default FogotPass;
