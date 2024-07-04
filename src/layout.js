import { Outlet } from "react-router-dom";
import Header from "./user/Header";
import "./layout.css";
import Footer from "./user/Footer";


const Layout = () => {
    return (
        <div>
            <div className='header-container'>
                <Header />

            </div>

            <div style={{ marginTop: '30px', marginBottom: '40px' }}>
                < Outlet />
            </div>
            <Footer />


        </div>
    );
};

export default Layout;