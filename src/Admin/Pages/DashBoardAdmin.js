import { Button, DatePicker, Select, Statistic } from 'antd';
import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { CiLocationOn } from 'react-icons/ci';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { axiosJson } from '../../axios/axiosCustomize';
import { toast } from 'react-toastify';
import CountUp from 'react-countup';
dayjs.extend(customParseFormat);
const { Option } = Select;


const formatter = (value) => (
  <CountUp
    end={value}
    separator=","
    formattingFn={(value) => `${value.toLocaleString()} VND`}
  />
);


const DashBoardAdmin = () => {

  const [province, setProvince] = useState();
  const [options, setOptions] = useState([]);
  const [dataFromApi, setDataFromApi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]);

  const [checkInDate, setCheckInDate] = useState(dayjs());
  const [checkOutDate, setCheckOutDate] = useState(dayjs());
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get('https://esgoo.net/api-tinhthanh/1/0.htm');
        const data = response.data.data;
        setDataFromApi(data);
        setOptions(data.map(item => ({ value: item.full_name, label: item.full_name })));
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchProvinces();
  }, []);

  const handleSelectChange = (value, option) => {
    setProvince(option.label);
  };

  const handleCheckInChange = (date, dateString) => {
    setCheckInDate(date ? dayjs(date).format('YYYY-MM-DD') : null);
  };

  const handleCheckOutChange = (date, dateString) => {
    setCheckOutDate(date ? dayjs(date).format('YYYY-MM-DD') : null);
  };


  const fetchSummary = async () => {
    if (!province) {
      alert('Vui lòng chọn một tỉnh thành.');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosJson.get(`/Admin/get-booking-summary-by-admin`, {
        params: {
          province,
          checkinDate: checkInDate,
          checkOutDate: checkOutDate,
        }
      });
      toast.success("Cập nhật thành công")
      setSummary(response.data);
    } catch (error) {
      toast.error("Cập nhật thất bại")
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Select
        showSearch
        style={{ width: 250 }}
        placeholder={
          <div style={{ display: 'inline-flex', alignItems: 'center', fontWeight: 'normal', color: 'gray' }}>
            <CiLocationOn style={{ fontSize: 20, marginTop: -3, marginRight: 8 }} />
            Chọn khu vực ?
          </div>
        }
        optionFilterProp="label"
        loading={loading}
        filterOption={(input, option) =>
          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        onChange={handleSelectChange}
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
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, marginTop: 10 }}>
        <p style={{ display: 'flex', alignItems: 'center' }}>Ngày bắt đầu: </p>
        <DatePicker
          value={checkInDate ? dayjs(checkInDate, 'YYYY-MM-DD') : null}
          format={'DD-MM-YYYY'}
          placeholder={'Ngày đến'}
          onChange={handleCheckInChange}
          style={{ marginBottom: 16 }}
        />

        <p style={{ display: 'flex', alignItems: 'center' }}>Ngày kết thúc:</p>
        <DatePicker
          value={checkOutDate ? dayjs(checkOutDate, 'YYYY-MM-DD') : null}
          format={'DD-MM-YYYY'}
          placeholder={'Ngày đi'}
          onChange={handleCheckOutChange}
          style={{ marginBottom: 16 }}
        />
        <Button type="primary" onClick={fetchSummary} style={{ marginLeft: 16 }}>
          Lấy thống kê
        </Button>
      </div>
      <div style={{ display: 'flex', gap: 30, margin: 10 }}>
        <Statistic
          style={{
            borderRadius: "30px",
            width: 250,
            textAlign: 'center',
            backgroundColor: '#379AE6FF',
            padding: '20px'
          }}
          title={<span style={{ color: 'white', fontSize: '20px' }}>Doanh thu </span>} // Increase title font size
          value={summary.totalAmount}
          valueStyle={{ color: 'white', fontSize: '30px' }} // Increase value font size
          formatter={formatter}
        />
        <Statistic
          style={{
            borderRadius: "30px",
            width: 250,
            textAlign: 'center',
            backgroundColor: '#379AE6FF',
            padding: '20px'
          }}
          title={<span style={{ color: 'white', fontSize: '20px' }}>Hoa hồng nhận được </span>} // Increase title font size
          value={summary.totalCommission}
          valueStyle={{ color: 'white', fontSize: '30px' }} // Increase value font size
          formatter={formatter}
        />
        <Statistic
          style={{
            borderRadius: "30px",
            width: 250,
            textAlign: 'center',
            backgroundColor: '#379AE6FF',
            padding: '20px'
          }}
          title={<span style={{ color: 'white', fontSize: '20px' }}>Tổng số khách</span>} // Increase title font size
          value={summary.totalPassengers}
          valueStyle={{ color: 'white', fontSize: '30px' }} // Increase value font size
        // formatter={formatter}
        /></div>



      <div style={{ display: 'flex', gap: 30, margin: 10 }}>
        <Statistic

          style={{
            borderRadius: "30px",
            width: 250,
            textAlign: 'center',
            backgroundColor: '#379AE6FF',
            padding: '20px'
          }}
          title={<span style={{ color: 'white', fontSize: '20px' }}>Số khách sạn được đặt</span>} // Increase title font size
          value={`${summary.totalHotels ?? 0}/${summary.totalHotelsInProvince ?? 0}`}
          valueStyle={{ color: 'white', fontSize: '30px' }} // Increase value font size
        // formatter={formatter}
        />
        <Statistic
          style={{
            borderRadius: "30px",
            width: 250,
            textAlign: 'center',
            backgroundColor: '#379AE6FF',
            padding: '20px'
          }}
          title={<span style={{ color: 'white', fontSize: '20px' }}>Tổng số lượt đặt phòng</span>} // Increase title font size
          value={summary.totalBookings}
          valueStyle={{ color: 'white', fontSize: '30px' }} // Increase value font size
        // formatter={formatter}
        />
        <Statistic
          style={{
            borderRadius: "30px",
            width: 250,
            textAlign: 'center',
            backgroundColor: '#379AE6FF',
            padding: '20px'
          }}
          title={<span style={{ color: 'white', fontSize: '20px' }}>Tổng số phòng được đặt</span>} // Increase title font size
          value={summary.totalRoomsBooked}
          valueStyle={{ color: 'white', fontSize: '30px' }} // Increase value font size
        // formatter={formatter}
        />
      </div>


    </>
  );
};

export default DashBoardAdmin;