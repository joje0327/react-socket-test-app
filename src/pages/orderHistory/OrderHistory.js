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
import ModalInProcessingOrders from "../modalInProcessingOrders/ModalInProcessingOrders";
import ModalInOrderHistory from "../modalInOrderHistory/ModalInOrderHistory";
import {Skeleton} from "@mui/material";


const OrderHistory = () => {

    const [storeName, setStoreName] = useState();


    const getStoreInformation = async function getStore(storeId) {
        try {
            console.log("오더 리스트로 요청시작");
            // const response = await axios.get(`http://localhost:8080/api/v1/store?storeId=${storeId}`);
            const response = await axios.get(`http://ec2-3-35-164-61.ap-northeast-2.compute.amazonaws.com/api/v1/store?storeId=${storeId}`);
            console.log("getStoreInformation:", response);
            console.log("setStoreName", response.data.data.storeName)
            setStoreName(response.data.data.storeName);

        } catch (error) {
            console.log(error);
        }}


    const navigate = useNavigate();

    const [orderHistory, setOrderHistory] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [orderCnt, setOrderCnt] = useState(0);

    const [modal, setModal] = useState(false);
    const [modalData, setModalData] = useState({});

    const [pickedUpCnt, setPickedUpCnt] = useState();
    const [pickedUpAmount, setPickedUpAmount] = useState();
    const [canceledCnt, setCanceledCnt] = useState();
    const [canceledAmount, setCanceledAmount] = useState();

    const [storeAvailable, setStoreAvailable] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [storeStatus, setStoreStatus] = useState(orderHistory.storeAvailable ? '영업중' : 'CLOSED');


    const [storeId, setStoreId] = useState(localStorage.getItem("store_id"));







    const getOrderHistoryInfo = async function getOrderHistory(storeId) {
        try {
            console.log("오더 리스트로 요청시작");
            const response = await axios.get(`http://3.35.164.61:80/api/v1/store/finishedorder?storeId=${storeId}`);
            // const response = await axios.get(`http://localhost:8080/api/v1/store/finishedorder?storeId=${storeId}`);
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
            // const reducerPickupCnt = (accumulator, curr) =>
            //
            // };

            const reducerPickupAmount = (accumulator, curr) => {

                if (curr.orderStatus == 'PICKUP') {
                    curr.orderDetailList.map(o => {
                        accumulator += o.amount;
                    });
                }
            };
            const reducerCanceledCnt = (accumulator, curr) => {
                if (curr.orderStatus == 'PICKUP') {
                    accumulator += 1;
                }
            };

            const reducerCanceledAmount = (accumulator, curr) => {

                if (curr.orderStatus == 'PICKUP') {
                    curr.orderDetailList.map(o => {
                        accumulator += o.amount;
                    });
                }
            };


            setPickedUpCnt(response.data.data.filter(item => item.orderStatus == 'PICKUP').reduce((acc, cur, i)=> {
                    return acc + 1;
                }, 0));


            console.log('response.data.data.filter(item => item.orderStatus == \'PICKUP\')',response.data.data.filter(item => item.orderStatus == 'PICKUP'));
            console.log('response.data.data.filter(item => item.orderStatus == \'PICKUP\')',response.data.data.filter(item => item.orderStatus !== 'PICKUP'));
            console.log('response.data.data.filter(item => item.orderStatus == \'PICKUP\')',response.data.data);

            console.log('response.data.data.filter(item => item.orderStatus == \'PICKUP\')aaaaaa',
                response.data.data.filter(item => item.orderStatus == 'PICKUP').reduce((acc, cur) => {
                    cur.orderDetailList.map(orderDetail => {

                        acc.push(orderDetail);
                    });
                    return acc;
                }, []).reduce((acc, cur) => {
                    return acc + cur.amount
                }, 0)

            );




            setPickedUpAmount(response.data.data.filter(item => item.orderStatus == 'PICKUP').reduce((acc, cur) => {
                cur.orderDetailList.map(orderDetail => {

                    acc.push(orderDetail);
                });
                return acc;
            }, []).reduce((acc, cur) => {
                return acc + cur.amount
            }, 0));

            setCanceledCnt(response.data.data.filter(item => item.orderStatus !== 'PICKUP').reduce((acc, cur, i)=> {
                return acc + 1;
            }, 0));
            setCanceledAmount(response.data.data.filter(item => item.orderStatus !== 'PICKUP').reduce((acc, cur) => {
                cur.orderDetailList.map(orderDetail => {

                    acc.push(orderDetail);
                });
                return acc;
            }, []).reduce((acc, cur) => {
                return acc + cur.amount
            }, 0));



            setOrderCnt(response.data.data.length);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {

        setIsLoading(true);
        getOrderHistoryInfo(storeId);

        getStoreInformation(localStorage.getItem("store_id"));

        return undefined;

    }, []);

    useEffect(()=> {
        // const updating = setInterval(getOrderHistoryInfo, 2000);

        const updating = setInterval(function (){getOrderHistoryInfo(storeId)}, 2000);
        console.log('setTimeOut실행')
        const checkLogged = localStorage.getItem("store_id")
        if (checkLogged == null || checkLogged == "") {
            alert("로그인이 필요합니다")
            window.location.href = "/login"; // redirect
            return undefined;
        }


        return ()=> clearInterval(updating);
    },[])


    return (
        (isLoading) ? (<Skeleton
            sx={{ bgcolor: '#A0A7AC' }}
            variant="rectangular"
            width={'100%'}
            height={'100%'}
        />) : (
            <>
                <header className={styles.header}>
                    <img src={logoImg} className={styles.headerLogo}/>

                    <div src={logoImg} className={styles.headerLogoutBox}>
                        <p><span className={styles.headerLogoutBox_text}>{storeName}</span> 님 반갑습니다.</p>
                        <div className={styles.headerLogoutBox_LogoutBtn} onClick={() => {
                            console.log("btn clicked")
                            localStorage.removeItem("store_id");
                            window.location.href = "/login";
                        }}><p>로그아웃</p></div>
                    </div>
                </header>
                <div id="container" className={styles.container}>
                    <div className={styles.sideBar}>
                        <div className={styles.sideBarMenus}>
                            <Link to="/orders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>전체 주문 내역 &nbsp;(TEST용)</p></Link>
                            <Link to="/beforeAcceptOrders" className={styles.sideBarMenu}><p
                                className={styles.sideBarMenuText}>접수 대기</p></Link>
                            <Link to="/processingOrders" className={styles.sideBarMenu}><p
                                className={styles.sideBarMenuText}>진행중</p></Link>
                            <Link to="/orderHistory" className={styles.sideBarMenuSelected}><p
                                className={styles.sideBarMenuText}>지난 주문내역</p></Link>
                            <Link to="/stockManage" className={styles.sideBarMenu}><p
                                className={styles.sideBarMenuText}>품절 관리</p></Link>
                            <Link to="/settings" className={styles.sideBarMenu}><p
                                className={styles.sideBarMenuText}>설정</p></Link>
                        </div>
                        <div className={styles.onOpen}>
                            <label className={styles.switch}>
                                <input type={"checkbox"} checked={storeAvailable} onClick={()=>setStoreAvailable(prev=>!prev)} />
                                <span className={`${styles.slider} ${styles.round}`}></span>
                                {/*className={`${styles.description} ${styles.yellow}`}*/}
                            </label>
                            <p className={styles.onOpenText}>{storeAvailable ? '영업중' : 'Closed'}</p>
                        </div>
                    </div>


                    <div className={styles.contentWrapper}>
                        <div className={styles.content}>
                            <div className={styles.orderStatus}>
                                <div className={styles.orderStatusText}>지난주문내역</div>
                                <div className={styles.orderStatusText_detailBox}>
                                    <div className={styles.orderStatusText_detailBox_line1}>
                                        <p className={styles.orderStatusText_detailBox_line1_text}>완료주문</p>
                                        <p className={styles.orderStatusText_detailBox_line1_text}>{pickedUpCnt}건 {pickedUpAmount.toLocaleString()}원</p>
                                    </div>
                                    <div className={styles.orderStatusText_detailBox_line2}>
                                        <p className={styles.orderStatusText_detailBox_line2_text}>취소 주문</p>
                                        <p className={styles.orderStatusText_detailBox_line2_text}>{canceledCnt}건 {canceledAmount.toLocaleString()}원</p>
                                    </div>
                                </div>
                            </div>


                            <div className={styles.orderList_box}>
                                <div className={styles.orderBox_headerbox}>
                                    <div className={styles.orderBox_header}>
                                        <p className={styles.orderBox_header_time}>시간</p>
                                        <p className={styles.orderBox_header_orderId}>주문번호</p>
                                        <p className={styles.orderBox_header_orderDetail}>주문내역</p>
                                        <p className={styles.orderBox_header_orderAmount}>합계</p>
                                        <p className={styles.orderBox_header_orderStatus}>주문 상태</p>
                                    </div>
                                </div>

                                {orderHistory?.map((orderInfo, index) =>{
                                    return (
                                        <div className={styles.orderBox_contentbox} onClick={(e) => {
                                            console.log('button clicked');
                                            console.log('data in button', orderInfo);
                                            setModalData(orderInfo);
                                            setModal(prev => !prev);
                                    }}>
                                        <div className={styles.orderBox_content}>
                                            <div>
                                                <p className={styles.orderBox_content_time}>{dayjs(orderInfo.arrivingTime).format("YYYY/MM/DD")}</p>
                                                <p className={styles.orderBox_content_time}>{dayjs(orderInfo.arrivingTime).format("hh:mm A")}</p>
                                            </div>
                                            <p className={styles.orderBox_content_orderId}>#{orderInfo.orderId}</p>
                                            <p className={styles.orderBox_content_orderDetail}>{orderInfo.orderItemsSummary}</p>
                                            <p className={styles.orderBox_content_orderAmount}>₩{orderInfo.finalAmount.toLocaleString()}</p>
                                            <p className={styles.orderBox_content_orderStatus}>{orderInfo.orderStatus}</p>
                                        </div>
                                    </div>
                                    )
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                {modal && (<ModalInOrderHistory modal={modal} setModal={setModal}  modalData={modalData}
                                                    setModalData={setModalData} navigate={navigate}/>)}



                {/*{modal && <div className={styles.outter_modal} onClick={(e) => {*/}
                {/*    console.log('outter_modal clicked')*/}
                {/*    setModal(prev => !prev);*/}

                {/*}}>*/}

                {/*    <div className={styles.inner_modal} onClick={(e) => {*/}
                {/*        console.log('inner_modal clicked')*/}
                {/*    }}>*/}
                {/*        <div className={styles.modal_box} onClick={(e) => {*/}
                {/*            //위로 이벤트 전파 막기 위해 e.stopPropagation()사용 !!*/}
                {/*            e.stopPropagation();*/}
                {/*            console.log('modal_box clicked')*/}
                {/*        }}>*/}
                {/*            <div className={styles.modal_box_header}>*/}
                {/*                <div className={styles.modal_box_header_left}>*/}
                {/*                    <a className={styles.modal_box_header_left_text}>주문상세</a>*/}
                {/*                </div>*/}
                {/*                <a className={styles.modal_box_header_right} onClick={() => setModal(prev => !prev)}>*/}
                {/*                    <img className={styles.modal_box_header_right_img} src={closeBtn}/>*/}
                {/*                </a>*/}
                {/*            </div>*/}
                {/*            <div className={styles.modal_box_content}>*/}
                {/*                <div className={styles.modal_box_left_content_wrapper}>*/}
                {/*                    <div className={styles.modal_box_left_content}>*/}
                {/*                        <div className={styles.modal_box_left_content_1}>*/}
                {/*                            <div className={styles.modal_box_left_content_1_line1}>*/}
                {/*                                <div className={styles.modal_box_left_content_1_orderbox}>*/}
                {/*                                    <p className={styles.modal_box_left_content_1_orderbox_ordernum}>주문번호</p>*/}
                {/*                                    <p className={styles.modal_box_left_content_1_orderbox_ordernumtext}>#0001</p>*/}
                {/*                                </div>*/}
                {/*                                <div>*/}
                {/*                                    <p className={styles.modal_box_left_content_1_orderbox_ordertime}>5:10*/}
                {/*                                        PM</p>*/}
                {/*                                </div>*/}

                {/*                            </div>*/}
                {/*                            <div className={styles.modal_box_left_content_1_line2}>*/}
                {/*                                <div className={styles.modal_box_left_content_1_orderstatus}>*/}
                {/*                                    <p className={styles.modal_box_left_content_1_orderstatus_menu}>메뉴3개</p>*/}
                {/*                                    <p className={styles.modal_box_left_content_1_orderstatus_price}>200000원</p>*/}
                {/*                                    <p className={styles.modal_box_left_content_1_orderstatus_status}>결재완료</p>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}


                {/*                        </div>*/}
                {/*                        <div className={styles.modal_box_left_content_2}>*/}
                {/*                            <div className={styles.modal_box_left_content_2_menuList}>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_title}>김치찌개</p>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_price}>7,000원</p>*/}
                {/*                            </div>*/}
                {/*                            <div className={styles.modal_box_left_content_2_menuList}>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_title}>김치찌개</p>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_price}>7,000원</p>*/}
                {/*                            </div>*/}
                {/*                            <div className={styles.modal_box_left_content_2_menuList}>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_title}>김치찌개</p>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_price}>7,000원</p>*/}
                {/*                            </div>*/}
                {/*                            <div className={styles.modal_box_left_content_2_menuList}>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_title}>김치찌개</p>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_price}>7,000원</p>*/}
                {/*                            </div>*/}
                {/*                            <div className={styles.modal_box_left_content_2_menuList}>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_title}>김치찌개</p>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_price}>7,000원</p>*/}
                {/*                            </div>*/}
                {/*                            <div className={styles.modal_box_left_content_2_menuList}>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_title}>김치찌개</p>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>*/}
                {/*                                <p className={styles.modal_box_left_content_2_menuList_price}>7,000원</p>*/}
                {/*                            </div>*/}

                {/*                        </div>*/}


                {/*                        <div className={styles.modal_box_left_content_3}>*/}
                {/*                            <div className={styles.modal_box_left_content_3_ordersummary}>*/}
                {/*                                <p className={styles.modal_box_left_content_3_ordersummary_total}>총합계</p>*/}
                {/*                                <p className={styles.modal_box_left_content_3_ordersummary_totalcnt}>2</p>*/}
                {/*                                <p className={styles.modal_box_left_content_3_ordersummary_totalprice}>20,000원</p>*/}
                {/*                            </div>*/}


                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}

                {/*                <div className={styles.modal_box_right_content_wrapper}>*/}
                {/*                    <div className={styles.modal_box_right_content}>*/}
                {/*                        <div className={styles.modal_box_right_content_1}>*/}
                {/*                            <div className={styles.modal_box_right_content_1_left}>*/}
                {/*                                <p>고객 도착예상시간</p>*/}
                {/*                            </div>*/}
                {/*                            <div className={styles.modal_box_right_content_1_right}>*/}
                {/*                                <p>5:41 PM(30분 후)</p>*/}
                {/*                                <p>32Km 남음 </p>*/}
                {/*                            </div>*/}


                {/*                        </div>*/}
                {/*                        <div className={styles.modal_box_right_content_2}>*/}
                {/*                            <div className={styles.modal_box_right_content_2_customerInfo}>*/}
                {/*                                <div className={styles.modal_box_right_content_2_customerInfo_cat}>*/}
                {/*                                    <p>차량번호</p>*/}
                {/*                                    <p>차량특징</p>*/}
                {/*                                    <p>고객 연락처</p>*/}
                {/*                                </div>*/}
                {/*                                <div className={styles.modal_box_right_content_2_customerInfo_value}>*/}
                {/*                                    <p>12가3456</p>*/}
                {/*                                    <p>흰색 그랜저</p>*/}
                {/*                                    <p>0505-000-0000</p>*/}
                {/*                                </div>*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*</div>*/}


                {/*}*/}


            </>
        )
    );

};

export default OrderHistory;


