import React from 'react';
import { EyeInvisibleOutlined, EyeTwoTone, UserAddOutlined, LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Input, Form, Button, message, Space } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { axiosJson } from '../axios/axiosCustomize';
import { toast } from 'react-toastify';


const Register = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [form] = Form.useForm();
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validateFullName = (_, value) => {
        const regex = /^[\p{L}\s']+$/u; // Regex cho phép chữ cái (bao gồm các ngôn ngữ và có dấu), dấu cách và dấu nháy đơn
        if (value && regex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Họ và tên không được chứa ký tự đặc biệt và số!'));
    };

    const validatePhoneNumber = (_, value) => {
        if (value && value.length === 10) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Số điện thoại phải có đúng 10 ký tự!'));
    };

    const validateEmail = (_, value) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Regex để kiểm tra định dạng email
        if (value && regex.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Email không hợp lệ!'));
    };
    const validatePassword = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
        },
    });

    // Hàm validator cho độ dài của mật khẩu
    const validatePasswordLength = (_, value) => {
        if (value && value.length >= 6) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Mật khẩu phải có ít nhất 6 ký tự!'));
    };
    const onFinish = async (values) => {
        try {
            console.log('Form values:', values);

            const response = await axiosJson.post('/Users/register', {
                FullName: values.fullname,
                Email: values.email,
                PhoneNumber: values.phonenumber,
                Password: values.password
            });

            console.log('Response:', response);

            if (response.status == 200) {
                toast.success('Đăng ký thành công. Vui lòng tiền hành đăng nhập')
                // localStorage.setItem('jwt', response.data.token);
                // Redirect to home or dashboard
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);

            }
            else {
                toast.error('Đã xảy ra lỗi khi đăng nhập');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Đã xảy ra lỗi khi đăng nhập');
        }
    };


    const responseGoogle = async (response) => {
        try {
            const result = await axiosJson.post('https://localhost:7186/api/Users/google-login', {
                tokenId: response.credential,
            });
            console.log(result.data.token);
            // Lưu token và xử lý đăng nhập thành công
            localStorage.setItem('jwt', result.data.token);
            window.location.href = '/';

        } catch (error) {
            console.error('Error:', error);
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
            <div class="bg-img" style={{ height: '780px' }}>
                <div class="content" style={{}}>
                    <h1 className='login-name'>ĐĂNG KÝ</h1>
                    <Form
                        form={form}
                        name="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        {/* Input cho Email hoặc Số điện thoại */}
                        <Form.Item
                            name="fullname"
                            rules={[
                                { required: true, message: 'Vui lòng nhập Họ và tên' },
                                { validator: validateFullName }
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="Họ và tên"
                                prefix={<UserAddOutlined />}
                                className="custom-input"
                            />
                        </Form.Item>
                        <Form.Item
                            name="phonenumber"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                { validator: validatePhoneNumber }
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="Số điện thoại"
                                prefix={<PhoneOutlined />}
                                className="custom-input"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email' },
                                { validator: validateEmail }
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="Email"
                                prefix={<MailOutlined />}
                                className="custom-input"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Vui lòng nhập Mật khẩu!' },
                                { validator: validatePasswordLength }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Nhập mật khẩu"
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                visibilityToggle={{ visible: passwordVisible, onVisibleChange: togglePasswordVisibility }}
                                size="large"
                            />

                        </Form.Item>

                        <Form.Item
                            name="password2"
                            rules={[
                                { required: true, message: 'Vui lòng nhập mật khẩu lần 2!' },
                                validatePassword,
                                { validator: validatePasswordLength }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="Nhập lại mật khẩu"
                                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                visibilityToggle={{ visible: passwordVisible, onVisibleChange: togglePasswordVisibility }}

                                size="large"
                            />
                        </Form.Item>



                        <div >
                            <Button type="primary" htmlType="submit" style={{ width: '100%', height: '50px' }}>


                                ĐĂNG KÝ
                            </Button>
                        </div>
                    </Form>
                    <div style={{ color: 'black', margin: 10 }}>
                        hoặc
                    </div>
                    <div className="links">
                        <div >
                            <GoogleOAuthProvider clientId="702226400553-a23melhr8d23jmlvn19vmj578922dlkr.apps.googleusercontent.com">
                                <GoogleLogin
                                    onSuccess={responseGoogle}
                                    onError={() => {
                                        console.error('Login Failed');
                                    }}
                                    size='large'
                                    width={330}
                                />
                            </GoogleOAuthProvider>
                        </div>



                    </div>

                    <div class="signup" style={{ color: 'black' }}>
                        Đã có tài khoản? <a href="/login"> Đăng nhập </a>
                    </div>
                </div>
            </div >
        </>
    );
};

export default Register;