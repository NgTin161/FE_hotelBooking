import React from "react";

const Review = () => {
    return (
        <>

            <div class="containerReview">

                <h2 style={{ textAlign: 'center', marginBottom: 20, }}>Đánh giá khách sạn</h2>


                <div class="input-fieldReview">

                    <label className="labReview" for="title">Tiêu đề:</label>

                    <input className="input-reviewNhap" type="text" id="title" placeholder="  Nhập tiêu đề" />

                </div>


                <div class="input-fieldReview">

                    <label className="labReview" for="rating">Điểm đánh giá:</label>

                    <div className="radioReview">

                        <div>
                            <input type="radio" id="rating1" name="rating" value="1" />

                            <label className="labReview" for="rating1">1</label>
                        </div>

                        <div>
                            <input type="radio" id="rating2" name="rating" value="2" />

                            <label className="labReview" for="rating2">2</label>
                        </div>

                        <div>
                            <input type="radio" id="rating3" name="rating" value="3" />

                            <label className="labReview" for="rating3">3</label>
                        </div>

                        <div>
                            <input type="radio" id="rating4" name="rating" value="4" />

                            <label className="labReview" for="rating4">4</label>
                        </div>

                        <div>
                            <input type="radio" id="rating5" name="rating" value="5" />

                            <label className="labReview" for="rating5">5</label>

                        </div>
                        <div>
                            <input type="radio" id="rating6" name="rating" value="6" />

                            <label className="labReview" for="rating6">6</label>
                        </div>

                        <div>
                            <input type="radio" id="rating7" name="rating" value="7" />

                            <label className="labReview" for="rating7">7</label>
                        </div>

                        <div>
                            <input type="radio" id="rating8" name="rating" value="8" />

                            <label className="labReview" for="rating8">8</label>
                        </div>

                        <div>
                            <input type="radio" id="rating9" name="rating" value="9" />

                            <label className="labReview" for="rating9">9</label>
                        </div>

                        <div>
                            <input type="radio" id="rating10" name="rating" value="10" checked />

                            <label className="labReview" for="rating10">10</label>
                        </div>

                    </div>

                </div>


                <div class="input-fieldReview">

                    <label className="labReview" for="content">Nội dung đánh giá:</label>

                    <textarea id="contentReview" placeholder="Nhập nội dung đánh giá"></textarea>

                </div>


                <div style={{justifyContent:'center',textAlign:'center',}}>
                    <button className="btn-Review">Gửi</button>

                </div>
                <div class="back-button">

                    <a href="#">← Quay lại đơn phòng</a>

                </div>

            </div>


        </>
    );
};

export default Review;