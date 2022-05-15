import styles from "../modalInProcessingOrders/ModalInProcessingOrders.module.css";
import closeBtn from "../../images/closeBtn.png";
import dayjs from "dayjs";
import axios from "axios";


const ModalInOrderHistory = ({ modal, setModal, modalData, setModalData, navigate}) => {


    console.log('modalData',modalData);


    return (

        <div className={styles.outter_modal} onClick={(e)=>{
            console.log('outter_modal clicked')
            setModal(prev => !prev);
        }}>

            <div className={styles.inner_modal} onClick={(e)=>{
                console.log('inner_modal clicked')}}>
                <div className={styles.modal_box} onClick={(e)=>{
                    //위로 이벤트 전파 막기 위해 e.stopPropagation()사용 !!
                    e.stopPropagation();
                    console.log('modal_box clicked')}}>
                    <div className={styles.modal_box_header}>
                        <div className={styles.modal_box_header_left}>
                            <a className={styles.modal_box_header_left_text}>주문상세</a>
                        </div>
                        <a className={styles.modal_box_header_right} onClick={()=>setModal(prev => !prev)}>
                            <img className={styles.modal_box_header_right_img} src={closeBtn}/>
                        </a>
                    </div>
                    <div className={styles.modal_box_content}>
                        <div className={styles.modal_box_left_content_wrapper}>
                            <div className={styles.modal_box_left_content}>
                                <div className={styles.modal_box_left_content_1}>
                                    <div className={styles.modal_box_left_content_1_line1}>
                                        <div className={styles.modal_box_left_content_1_orderbox}>
                                            <p className={styles.modal_box_left_content_1_orderbox_ordernum}>주문번호</p>
                                            <p className={styles.modal_box_left_content_1_orderbox_ordernumtext}>#{modalData.orderId}</p>
                                        </div>
                                        <div>
                                            <p className={styles.modal_box_left_content_1_orderbox_ordertime}>{dayjs(new Date()).format("h:mm A")}</p>
                                        </div>

                                    </div>
                                    <div className={styles.modal_box_left_content_1_line2}>
                                        <div className={styles.modal_box_left_content_1_orderstatus}>
                                            <p className={styles.modal_box_left_content_1_orderstatus_menu}>메뉴{modalData.orderDetailList.length}개</p>
                                            <p className={styles.modal_box_left_content_1_orderstatus_price}>{modalData.finalAmount.toLocaleString()}원</p>
                                            <p className={styles.modal_box_left_content_1_orderstatus_status}>{modalData.orderStatus}</p>
                                        </div>
                                    </div>
                                </div>


                                <div className={styles.modal_box_left_content_2}>
                                    {modalData.orderDetailList.map((orderDetailInfo, index)=>{return (
                                        <div className={styles.modal_box_left_content_2_menuList}>
                                            <p className={styles.modal_box_left_content_2_menuList_title}>{orderDetailInfo.itemName}</p>
                                            <p className={styles.modal_box_left_content_2_menuList_cnt}>{orderDetailInfo.quantity}</p>
                                            <p className={styles.modal_box_left_content_2_menuList_price}>{orderDetailInfo.amount.toLocaleString()}원</p>
                                        </div>)
                                    })}
                                </div>



                                <div className={styles.modal_box_left_content_3}>
                                    <div className={styles.modal_box_left_content_3_ordersummary}>
                                        <p className={styles.modal_box_left_content_3_ordersummary_total}>총합계</p>
                                        <p className={styles.modal_box_left_content_3_ordersummary_totalcnt}>{modalData.orderDetailList.length}</p>
                                        <p className={styles.modal_box_left_content_3_ordersummary_totalprice}>{modalData.finalAmount.toLocaleString()}원</p>
                                    </div>
                                </div>



                            </div>
                        </div>

                        <div className={styles.modal_box_right_content_wrapper}>
                            <div className={styles.modal_box_right_content}>
                                <div className={styles.modal_box_right_content_1}>
                                    <div className={styles.modal_box_right_content_1_left}>
                                        <p>{modalData.orderStatus}</p>
                                    </div>
                                    <div className={styles.modal_box_right_content_1_right}>
                                        <p>{dayjs(modalData.arrivingTime).format("h:mm A")} (30분 후)</p>
                                        <p>32Km 남음 </p>
                                    </div>

                                </div>
                                <div className={styles.modal_box_right_content_2}>
                                    <div className={styles.modal_box_right_content_2_customerInfo}>
                                        <div className={styles.modal_box_right_content_2_customerInfo_cat}>
                                            <p>차량번호</p>
                                            <p>차량특징</p>
                                            <p>고객 연락처</p>
                                        </div>
                                        <div className={styles.modal_box_right_content_2_customerInfo_value}>
                                            {/*<p>{modalData.carNumber}로그인후</p>*/}
                                            {/*<p>{modalData.carCharacter}로그인후</p>*/}
                                            {/*<p>{modalData.phoneNumber}로그인후</p>*/}
                                            <p>개발필요</p>
                                            <p>개발필요</p>
                                            <p>개발필요</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default ModalInOrderHistory;
