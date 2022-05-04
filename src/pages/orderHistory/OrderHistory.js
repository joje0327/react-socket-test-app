import {Button, Form, Header, Input, Label} from "../styles";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from 'axios';
import {Link, Navigate} from "react-router-dom";
import styles from './OrderHistory.module.css';
import logoImg from '../../images/logos.png'
import dayjs from "dayjs";
import closeBtn from "../../images/closeBtn.png";
import Text1 from "../../images/1.png";
import Text2 from "../../images/2.png";
import Text3 from "../../images/3.png";
import {useNavigate} from "react-router";


const OrderHistory = () => {


    const navigate = useNavigate();

    const [orderHistory, setOrderHistory] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [orderCnt, setOrderCnt] = useState(0);

    const [modal, setModal] = useState(false);

    const getOrderHistoryInfo = async function getOrderHistory() {
        try {
            console.log("오더 리스트로 요청시작");
            const response = await axios.get("http://localhost:8080/api/v1/store/finishedorder2");
            console.log(response)

            const sortedResponse = [...response.data.data].sort(
                (a, b) => {
                    a = new Date(a.arrivingTime);
                    b = new Date(b.arrivingTime);
                    return a > b ? -1 : a < b ? 1 : 0;
                }
            );
            setOrderHistory(sortedResponse);
            console.log("오더내역 리스트 내림차순 정리하여 저장");
            setOrderCnt(sortedResponse.length);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {

        setIsLoading(true);
        getOrderHistoryInfo();

        return undefined;

    }, []);

    useEffect(()=> {
        const updating = setInterval(getOrderHistoryInfo, 2000);
        console.log('setTimeOut실행')

        return ()=> clearInterval(updating);
    },[])







    return (
        (isLoading) ?(<h1>로딩중</h1>):(
                <>
                    <header className={styles.header}>
                        <img src={logoImg} className={styles.headerLogo}/>
                    </header>
                    <div id="container" className={styles.container}>
                        <div className={styles.sideBar}>
                            <div className={styles.sideBarMenus}>
                                <Link to="/orders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>전체 주문 내역</p></Link>
                                <Link to="/beforeAcceptOrders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>접수 대기</p></Link>
                                <Link to="/processingOrders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>진행중</p></Link>
                                <Link to="/orderHistory" className={styles.sideBarMenuSelected}><p className={styles.sideBarMenuText}>지난 주문내역</p></Link>
                                <Link to="/orders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>품절 관리</p></Link>
                                <Link to="/orders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>설정</p></Link>
                            </div>
                            <div className={styles.onOpen}>
                                <label className={styles.switch}>
                                    <input type={"checkbox"} />
                                    <span className={`${styles.slider} ${styles.round}`}></span>
                                    {/*className={`${styles.description} ${styles.yellow}`}*/}
                                </label>
                                <p className={styles.onOpenText}>영업중</p>
                            </div>
                        </div>


                        <div className={styles.contentWrapper}>
                            <div className={styles.content}>
                                <div className={styles.orderStatus}>
                                    <div className={styles.orderStatusText}>지난주문내역</div>
                                    <div className={styles.orderStatusText_detailBox}>
                                        <div className={styles.orderStatusText_detailBox_line1}>
                                            <p className={styles.orderStatusText_detailBox_line1_text}>완료주문</p>
                                            <p className={styles.orderStatusText_detailBox_line1_text}>4건 114,800원</p>
                                        </div>
                                        <div className={styles.orderStatusText_detailBox_line2}>
                                            <p className={styles.orderStatusText_detailBox_line2_text}>취소 주문</p>
                                            <p className={styles.orderStatusText_detailBox_line2_text}>2건 24,300원</p>
                                        </div>
                                    </div>
                                </div>


                                <div className={styles.orderList_box}>
                                    <div className={styles.orderBox_headerbox}>
                                        <div  className={styles.orderBox_header}>
                                            <p className={styles.orderBox_header_time}>시간</p>
                                            <p className={styles.orderBox_header_orderId}>주문번호</p>
                                            <p className={styles.orderBox_header_orderDetail}>주문내역</p>
                                            <p className={styles.orderBox_header_orderAmount}>합계</p>
                                            <p className={styles.orderBox_header_orderStatus}>주문 상태</p>
                                        </div>
                                    </div>
                                    <div className={styles.orderBox_contentbox} onClick={(e)=>{
                                        console.log('outter_modal clicked')
                                        setModal(prev => !prev);

                                    }}>
                                        <div  className={styles.orderBox_content}>
                                            <p className={styles.orderBox_content_time}>9:30</p>
                                            <p className={styles.orderBox_content_orderId}>#0001</p>
                                            <p className={styles.orderBox_content_orderDetail}>치즈 떡볶이 외 3건</p>
                                            <p className={styles.orderBox_content_orderAmount}>₩30,000</p>
                                            <p className={styles.orderBox_content_orderStatus}>완료</p>
                                        </div>
                                    </div>
                                    <div className={styles.orderBox_contentbox}  onClick={(e)=>{
                                        console.log('outter_modal clicked')
                                        setModal(prev => !prev);

                                    }}>
                                        <div  className={styles.orderBox_content}>
                                            <p className={styles.orderBox_content_time}>9:30</p>
                                            <p className={styles.orderBox_content_orderId}>#0001</p>
                                            <p className={styles.orderBox_content_orderDetail}>치즈 떡볶이 외 3건</p>
                                            <p className={styles.orderBox_content_orderAmount}>₩30,000</p>
                                            <p className={styles.orderBox_content_orderStatus}>완료</p>
                                        </div>
                                    </div>
                                    <div className={styles.orderBox_contentbox}  onClick={(e)=>{
                                        console.log('outter_modal clicked')
                                        setModal(prev => !prev);

                                    }}>
                                        <div  className={styles.orderBox_content}>
                                            <p className={styles.orderBox_content_time}>9:30</p>
                                            <p className={styles.orderBox_content_orderId}>#0001</p>
                                            <p className={styles.orderBox_content_orderDetail}>치즈 떡볶이 외 3건</p>
                                            <p className={styles.orderBox_content_orderAmount}>₩30,000</p>
                                            <p className={styles.orderBox_content_orderStatus}>완료</p>
                                        </div>
                                    </div>
                                    <div className={styles.orderBox_contentbox}  onClick={(e)=>{
                                        console.log('outter_modal clicked')
                                        setModal(prev => !prev);

                                    }}>
                                        <div  className={styles.orderBox_content}>
                                            <p className={styles.orderBox_content_time}>9:30</p>
                                            <p className={styles.orderBox_content_orderId}>#0001</p>
                                            <p className={styles.orderBox_content_orderDetail}>치즈 떡볶이 외 3건</p>
                                            <p className={styles.orderBox_content_orderAmount}>₩30,000</p>
                                            <p className={styles.orderBox_content_orderStatus}>완료</p>
                                        </div>
                                    </div>
                                    <div className={styles.orderBox_contentbox}  onClick={(e)=>{
                                        console.log('outter_modal clicked')
                                        setModal(prev => !prev);

                                    }}>
                                        <div  className={styles.orderBox_content}>
                                            <p className={styles.orderBox_content_time}>9:30</p>
                                            <p className={styles.orderBox_content_orderId}>#0001</p>
                                            <p className={styles.orderBox_content_orderDetail}>치즈 떡볶이 외 3건</p>
                                            <p className={styles.orderBox_content_orderAmount}>₩30,000</p>
                                            <p className={styles.orderBox_content_orderStatus}>완료</p>
                                        </div>
                                    </div>
                                    <div className={styles.orderBox_contentbox}  onClick={(e)=>{
                                        console.log('outter_modal clicked')
                                        setModal(prev => !prev);

                                    }}>
                                        <div  className={styles.orderBox_content}>
                                            <p className={styles.orderBox_content_time}>9:30</p>
                                            <p className={styles.orderBox_content_orderId}>#0001</p>
                                            <p className={styles.orderBox_content_orderDetail}>치즈 떡볶이 외 3건</p>
                                            <p className={styles.orderBox_content_orderAmount}>₩30,000</p>
                                            <p className={styles.orderBox_content_orderStatus}>완료</p>
                                        </div>
                                    </div>
                                    <div className={styles.orderBox_contentbox}  onClick={(e)=>{
                                        console.log('outter_modal clicked')
                                        setModal(prev => !prev);

                                    }}>
                                        <div  className={styles.orderBox_content}>
                                            <p className={styles.orderBox_content_time}>9:30</p>
                                            <p className={styles.orderBox_content_orderId}>#0001</p>
                                            <p className={styles.orderBox_content_orderDetail}>치즈 떡볶이 외 3건</p>
                                            <p className={styles.orderBox_content_orderAmount}>₩30,000</p>
                                            <p className={styles.orderBox_content_orderStatus}>완료</p>
                                        </div>
                                    </div>
                                    <div className={styles.orderBox_contentbox} onClick={(e)=>{
                                        console.log('outter_modal clicked')
                                        setModal(prev => !prev);

                                    }}>
                                        <div  className={styles.orderBox_content}>
                                            <p className={styles.orderBox_content_time}>9:30</p>
                                            <p className={styles.orderBox_content_orderId}>#0001</p>
                                            <p className={styles.orderBox_content_orderDetail}>치즈 떡볶이 외 3건</p>
                                            <p className={styles.orderBox_content_orderAmount}>₩30,000</p>
                                            <p className={styles.orderBox_content_orderStatus}>완료</p>
                                        </div>
                                    </div>
                                    <div className={styles.orderBox_contentbox} onClick={(e)=>{
                                        console.log('outter_modal clicked')
                                        setModal(prev => !prev);

                                    }}>
                                        <div  className={styles.orderBox_content}>
                                            <p className={styles.orderBox_content_time}>9:30</p>
                                            <p className={styles.orderBox_content_orderId}>#0001</p>
                                            <p className={styles.orderBox_content_orderDetail}>치즈 떡볶이 외 3건</p>
                                            <p className={styles.orderBox_content_orderAmount}>₩30,000</p>
                                            <p className={styles.orderBox_content_orderStatus}>완료</p>
                                        </div>
                                    </div>
                                    <div className={styles.orderBox_contentbox} onClick={(e)=>{
                                        console.log('outter_modal clicked')
                                        setModal(prev => !prev);

                                    }}>
                                        <div  className={styles.orderBox_content}>
                                            <p className={styles.orderBox_content_time}>9:30</p>
                                            <p className={styles.orderBox_content_orderId}>#0001</p>
                                            <p className={styles.orderBox_content_orderDetail}>치즈 떡볶이 외 3건</p>
                                            <p className={styles.orderBox_content_orderAmount}>₩30,000</p>
                                            <p className={styles.orderBox_content_orderStatus}>완료</p>
                                        </div>
                                    </div>


                                    {/*{orderHistory?.map((orderInfo, index) =>{*/}
                                    {/*    return (*/}
                                    {/*        <div className={styles.orderBox} key={index}>*/}
                                    {/*            <div>*/}
                                    {/*                <p className={styles.shopName}>{orderInfo.storeName}</p>*/}
                                    {/*                <p className={styles.shopStatus}>status : {orderInfo.orderStatus}</p>*/}
                                    {/*                <p className={styles.shopStatus}>orderId : {orderInfo.orderId}</p>*/}
                                    {/*            </div>*/}

                                    {/*            <div className={styles.menuDescription}>*/}
                                    {/*                <p className={styles.menuSummary}>{orderInfo.orderItemsSummary}</p>*/}
                                    {/*                <p className={styles.menuDetail}>{orderInfo.orderItemsDetails}</p>*/}
                                    {/*            </div>*/}
                                    {/*            <p className={styles.menuOrderTime}>{dayjs(orderInfo.arrivingTime).format("YYYY MM DD h:mm A")}</p>*/}
                                    {/*        </div>*/}

                                    {/*    )*/}
                                    {/*})}*/}
                                </div>
                            </div>
                        </div>
                    </div>


                    {modal && <div className={styles.outter_modal} onClick={(e)=>{
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
                                                        <p className={styles.modal_box_left_content_1_orderbox_ordernumtext}>#0001</p>
                                                    </div>
                                                    <div>
                                                        <p className={styles.modal_box_left_content_1_orderbox_ordertime}>5:10 PM</p>
                                                    </div>

                                                </div>
                                                <div className={styles.modal_box_left_content_1_line2}>
                                                    <div className={styles.modal_box_left_content_1_orderstatus}>
                                                        <p className={styles.modal_box_left_content_1_orderstatus_menu}>메뉴3개</p>
                                                        <p className={styles.modal_box_left_content_1_orderstatus_price}>200000원</p>
                                                        <p className={styles.modal_box_left_content_1_orderstatus_status}>결재완료</p>
                                                    </div>
                                                </div>


                                            </div>
                                            <div className={styles.modal_box_left_content_2}>
                                                <div className={styles.modal_box_left_content_2_menuList}>
                                                    <p className={styles.modal_box_left_content_2_menuList_title}>김치찌개</p>
                                                    <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>
                                                    <p className={styles.modal_box_left_content_2_menuList_price}>7,000원</p>
                                                </div>
                                                <div className={styles.modal_box_left_content_2_menuList}>
                                                    <p className={styles.modal_box_left_content_2_menuList_title}>김치찌개</p>
                                                    <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>
                                                    <p className={styles.modal_box_left_content_2_menuList_price}>7,000원</p>
                                                </div>
                                                <div className={styles.modal_box_left_content_2_menuList}>
                                                    <p className={styles.modal_box_left_content_2_menuList_title}>김치찌개</p>
                                                    <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>
                                                    <p className={styles.modal_box_left_content_2_menuList_price}>7,000원</p>
                                                </div>
                                                <div className={styles.modal_box_left_content_2_menuList}>
                                                    <p className={styles.modal_box_left_content_2_menuList_title}>김치찌개</p>
                                                    <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>
                                                    <p className={styles.modal_box_left_content_2_menuList_price}>7,000원</p>
                                                </div>
                                                <div className={styles.modal_box_left_content_2_menuList}>
                                                    <p className={styles.modal_box_left_content_2_menuList_title}>김치찌개</p>
                                                    <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>
                                                    <p className={styles.modal_box_left_content_2_menuList_price}>7,000원</p>
                                                </div>
                                                <div className={styles.modal_box_left_content_2_menuList}>
                                                    <p className={styles.modal_box_left_content_2_menuList_title}>김치찌개</p>
                                                    <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>
                                                    <p className={styles.modal_box_left_content_2_menuList_price}>7,000원</p>
                                                </div>

                                            </div>









                                            <div className={styles.modal_box_left_content_3}>
                                                <div className={styles.modal_box_left_content_3_ordersummary}>
                                                    <p className={styles.modal_box_left_content_3_ordersummary_total}>총합계</p>
                                                    <p className={styles.modal_box_left_content_3_ordersummary_totalcnt}>2</p>
                                                    <p className={styles.modal_box_left_content_3_ordersummary_totalprice}>20,000원</p>
                                                </div>



                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.modal_box_right_content_wrapper}>
                                        <div className={styles.modal_box_right_content}>
                                            <div className={styles.modal_box_right_content_1}>
                                                <div className={styles.modal_box_right_content_1_left}>
                                                    <p>고객 도착예상시간</p>
                                                </div>
                                                <div className={styles.modal_box_right_content_1_right}>
                                                    <p>5:41 PM(30분 후)</p>
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
                                                        <p>12가3456</p>
                                                        <p>흰색 그랜저</p>
                                                        <p>0505-000-0000</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>


                    }



                </>
            )
    );

};

export default OrderHistory;


