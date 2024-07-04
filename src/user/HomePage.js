import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faPerson, faHouse } from '@fortawesome/free-solid-svg-icons';
import { InputNumber, DatePicker, Dropdown, Menu, Button, AutoComplete, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

import dayjs from 'dayjs';
import axios from 'axios';
import { GlobalOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import { Option } from 'antd/es/mentions';
import { CiLocationOn } from "react-icons/ci";
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';
const urlDateFormat = 'YYYY-MM-DD';


const HomePage = () => {
    const navigate = useNavigate(); // Use useNavigate hook to access navigate function

    const [province, setProvince] = useState();
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1);
    const [options, setOptions] = useState([]);
    const [dataFromApi, setDataFromApi] = useState([]);

    const [checkinDate, setCheckInDate] = useState(null);
    const [checkoutDate, setCheckOutDate] = useState(null);


    // Temporary state for dropdown menu


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                const data = response.data.data;
                setDataFromApi(data);
                setOptions(data.map(item => ({ value: item.full_name, label: item.full_name })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);




    const handleDateChange = (dates, dateStrings) => {
        if (dates) {
            setCheckInDate(dayjs(dateStrings[0], dateFormat).format(urlDateFormat));
            setCheckOutDate(dayjs(dateStrings[1], dateFormat).format(urlDateFormat));
        } else {
            setCheckInDate(null);
            setCheckOutDate(null);
        }
    };

    const disabledDate = (current) => {
        return current && current < dayjs().endOf('day');
    };



    const handleSearch = () => {
        // Đảm bảo numberOfChildren là số và không phải undefined
        const numberOfChildren = typeof children === 'number' ? children : 0;
        console.log('numberOfChildren:', numberOfChildren);

        const queryParams = {
            province: province,
            checkinDate: checkinDate,
            checkoutDate: checkoutDate,
            numberOfAdults: adults,
            numberOfChildren: numberOfChildren,
            numberOfRooms: rooms,
        };

        // Tạo query string từ queryParams
        const queryString = Object.keys(queryParams)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
            .join('&');

        console.log(`/filter?${queryString}`);
        navigate(`/filter?${queryString}`); // Navigate to '/filter' with the generated query string
    };





    const [showDropdown, setShowDropdown] = useState(false);


    const handleSelectChange = (value, option) => {

        setProvince(option.label);
    };

    const handleAdultsChange = (value) => {
        setAdults(value);
    };

    const handleChildrenChange = (value) => {
        setChildren(value);
    };

    const handleRoomsChange = (value) => {
        setRooms(value);
    };

    const handleDropdownVisibleChange = (visible) => {
        setShowDropdown(visible);
    };

    const handleDone = () => {
        setShowDropdown(false); // Đóng dropdown khi hoàn thành nhập liệu
    };

    const [loading, setLoading] = useState(false);
    return (
        <div className='Container-Onlet'>
            <div className='Onlet-body'>
                <div className='onlet-text'>
                    <span className='spanstart'>
                        <h1 style={{ marginTop: 50, marginBottom: 10 }}>DU LỊCH, TRẢI NGHIỆM VÀ THƯ GIẢN CÙNG CASA</h1>
                        <i>------------------------</i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i className="fas fa-star"></i>
                        <i>------------------------</i>
                        <p style={{ color: 'white', marginTop: 20 }}>Tiện ích tức thời  - Không mất phí</p>
                    </span>
                </div>
                <div style={{ display: 'inline-block', alignItems: 'baseline', justifyContent: 'center' }}>
                    <div className='containerSearch'>
                        <div style={{ marginTop: 20 }}>
                            <Select
                                showSearch
                                style={{ width: 250 }}
                                placeholder={
                                    <div style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 'normal', color: 'gray' }}>
                                        <CiLocationOn style={{ fontSize: 20, marginTop: -3, marginRight: 8 }} />
                                        Bạn muốn đến đâu ?
                                    </div>
                                }
                                optionFilterProp="label"
                                loading={loading}
                                filterOption={(input, option) =>
                                    option.props.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onChange={handleSelectChange} // Xử lý khi người dùng chọn một lựa chọn
                            >
                                {dataFromApi.map((province) => (
                                    <Option key={province.id} value={province.full_name} label={province.full_name}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <CiLocationOn style={{ marginRight: 8 }} />
                                            <span>{province.full_name}</span>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <RangePicker
                                value={
                                    checkinDate && checkoutDate
                                        ? [dayjs(checkinDate, urlDateFormat), dayjs(checkoutDate, urlDateFormat)]
                                        : null
                                }
                                style={{ paddingLeft: 30 }}
                                format={dateFormat}
                                placeholder={['Ngày đến', 'Ngày đi']}
                                disabledDate={disabledDate}
                                onChange={handleDateChange}
                            />
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <Select
                                style={{ width: 250 }}
                                value={`${adults} người lớn - ${children} trẻ em - ${rooms} phòng`}
                                open={showDropdown}
                                onDropdownVisibleChange={handleDropdownVisibleChange}
                                dropdownRender={() => (
                                    <div style={{ padding: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                            <label style={{ flex: 1 }}>Người lớn:</label>
                                            <InputNumber
                                                min={1}
                                                max={30}
                                                defaultValue={adults}
                                                value={adults}
                                                onChange={handleAdultsChange}
                                                style={{ flex: 1 }}
                                                changeOnWheel
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                            <label style={{ flex: 1 }}>Trẻ em:</label>
                                            <InputNumber
                                                min={0}
                                                max={30}
                                                value={children}
                                                onChange={handleChildrenChange}
                                                style={{ flex: 1 }}
                                                changeOnWheel
                                            />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                            <label style={{ flex: 1 }}>Phòng:</label>
                                            <InputNumber
                                                min={1}
                                                max={15}
                                                value={rooms}
                                                onChange={handleRoomsChange}
                                                style={{ flex: 1 }}
                                                changeOnWheel
                                            />
                                        </div>
                                        <Button type="primary" style={{ width: '100%' }} onClick={handleDone}>Xong</Button>
                                    </div>
                                )}
                            >
                                <Button style={{}} icon={<UserOutlined />} onClick={() => setShowDropdown(true)}>
                                    {`${adults} người lớn - ${children} trẻ em - ${rooms} phòng`}
                                </Button>
                            </Select>
                        </div>
                        <div style={{ marginTop: 15 }}>
                            <Button style={{ width: 40, height: 40 }} onClick={handleSearch} type="primary" shape="circle" icon={<SearchOutlined />} />
                        </div>
                    </div>
                </div>
            </div >
            <div className='Onlet-list'>


                <div className='welcome'>
                    <div className='row'>
                        <div className='col-sm-6 LearnMore' style={{ marginTop: 30 }}>
                            <h3>
                                WELCOME TO <a style={{ fontWeight: 'bold' }}>CASA Booking</a>
                            </h3>
                            <p>---------------------------------</p>
                            <h4>
                                LUXURY Resort & Room
                                <br />
                                <br />
                            </h4>
                            <h6 style={{ color: 'black', lineHeight: 2, marginLeft: 30, }}>
                                Trang web Booking CASA là một nền tảng trực tuyến tiên tiến, chuyên cung cấp dịch vụ đặt phòng và thuê nhà cho khách du lịch trên toàn thế giới. Với giao diện thân thiện và dễ sử dụng, người dùng có thể dễ dàng tìm kiếm và lựa chọn các loại hình lưu trú từ căn hộ, biệt thự đến nhà nghỉ và homestay. CASA Booking nổi bật với hệ thống đánh giá minh bạch, giúp người dùng có được cái nhìn khách quan và chính xác về chất lượng dịch vụ. Ngoài ra, trang web còn cung cấp nhiều ưu đãi hấp dẫn và dịch vụ hỗ trợ khách hàng 24/7, đảm bảo mang đến cho người dùng những trải nghiệm du lịch tuyệt vời và đáng nhớ.
                                <p style={{ color: 'black', lineHeight: 4, }} >Chúng tôi rất vui khi được mang đến trải nghiệm tốt nhất cho bạn!</p>
                            </h6>

                        </div>
                        <div className='col-sm-6 ' style={{ display: 'flex', gap: 1, marginTop: 10 }}>

                            <div className='col-sm-3'>
                                <img class="moving-image" src='../asset/images/1.jpg' style={{ width: 150, height: 300, marginTop: 30, }} />

                            </div>
                            <div className='col-sm-3'>
                                <img class="moving-imageDif" src='../asset/images/2.jpg' style={{ width: 150, height: 360 }} />
                            </div>
                            <div className='col-sm-3'>
                                <img class="moving-image" src='../asset/images/3.jpg' style={{ width: 150, height: 300, marginTop: 30, }} />
                            </div>

                        </div>

                    </div>
                </div>
                <div className='TOP3' style={{ marginTop: 40, color: 'black', fontWeight: 'bold' }}>
                    <h5 style={{ marginLeft: 30, }}>
                        <Link to='/Details'>ĐANG THỊNH HÀNH <i style={{ color: 'red', marginBottom: 30, }} class="fa-solid fa-fire"></i>
                        </Link>
                        <Link to='/Details' style={{ float: 'right' }}>xem thêm <i class="fa-solid fa-arrow-right"></i>
                        </Link>
                    </h5>
                    <div class="containerTrend">
                        <div class="card" >
                            <img class="card-img-top" src='../asset/images/ks1.jpg' alt="Card image" />
                            <div class="card-body" style={{ lineHeight: 2, }}>
                                <h5 class="card-title" style={{ fontWeight: 'bold' }}>Khách sạn Mường Thanh Hội An</h5>
                                <i class="fa-solid fa-map-pin"> <span>Hội An</span></i>
                                <div >
                                    <i class="fas fa-star bg-yellow-500 "></i>
                                    <i class="fas fa-star bg-yellow-500"></i>
                                    <i class="fas fa-star  bg-yellow-500 "></i>
                                    <i class="fas fa-star  bg-yellow-500 "></i>
                                    <i class="fas fa-star"></i>
                                </div>
                                <div className='sale'>
                                    <div className='rateCard'>
                                        <a href='#'>
                                            5.5
                                        </a>
                                    </div>
                                    <div >
                                        <span class="price-strikethrough">1.990.000 đ</span>
                                        <h3 >990.000 đ</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card" >
                            <img class="card-img-top" src='../asset/images/ks2.jpg' alt="Card image" />
                            <div class="card-body" style={{ lineHeight: 2, }}>
                                <h5 class="card-title" style={{ fontWeight: 'bold' }}>Khách sạn Pha Lê</h5>
                                <i class="fa-solid fa-map-pin"> <span>Vũng Tàu</span></i>
                                <div >
                                    <i class="fas fa-star bg-yellow-500 "></i>
                                    <i class="fas fa-star bg-yellow-500"></i>
                                    <i class="fas fa-star  bg-yellow-500 "></i>
                                    <i class="fas fa-star   "></i>
                                    <i class="fas fa-star"></i>
                                </div>
                                <div className='sale'>
                                    <div className='rateCard'>
                                        <a href='#'>
                                            5.0
                                        </a>
                                    </div>
                                    <div >
                                        <span class="price-strikethrough">590.000 đ</span>
                                        <h3 >490.000 đ</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card" >
                            <img class="card-img-top" src='../asset/images/ks3.jpg' alt="Card image" />
                            <div class="card-body" style={{ lineHeight: 2, }}>
                                <h5 class="card-title" style={{ fontWeight: 'bold' }}>Khách sạn The Song</h5>
                                <i class="fa-solid fa-map-pin"> <span>Vũng Tàu</span></i>
                                <div >
                                    <i class="fas fa-star bg-yellow-500 "></i>
                                    <i class="fas fa-star bg-yellow-500"></i>
                                    <i class="fas fa-star  bg-yellow-500 "></i>
                                    <i class="fas fa-star  bg-yellow-500 "></i>
                                    <i class="fas fa-star bg-yellow-500"></i>
                                </div>
                                <div className='sale'>
                                    <div className='rateCard'>
                                        <a href='#'>
                                            .6
                                        </a>
                                    </div>
                                    <div >
                                        <span class="price-strikethrough">520.000 đ</span>
                                        <h3 >390.000 đ</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card" >
                            <img class="card-img-top" src='../asset/images/ks4.jpg' alt="Card image" />
                            <div class="card-body" style={{ lineHeight: 2, }}>
                                <h5 class="card-title" style={{ fontWeight: 'bold' }}>The IMPERIAL Hotel</h5>
                                <i class="fa-solid fa-map-pin"> <span>Hội An</span></i>
                                <div >
                                    <i class="fas fa-star bg-yellow-500 "></i>
                                    <i class="fas fa-star bg-yellow-500"></i>
                                    <i class="fas fa-star  bg-yellow-500 "></i>
                                    <i class="fas fa-star  bg-yellow-500 "></i>
                                    <i class="fas fa-star"></i>
                                </div>
                                <div className='sale'>
                                    <div className='rateCard'>
                                        <a href='#'>
                                            7.5
                                        </a>
                                    </div>
                                    <div >
                                        <span class="price-strikethrough">990.000 đ</span>
                                        <h3 >790.000 đ</h3>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>

                <div className='TOP3' style={{ top: 0, color: 'black', fontWeight: 'bold', marginBottom: 40, }}>
                    <h5 style={{ marginLeft: 30, }}><Link to='/Details'>ĐÃ QUAN TÂM GẦN ĐÂY</Link>
                        <Link to='/Details' style={{ float: 'right' }}>xem thêm <i class="fa-solid fa-arrow-right"></i>
                        </Link>
                    </h5>
                </div>
                <div className='room'>
                    <div class="card" >
                        <img class="card-img-top" src='../asset/images/ks1.jpg' alt="Card image" />
                        <div class="card-body" style={{ lineHeight: 2, }}>
                            <h5 class="card-title" style={{ fontWeight: 'bold' }}>Khách sạn Mường Thanh Hội An</h5>
                            <i class="fa-solid fa-map-pin"> <span>Hội An</span></i>
                            <div >
                                <i class="fas fa-star bg-yellow-500 "></i>
                                <i class="fas fa-star bg-yellow-500"></i>
                                <i class="fas fa-star  bg-yellow-500 "></i>
                                <i class="fas fa-star  bg-yellow-500 "></i>
                                <i class="fas fa-star"></i>
                            </div>
                            <div className='sale'>
                                <div className='rateCard'>
                                    <a href='#'>
                                        5.5
                                    </a>
                                </div>
                                <div >
                                    <span class="price-strikethrough">1.990.000 đ</span>
                                    <h3 >990.000 đ</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card" >
                        <img class="card-img-top" src='../asset/images/ks2.jpg' alt="Card image" />
                        <div class="card-body" style={{ lineHeight: 2, }}>
                            <h5 class="card-title" style={{ fontWeight: 'bold' }}>Khách sạn Pha Lê</h5>
                            <i class="fa-solid fa-map-pin"> <span>Vũng Tàu</span></i>
                            <div >
                                <i class="fas fa-star bg-yellow-500 "></i>
                                <i class="fas fa-star bg-yellow-500"></i>
                                <i class="fas fa-star  bg-yellow-500 "></i>
                                <i class="fas fa-star   "></i>
                                <i class="fas fa-star"></i>
                            </div>
                            <div className='sale'>
                                <div className='rateCard'>
                                    <a href='#'>
                                        5.0
                                    </a>
                                </div>
                                <div >
                                    <span class="price-strikethrough">590.000 đ</span>
                                    <h3 >490.000 đ</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card" >
                        <img class="card-img-top" src='../asset/images/ks3.jpg' alt="Card image" />
                        <div class="card-body" style={{ lineHeight: 2, }}>
                            <h5 class="card-title" style={{ fontWeight: 'bold' }}>Khách sạn The Song</h5>
                            <i class="fa-solid fa-map-pin"> <span>Vũng Tàu</span></i>
                            <div >
                                <i class="fas fa-star bg-yellow-500 "></i>
                                <i class="fas fa-star bg-yellow-500"></i>
                                <i class="fas fa-star  bg-yellow-500 "></i>
                                <i class="fas fa-star  bg-yellow-500 "></i>
                                <i class="fas fa-star bg-yellow-500"></i>
                            </div>
                            <div className='sale'>
                                <div className='rateCard'>
                                    <a href='#'>
                                        .6
                                    </a>
                                </div>
                                <div >
                                    <span class="price-strikethrough">520.000 đ</span>
                                    <h3 >390.000 đ</h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card" >
                        <img class="card-img-top" src='../asset/images/ks4.jpg' alt="Card image" />
                        <div class="card-body" style={{ lineHeight: 2, }}>
                            <h5 class="card-title" style={{ fontWeight: 'bold' }}>The IMPERIAL Hotel</h5>
                            <i class="fa-solid fa-map-pin"> <span>Hội An</span></i>
                            <div >
                                <i class="fas fa-star bg-yellow-500 "></i>
                                <i class="fas fa-star bg-yellow-500"></i>
                                <i class="fas fa-star  bg-yellow-500 "></i>
                                <i class="fas fa-star  bg-yellow-500 "></i>
                                <i class="fas fa-star"></i>
                            </div>
                            <div className='sale'>
                                <div className='rateCard'>
                                    <a href='#'>
                                        7.5
                                    </a>
                                </div>
                                <div >
                                    <span class="price-strikethrough">990.000 đ</span>
                                    <h3 >790.000 đ</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className='blogs-back'>
                    <h3 style={{ marginLeft: 30, marginTop: 10, color: 'gray', fontWeight: 'bold', marginBottom: 40, fontSize: 50, }}>Blogs</h3>
                    <div className='container-blogs'>
                        <div class="itemBlogs " >
                            <div style={{ display: 'grid', marginTop: 25, }}>
                                <img className='pic-blogs' src='../asset/images/yp.jpg' alt="Card image" style={{ width: 300, height: 150, }} />
                            </div>
                            <div style={{ display: 'grid', marginTop: 30, }}>
                                <a style={{ color: 'black', fontWeight: 'bold' }}>Đến thành phố Hồ Chí Minh ta nên đi đâu ?</a>
                                <button class="styled-button-xemngay">Xem Ngay</button>
                            </div>

                        </div>
                        <div class="itemBlogs ">
                            <div style={{ display: 'grid', marginTop: 25, }}>
                                <img className='pic-blogs' src='../asset/images/tcv.jpg' alt="Card image" style={{ width: 300, height: 150, }} />
                            </div>
                            <div style={{ display: 'grid', marginTop: 30, }}>
                                <a style={{ color: 'black', fontWeight: 'bold' }}>thành phố Hồ Chí Minh có gì vui ?</a>
                                <button class="styled-button-xemngay">Xem Ngay</button>
                            </div>
                        </div>
                        <div class="itemBlogs ">
                            <div style={{ display: 'grid', marginTop: 25, }}>
                                <img className='pic-blogs' src='../asset/images/coffee.jpg' alt="Card image" style={{ width: 300, height: 150, }} />
                            </div>
                            <div style={{ display: 'grid', marginTop: 30, }}>
                                <a style={{ color: 'black', fontWeight: 'bold' }}>CheckIn coffee chill cùng các món thức uống mới ?</a>
                                <button class="styled-button-xemngay">Xem Ngay</button>
                            </div>
                        </div>
                        <div class="itemBlogs ">
                            <div style={{ display: 'grid', marginTop: 25, }}>
                                <img className='pic-blogs' src='../asset/images/ngon.jpg' alt="Card image" style={{ width: 300, height: 150, }} />
                            </div>
                            <div style={{ display: 'grid', marginTop: 30, }}>
                                <a style={{ color: 'black', fontWeight: 'bold' }}>Đến thành phố Hồ Chí Minh ta nên ăn gì ?</a>
                                <button class="styled-button-xemngay">Xem Ngay</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div >


    );
}

export default HomePage;
