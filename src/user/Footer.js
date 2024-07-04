import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
    
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <h3>Thông tin công ty</h3>
                    <p>Địa chỉ: 123 Đường Cao Thắng, Quận 3, TP. Hồ Chí Minh</p>
                    <p>SĐT: (0123) 456-7890</p>
                    <p>Email: Ad@company.com</p>
                </div>
                <div className="footer-column">
                    <h3>Dịch vụ</h3>
                    <ul>
                        <li><a href="#">Thuê xe du lịch</a></li>
                        <li><a href="#">Tour du lịch</a></li>
                        <li><a href="#">Chính sách bảo mật</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Hỗ trợ</h3>
                    <ul>
                        <li><a href="#">Câu hỏi thường gặp</a></li>
                        <li><a href="#">Trung tâm hỗ trợ</a></li>
                        <li><a href="#">Hướng dẫn sử dụng</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Kết nối với chúng tôi</h3>
                    <ul className="social-icons">
                        <li><a href="#"><FontAwesomeIcon icon={faFacebookF} /></a></li>
                        <li><a href="#"><FontAwesomeIcon icon={faTwitter} /></a></li>
                        <li><a href="#"><FontAwesomeIcon icon={faInstagram} /></a></li>
                        <li><a href="#"><FontAwesomeIcon icon={faLinkedinIn} /></a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
