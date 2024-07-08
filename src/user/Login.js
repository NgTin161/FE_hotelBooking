import React, { useState } from 'react';
import { UserOutlined, LockOutlined, EyeTwoTone, EyeInvisibleOutlined } from '@ant-design/icons';
import { Input, Form, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import { AuthContext, useAuth } from '../axios/AuthContext';
import axios from 'axios';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { axiosJson } from '../axios/axiosCustomize';
import { toast } from 'react-toastify';
import { useContext } from 'react';

const Login = () => {
    const [form] = Form.useForm();
    const { login } = useContext(AuthContext);



    const onFinish = async (values) => {
        try {
            const response = await axiosJson.post('/Users/login', {
                Email: values.username,
                Password: values.password
            });

            if (response.status === 200) {
                console.log('response', response.data)
                login(response.data.token); // Giải mã token và lưu thông tin người dùng
                toast.success('Đăng nhập thành công');
                // Redirect to home or dashboard
                window.location.href = '/';
            } else {
                message.error('Sai tên đăng nhập hoặc mật khẩu');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Đã xảy ra lỗi khi đăng nhập');
        }
    };

    const responseGoogle = async (response) => {
        try {
            const result = await axios.post('https://localhost:7186/api/Users/google-login', {
                tokenId: response.credential,
            });
            console.log(result.data.token);
            toast.success('Đăng nhập thành công');
            login(result.data.token);
            // Lưu token và xử lý đăng nhập thành công
            // localStorage.setItem('jwt', result.data.token);

            setTimeout(() => {
                window.location.href = '/';
            }, 2000);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const responseFacebook = async (response) => {
        try {
            const result = await axios.post('https://localhost:7186/api/Users/facebook-login', {
                tokenId: response.authResponse.accessToken,
            });

            // Lưu token và xử lý đăng nhập thành công
            localStorage.setItem('token', result.data.token);
            // Redirect to home or dashboard
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
            <div className="bg-img" style={{ height: '680px' }}>
                <div className="content"  >
                    <h1 className='login-name'>ĐĂNG NHẬP</h1>
                    <Form
                        form={form}
                        name="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                    >
                        {/* Input cho Email hoặc Số điện thoại */}
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập Email hoặc Số điện thoại!' }]}
                        >
                            <Input
                                size="large"
                                placeholder="Email hoặc Số điện thoại"
                                prefix={<UserOutlined />}
                                className="custom-input" // Thêm class để custom style
                            />
                        </Form.Item>

                        {/* Input cho Mật khẩu */}
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Mật khẩu"
                                prefix={<LockOutlined />}
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                className="custom-input" // Thêm class để custom style
                            />
                        </Form.Item>

                        <div style={{ display: 'flex' }}>
                            <Link to="/forgot-password" style={{ color: 'black' }}>
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <div className='pass'>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <label style={{ color: 'black' }}>
                                    <input type="checkbox" id="rememberMe" />  Nhớ mật khẩu
                                </label>
                            </Form.Item>
                        </div>
                        <div >
                            <Button type="primary" htmlType="submit" style={{ width: '100%', height: '50px' }}>
                                ĐĂNG NHẬP
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
                        <div>
                            {/* <FacebookLogin
                                appId="840379307822970"
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={responseFacebook}
                                icon="fa-facebook"
                            /> */}
                        </div>


                    </div>
                    <div className="signup" style={{ color: 'black' }}>
                        Bạn chưa có tài khoản?
                        <a href="/register"> Đăng ký ngay</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;