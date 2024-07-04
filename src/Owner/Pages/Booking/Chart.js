import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Tháng 4',
    'Tổng doanh thu (VND)': 500000000,
    'Tỷ lệ lấp đầy (%)': 75,
  },
  {
    name: 'Tháng 5',
    'Tổng doanh thu (VND)': 420000000,
    'Tỷ lệ lấp đầy (%)': 63,
  },
  {
    name: 'Tháng 6',
    'Tổng doanh thu (VND)': 300000000,
    'Tỷ lệ lấp đầy (%)': 50,
  },
];

const Chart = ({ getMonthlyRevenue }) => {

  if (!getMonthlyRevenue || getMonthlyRevenue.length === 0) {
    return <p>No data available</p>;
  }

  const formattedData = getMonthlyRevenue.map(entry => ({
    name: `Tháng ${entry.month}/${entry.year}`, // Tạo tên tháng/năm
    'Tổng doanh thu (VND)': entry.totalRevenue,
    'Tỷ lệ lấp đầy (%)': entry.occupancyRate * 100, // Chuyển đổi tỷ lệ thành phần trăm
  }));
  const maxRevenue = Math.max(...formattedData?.map((entry) => entry['Tổng doanh thu (VND)']));
  const maxOccupancyRate = Math.max(...formattedData?.map((entry) => entry['Tỷ lệ lấp đầy (%)']));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={formattedData} // Sử dụng dữ liệu đã được chuyển đổi
        margin={{
          top: 30,
          right: 50,
          left: 30,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          yAxisId="left" // Chỉ định ID của trục Y chính
          orientation="left" // Định hướng của trục Y
          stroke="#1890ff" // Màu của đường viền trục Y
          domain={[0, 'auto']} // Domain của trục Y chính
        />
        <YAxis
          yAxisId="right" // Chỉ định ID của trục Y phụ
          orientation="right" // Định hướng của trục Y
          stroke="gold" // Màu của đường viền trục Y
          // domain={[0, maxOccupancyRate + (0.1 * maxOccupancyRate)]} // Domain của trục Y phụ
          domain={[0, 'auto']}
        />
        <Tooltip />
        <Legend />
        <Bar
          yAxisId="left" // Sử dụng trục Y chính
          dataKey="Tổng doanh thu (VND)"
          fill="#1890ff"
        />
        <Bar
          yAxisId="right" // Sử dụng trục Y phụ
          dataKey="Tỷ lệ lấp đầy (%)"
          fill="gold"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;