import {Button, Form, Header, Input, Label} from "../styles";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from 'axios';
import {Link, Navigate, useHistory} from "react-router-dom";
import styles from './BeforeAcceptOrders.module.css';
import logoImg from '../../images/logos.png'
import closeBtn from '../../images/closeBtn.png'
import dayjs from "dayjs";
import {useNavigate} from "react-router";


const BeforeAcceptOrders = () => {
    const navigate = useNavigate();
    // const history = useHistory();

    const [modal, setModal] = useState(false);
    const [innerAcceptModal, setInnerAcceptModal] = useState(false);
    const [innerDeniedModal, setInnerDeniedModal] = useState(false);

    const [orderHistory, setOrderHistory] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [orderCnt, setOrderCnt] = useState(0);

    const getOrderHistoryInfo = async function getOrderHistory() {
        try {
            console.log("오더 리스트로 요청시작");
            const response = await axios.get("http://localhost:8080/api/v1/store/paidorder2");
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
                                <Link to="/beforeAcceptOrders" className={styles.sideBarMenuSelected}><p className={styles.sideBarMenuText}>접수 대기</p></Link>
                                <Link to="/processingOrders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>진행중</p></Link>
                                <Link to="/orderHistory" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>지난 주문내역</p></Link>
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
                                    <p className={styles.orderStatusText}>접수 대기 {orderCnt}</p>
                                </div>

                                {orderHistory?.map((orderInfo, index) =>{
                                    return (
                                        <div className={styles.orderBox} key={index} onClick={()=>{
                                            console.log('button clicked');
                                            setModal(prev => !prev);
                                            console.log('modal', modal)
                                        }}>
                                            <div>
                                                <p className={styles.shopName}>{orderInfo.storeName}</p>
                                                <p className={styles.shopStatus}>status : {orderInfo.orderStatus}</p>
                                                <p className={styles.shopStatus}>orderId : {orderInfo.orderId}</p>
                                            </div>

                                            <div className={styles.menuDescription}>
                                                <p className={styles.menuSummary}>{orderInfo.orderItemsSummary}</p>
                                                <p className={styles.menuDetail}>{orderInfo.orderItemsDetails}</p>
                                            </div>
                                            <p className={styles.menuOrderTime}>{dayjs(orderInfo.arrivingTime).format("YYYY MM DD h:mm A")}</p>
                                        </div>

                                    )
                                })}
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

                                            <div className={styles.modal_box_right_content_3}>
                                                <div className={styles.modal_box_right_content_3_btn}>
                                                    <div  className={styles.modal_box_right_content_3_btn_deny}
                                                          onClick={(e)=>{
                                                              setInnerDeniedModal(prev=>!prev);
                                                              console.log('setInnerModal clicked')
                                                              e.stopPropagation();
                                                          }}>
                                                        <p>거절</p>
                                                    </div>
                                                    <div  className={styles.modal_box_right_content_3_btn_accept} onClick={(e)=>{
                                                        setInnerAcceptModal(prev=>!prev);
                                                        console.log('setInnerModal clicked')
                                                        e.stopPropagation();
                                                    }}><p>수락</p></div>
                                                </div>
                                                {/*<div className={styles.modal_box_right_content_3_cofirmBtnBox}>*/}
                                                {/*    <div  className={styles.modal_box_right_content_3_cofirmBtn}><p>수락</p></div>*/}

                                                {/*</div>*/}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {innerAcceptModal && <div className={styles.outter_Innermodal}  onClick={(e)=>{
                            e.stopPropagation();
                            console.log('Inneroutter_modal clicked')
                            setInnerAcceptModal(prev => !prev);}}>

                            <div className={styles.innerModal}>
                                <div className={styles.innerModal_box}>
                                    <div className={styles.innerModal_box_confirmText}><p>차타고 접수를 수락 하시겠습니까?</p></div>
                                    <div  className={styles.innerModal_box_confirmBtn_accept}
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              console.log('수락버튼 클릭')
                                              console.log('수락 서버전송')
                                              console.log('진행중 화면이동')
                                              navigate('/processingOrders')
                                          }
                                          }
                                    ><p>수락</p></div>
                                </div>
                            </div>
                        </div>
                        }

                        {innerDeniedModal && <div className={styles.outter_Innermodal}  onClick={(e)=>{
                            e.stopPropagation();
                            console.log('Inneroutter_modal clicked')
                            setInnerDeniedModal(prev => !prev);}}>

                            <div className={styles.innerModal}>
                                <div className={styles.innerModal_box}>
                                    <div className={styles.innerModal_box_confirmText}><p>차타고 접수를 거절 하시겠습니까?</p></div>
                                    <div  className={styles.innerModal_box_confirmBtn_denied}
                                          onClick={(e) => {
                                              e.stopPropagation();
                                              console.log('거절버튼 클릭')
                                              console.log('거절 서버전송')
                                              console.log('접수중 화면 이동')

                                              window.location.reload();
                                              // location.reload();
                                          }
                                          }

                                    ><p>거절</p></div>
                                </div>
                            </div>
                        </div>
                        }

                    </div>


                    }
                </>
            )
    );

};

export default BeforeAcceptOrders;


