import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { AutoComplete, DatePicker, Dropdown, InputNumber, Menu, Select, Table, Slider, Checkbox, Button as AntButton, Row, Col, message, Button, Typography, Form, Card, Image, Rate } from 'antd';
import { GlobalOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Option } from 'antd/es/mentions';
import moment from 'moment';
import Map from '../Components/Map';
import { axiosJson } from '../axios/axiosCustomize';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import SpinComponents from '../Components/Spin';
import { CiLocationOn } from 'react-icons/ci';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { FaLocationDot } from 'react-icons/fa6';
import { GrMapLocation } from "react-icons/gr";
import InfiniteScroll from 'react-infinite-scroll-component';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = 'DD/MM/YYYY';
const urlDateFormat = 'YYYY-MM-DD';
const HotelFilter = () => {
    const navigate = useNavigate();

    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1);
    const [options, setOptions] = useState([]);
    const [dataFromApi, setDataFromApi] = useState([]);



    const [checkinDate, setCheckInDate] = useState(null);
    const [checkoutDate, setCheckOutDate] = useState(null);
    const [province, setProvince] = useState(null);


    const [hotelData, setHotelData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
                const data = response.data.data;
                setDataFromApi(data);
                setOptions(data.map(item => ({ value: item.full_name, label: item.full_name })));

                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const province = urlParams.get('province');
                setProvince(province.replace('+', ' '))

                const checkIn = urlParams.get('checkinDate');
                const checkOut = urlParams.get('checkoutDate');
                setCheckInDate(checkIn);
                setCheckOutDate(checkOut);

                const numberOfAdults = urlParams.get('numberOfAdults');
                setAdults(numberOfAdults);
                const numberOfChildren = urlParams.get('numberOfChildren');
                setChildren(numberOfChildren);
                const numberOfRooms = urlParams.get('numberOfRooms');
                setRooms(numberOfRooms);
                console.log('Province:', province);
                console.log('Checkin Date:', checkIn);
                console.log('Checkout Date:', checkOut);
                console.log('Number of Adults:', numberOfAdults);
                console.log('Number of Children:', numberOfChildren);
                console.log('Number of Rooms:', numberOfRooms);
                const responseHotelData = await axiosJson.get(`/Hotels/getavailablehotel?province=${province}&checkinDate=${checkIn}&checkoutDate=${checkOut}&numberOfAdults=${numberOfAdults}&numberOfChildren=${numberOfChildren}&numberOfRooms=${numberOfRooms}`);
                setHotelData(responseHotelData.data);
                console.log('Data:', responseHotelData.data);
                // Xử lý dữ liệu nhận được ở đây (nếu cần)
            } catch (error) {
                console.error('Error:', error);
                // Xử lý lỗi ở đây (nếu cần)
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

        const url = `/filter?${queryString}`;
        console.log(url);

        // Mở trang trong một tab mới
        window.open(url, '_blank');
    };


    const [priceRange, setPriceRange] = useState([100000, 2000000]);
    const [sortOrder, setSortOrder] = useState('asc');

    const [filters, setFilters] = useState({
        acceptChildren: false,
        acceptPet: false,
        supportPeopleWithDisabilities: false,
        haveElevator: false,
        haveSwimmingPool: false,
        ratingStarts: Array(5).fill(false), // Array for 5 stars
    });

    const handlePriceChange = (value) => {
        setPriceRange(value);
    };
    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.checked,
        });
    };

    const handleRatingChange = (index) => {
        const newRatingStars = filters.ratingStarts.map((checked, i) => (i === index ? !checked : checked));
        setFilters({
            ...filters,
            ratingStarts: newRatingStars,
        });
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


    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);



    // const filteredHotels = hotelData
    //     .filter((hotel) => {
    //         return (
    //             hotel.price >= priceRange[0] &&
    //             hotel.price <= priceRange[1] &&
    //             (filters.ratingStarts.every((checked, index) => !checked) || filters.ratingStarts[hotel.ratingStarts - 1]) &&
    //             (!filters.acceptChildren || hotel.acceptChildren) &&
    //             (!filters.acceptPet || hotel.acceptPet) &&
    //             (!filters.supportPeopleWithDisabilities || hotel.supportPeopleWithDisabilities) &&
    //             (!filters.haveElevator || hotel.haveElevator) &&
    //             (!filters.haveSwimmingPool || hotel.haveSwimmingPool)
    //         );
    //     })
    //     .sort((a, b) => {
    //         if (sortOrder === 'asc') {
    //             return a.price - b.price;
    //         } else {
    //             return b.price - a.price;
    //         }
    //     });
    const [filteredHotels, setFilteredHotels] = useState([]);
    useEffect(() => {
        const filtered = hotelData
            .filter((hotel) => {
                return (
                    hotel.price >= priceRange[0] &&
                    hotel.price <= priceRange[1] &&
                    (filters.ratingStarts.every((checked, index) => !checked) || filters.ratingStarts[hotel.ratingStarts - 1]) &&
                    (!filters.acceptChildren || hotel.acceptChildren) &&
                    (!filters.acceptPet || hotel.acceptPet) &&
                    (!filters.supportPeopleWithDisabilities || hotel.supportPeopleWithDisabilities) &&
                    (!filters.haveElevator || hotel.haveElevator) &&
                    (!filters.haveSwimmingPool || hotel.haveSwimmingPool)
                );
            })
            .sort((a, b) => {
                if (sortOrder === 'asc') {
                    return a.price - b.price;
                } else {
                    return b.price - a.price;
                }
            });
        setFilteredHotels(filtered);
        setItems(filtered.slice(0, 5));
        setPage(2);
        setHasMore(filtered.length > 5);
    }, [hotelData, priceRange, filters, sortOrder]);

    const fetchMoreData = () => {
        const newItems = filteredHotels.slice((page - 1) * 5, page * 5); // Mỗi lần tải 5 mục
        setItems((prevItems) => [...prevItems, ...newItems]);

        if (newItems.length === 0 || newItems.length < 5) {
            setHasMore(false);
        }
        setPage(page + 1);
    };
    return (
        <>
            <div className='row' style={{ top: '-60px' }}>
                <div className='containerSearch' style={{ width: '910px' }}>
                    <div style={{ marginTop: 20 }}>
                        <Select
                            value={province}
                            showSearch
                            style={{ width: 250 }}
                            placeholder={
                                <div style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 'normal', color: 'gray' }}>
                                    <CiLocationOn style={{ fontSize: 20, marginTop: 5, marginRight: 8 }} />
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
            <div className='container' style={{ display: 'flex', gap: 20 }}>
                <div className="" style={{ width: '30%' }}>
                    <div style={{ border: '1px solid  #379AE6FF', borderRadius: '18px' }}>
                        <div className='' style={{ height: '180px' }}>
                            <Map hotelData={hotelData} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 200 }}>
                            <Select defaultValue="asc" style={{ display: 'flex', textAlign: 'center', justifyContent: 'center', width: 210 }} onChange={(value) => setSortOrder(value)}>
                                <Option value="asc">Sắp xếp theo giá thấp nhất</Option>
                                <Option value="desc">Sắp xếp theo giá cao nhất</Option>
                            </Select>
                        </div>
                        <div style={{ padding: '20px', marginTop: 0, display: 'flex', flexDirection: 'column' }}>
                            <Typography.Title level={5}>Giá tiền của bạn:</Typography.Title>
                            <Slider
                                range
                                value={priceRange}
                                onChange={handlePriceChange}
                                defaultValue={[100000, 2000000]}
                                min={100000}
                                max={2000000}
                            />

                            <Typography variant="body" color="textSecondary">Từ: {priceRange[0].toLocaleString()} VND - Đến: {priceRange[1].toLocaleString()} VND</Typography>


                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: '10px' }}>
                                <Typography.Title level={5}> Dịch vụ chung của khách sạn:</Typography.Title>
                                <Checkbox name="acceptChildren" checked={filters.acceptChildren} onChange={handleFilterChange} >Chấp nhận trẻ em</Checkbox>
                                <Checkbox name="acceptPet" checked={filters.acceptPet} onChange={handleFilterChange}>Chấp nhận thú cưng </Checkbox>
                                <Checkbox name="supportPeopleWithDisabilities" checked={filters.supportPeopleWithDisabilities} onChange={handleFilterChange}>Hỗ trợ người khuyết tật</Checkbox>
                                <Checkbox checked={filters.haveElevator} onChange={handleFilterChange} name="haveElevator" >Có thang máy</Checkbox>
                                <Checkbox checked={filters.haveSwimmingPool} onChange={handleFilterChange} name="haveSwimmingPool">Có hồ bơi</Checkbox>
                            </div>

                            <div style={{ marginTop: '10px' }}>
                                <Typography.Title level={5}>Số sao:</Typography.Title>
                                {[...Array(5)].map((_, index) => (
                                    <Form.Item key={index} style={{ marginBottom: 0 }}>
                                        <Checkbox

                                            checked={filters.ratingStarts[index]}
                                            onChange={() => handleRatingChange(index)}
                                        >
                                            {`${index + 1} sao`} <i className="fa-solid fa-star" style={{ color: 'yellow' }}></i>
                                        </Checkbox>
                                    </Form.Item>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container" style={{ width: '70%' }}>
                    <Typography.Title level={3}>
                        Có {filteredHotels.length} khách sạn từ ngày{' '}
                        {checkinDate ? moment(checkinDate).format('DD-MM-YY') : 'không có ngày'} đến{' '}
                        {checkoutDate ? moment(checkoutDate).format('DD-MM-YY') : 'không có ngày'}
                    </Typography.Title>
                    <InfiniteScroll
                        dataLength={items.length}
                        next={fetchMoreData}
                        hasMore={hasMore}
                        loader={<SpinComponents />}
                        endMessage={<p>Đã tải hết dữ liệu!</p>}
                    >
                        {items?.length > 0 ? (
                            items?.map((hotel) => (
                                <div className='container' style={{ padding: 0 }}>

                                    <Card className='card-hotel' style={{ border: '1px solid #379AE6FF', marginBottom: 15 }}  >
                                        <div style={{ display: 'flex' }}>
                                            <div style={{ padding: 15, }} >
                                                <img src={hotel.imageUrl} alt={hotel.hotelName} className='img-hotel-card' />
                                            </div>
                                            <div style={{ padding: '10px' }}>
                                                <Typography.Title level={4} style={{ color: ' #379AE6FF' }}>{hotel.hotelName}</Typography.Title>
                                                <p> <Rate disabled value={hotel.ratingStarts} /></p>
                                                <Typography.Title level={5} style={{ display: 'flex', gap: 5 }}><GrMapLocation style={{ color: ' #379AE6FF' }} size={26} />  {hotel.province}</Typography.Title>
                                                <Typography.Title level={5} style={{ display: 'flex', gap: 5 }}><FaLocationDot style={{ color: ' #379AE6FF' }} size={26} />  {hotel.address}</Typography.Title>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                                                    <span>Chấp nhận trẻ em: {hotel.acceptChildren ? 'Có' : 'Không'}</span>
                                                    <span>Chấp nhận thú cưng: {hotel.acceptPet ? 'Có' : 'Không'}</span>
                                                    <span>Hỗ trợ người khuyết tật: {hotel.supportPeopleWithDisabilities ? 'Có' : 'Không'}</span>
                                                    <span>Có thang máy: {hotel.haveElevator ? 'Có' : 'Không'}</span>
                                                    <span>Có hồ bơi: {hotel.haveSwimmingPool ? 'Có' : 'Không'}</span>
                                                </div>
                                                <div style={{ display: 'flex', marginTop: '15px', justifyContent: 'space-between' }}>
                                                    <div style={{ fontSize: 20, color: 'red' }}>Giá từ: {hotel.price.toLocaleString()} VND    </div>

                                                    <Link
                                                        to={{
                                                            pathname: `/detail/${hotel.id}`,
                                                            search: queryString.stringify({
                                                                checkinDate: checkinDate,
                                                                checkoutDate: checkoutDate,
                                                                numberOfAdults: adults,
                                                                numberOfChildren: children,
                                                                numberOfRooms: rooms

                                                            }),
                                                        }}
                                                    >
                                                        <Button className='button-user'> Xem chỗ trống >> </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                </div>

                            ))
                        ) : (

                            <SpinComponents />
                        )}

                    </InfiniteScroll>


                </div>

            </div >

        </>
    );
};

export default HotelFilter;

const hotels = [
    // Dữ liệu giả lập
    { id: 1, name: 'Hotel A', price: 1500000, ratingStars: 4, acceptChildren: true, acceptPet: false, supportPeopleWithDisabilities: true, haveElevator: true, haveSwimmingPool: true },
    { id: 2, name: 'Hotel B', price: 1000000, ratingStars: 3, acceptChildren: true, acceptPet: true, supportPeopleWithDisabilities: false, haveElevator: false, haveSwimmingPool: false },
    // Thêm dữ liệu khách sạn khác
];