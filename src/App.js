import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter, Outlet } from 'react-router-dom';
import Layout from './layout';
import Login from './user/Login';
import Register from './user/Register';
import HotelFilter from './user/HotelFilter';
import Details from './user/Details';

import HomePage from './user/HomePage';
import HotelRegister from './user/HotelRegister';
import LayoutOwner from './Owner/LayoutOwner';
import DashBoard from './Owner/Pages/Booking/DashBoard';
import Information from './Owner/Pages/Booking/Information';
import BookingTable from './Owner/Pages/Booking/BookingTable';
import RoomType from './Owner/Pages/Booking/RoomType';

import Review from './user/Review';

import NotFound from './user/NotFound';
import PrivateRoute from './axios/PrivateRoute';
import FogotPass from './user/FogotPass';
import ConfirmPass from './user/ConfirmPass';
import { AuthProvider } from './axios/AuthContext';

import ConfirmPayment from './user/ConfirmPayment';
import CheckOut from './user/CheckOut';
import HistoryUser from './user/HistoryUser';




function App() {

    return (
        <>

            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<HomePage />} />

                    <Route path="/filter" element={<HotelFilter />} />
                    <Route path="/detail/:id" element={<Details />}></Route>
                    <Route path="/checkout" element={<CheckOut />}></Route>


                    <Route path="/registerhotel" element={<HotelRegister />}></Route>
                    <Route path="/confirm-payment" element={<ConfirmPayment />}></Route>
                </Route>


                <Route path="/user" element={<PrivateRoute><Layout /></PrivateRoute>}>
                    <Route path="history" element={<HistoryUser />} />

                </Route>

                <Route path="/owner" element={<PrivateRoute><LayoutOwner /></PrivateRoute>} >
                    <Route index path="information" element={<Information />} />
                    <Route path="dashboard" element={<DashBoard />} />
                    <Route path="booking" element={<BookingTable />} />
                    <Route path="roomtype" element={<RoomType />} />
                </Route>

                <Route path="/checkout" element={<ConfirmPayment />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/register" element={<Register />}></Route>


                <Route path="/Review" element={<Review />}></Route>

                <Route path="/forgot-password" element={<FogotPass />}></Route>
                <Route path="/reset-password" element={<ConfirmPass />}></Route>
                {/* <Route path="/HistoryBooking" element={<HistoryBooking />}></Route> */}




                <Route path="*" element={<NotFound />}></Route>
            </Routes >


        </>
    );
}

export default App;
