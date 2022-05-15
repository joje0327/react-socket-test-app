import {Button, Form, Header, Input, Label} from "../styles";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from 'axios';
import {Link, Navigate, useHistory} from "react-router-dom";
import styles from './BeforeAcceptOrders.module.css';
import logoImg from '../../images/logos.png'
import closeBtn from '../../images/closeBtn.png'
import dayjs from "dayjs";
import {useNavigate} from "react-router";
import ModalInBeforeAcceptOrders from "../modalInbeforAcceptOrders/ModalInBeforeAcceptOrders";
import {Skeleton} from "@mui/material";
import textSound from "../../sound/mixkit-retro-game-notification-212.wav";
import {Client} from '@stomp/stompjs'



const useAudio = () => {
    const [audio] = useState(new Audio(textSound));
    const [playing, setPlaying] = useState(false);



    const toggle = () => {
        console.log('sound clicked')
        console.log('audio',audio);
        setPlaying(!playing)
        console.log('playing', playing);
    };


    useEffect(() => {
            playing ? audio.play() : audio.pause();
            return () => undefined;
        },
        [playing]
    );

    useEffect(() => {
        console.log('ended sound');
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            console.log('ended sound cleanup');
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return [playing, toggle];
};




const BeforeAcceptOrders = () => {


    // const SOCKET_URL = 'ws://localhost:8080/ws-message';
    const SOCKET_URL = 'ws://ec2-3-35-164-61.ap-northeast-2.compute.amazonaws.com/ws-message';

    const [client, setClient] = useState(new Client({
        brokerURL: SOCKET_URL,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        // onConnect:onConnected,
        // onDisconnect: onDisconnected
    }))


    useEffect(()=> {
        console.log('connected!!');
        client.onConnect = () => {
            console.log("Connected!!");
            client.subscribe(`/topic/message/${storeId}`, function (msg) {
                console.log("message:", msg.body);
                let jsonBody = JSON.parse(msg.body);
                console.log("jsonBody:", jsonBody);

                // msg.body.message.map(i=>console.log(i))

                // if (msg.body) {
                //     var jsonBody = JSON.parse(msg.body);
                //     if (jsonBody.message) {
                //         console.log("ddddddd",jsonBody.message);
                //         if (jsonBody.message.userId) {
                //             // alert("위치 확인");
                //         }
                //     }
                // }
            });
        };
        client.onDisconnect(() => {
            console.log("Disccenter");
        });

        client.activate();
        return ()=>{client.deactivate()};
    },[])




    const [playing, toggle] = useAudio();
    const audioRef = useRef();

    const [storeName, setStoreName] = useState();


    const getStoreInformation = async function getStore(storeId) {
        try {
            console.log("오더 리스트로 요청시작");
            const response = await axios.get(`http://ec2-3-35-164-61.ap-northeast-2.compute.amazonaws.com/api/v1/store?storeId=${storeId}`);
            // const response = await axios.get(`http://localhost:8080/api/v1/store?storeId=${storeId}`);
            console.log("getStoreInformation:", response);
            console.log("setStoreName", response.data.data.storeName)
            setStoreName(response.data.data.storeName);

        } catch (error) {
            console.log(error);
        }}


    const navigate = useNavigate();



    const [modal, setModal] = useState(false);
    const [innerAcceptModal, setInnerAcceptModal] = useState(false);
    const [innerDeniedModal, setInnerDeniedModal] = useState(false);
    const [modalData, setModalData] = useState({});

    const [orderHistory, setOrderHistory] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [orderCnt, setOrderCnt] = useState(undefined);

    const [storeAvailable, setStoreAvailable] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [storeStatus, setStoreStatus] = useState(orderHistory.storeAvailable ? '영업중' : 'CLOSED');

    const [storeId, setStoreId] = useState(localStorage.getItem("store_id"));



    const getOrderHistoryInfo = async function getOrderHistory(storeId) {
        try {

            console.log("오더 리스트로 요청시작");
            const response = await axios.get(`http://3.35.164.61:80/api/v1/store/paidorder?storeId=${storeId}`);
            // const response = await axios.get(`http://localhost:8080/api/v1/store/paidorder?storeId=${storeId}`);
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

            // 주문이 있으면 재생
            if (response.data.data != 0) {
                audioRef.current?.play();
            }

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const id =  localStorage.getItem("store_id");
        if (id == null) {
            alert("로그인 진행후 다시 진행해 주세요");
            window.location.href = "/login";
            return ()=>undefined;

        }

        //맨처음 시작 데이터 로딩
        setIsLoading(true);
        getOrderHistoryInfo(storeId);


        //가게 정보가 필요
        getStoreInformation(localStorage.getItem("store_id"));

        return ()=>(undefined);

    }, []);

    useEffect(()=> {
        //2초 마다 상점 정보 넣어 히스토리 없데이트
        const updating = setInterval(function (){getOrderHistoryInfo(storeId)}, 2000);

        console.log('setTimeOut실행');

        return ()=> clearInterval(updating);
    },[])







    return (
        (isLoading) ?(<Skeleton
            sx={{ bgcolor: '#A0A7AC' }}
            variant="rectangular"
            width={'100%'}
            height={'100%'}
        />):(
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
                                <Link to="/beforeAcceptOrders" className={styles.sideBarMenuSelected}><p className={styles.sideBarMenuText}>접수 대기</p></Link>
                                <Link to="/processingOrders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>진행중</p></Link>
                                <Link to="/orderHistory" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>지난 주문내역</p></Link>
                                <Link to="/stockManage" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>품절 관리</p></Link>
                                <Link to="/settings" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>설정</p></Link>
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
                                    <p className={styles.orderStatusText}>접수 대기 {orderCnt}</p>
                                </div>

                                {orderHistory?.map((orderInfo, index) =>{
                                    return (
                                        <div className={styles.orderBox} key={index} onClick={()=>{
                                            console.log('button clicked');

                                            console.log('data in button', orderInfo);
                                            setModalData(orderInfo);
                                            setModal(prev => !prev);
                                            console.log('modal', modal)
                                        }}>
                                            <div>
                                                {/*<p className={styles.shopStatus}>status : {orderInfo.orderStatus}</p>*/}
                                                {/*<p className={styles.shopStatus}>orderId : {orderInfo.orderId}</p>*/}
                                                <p className={styles.shopStatus}>02가3456</p>
                                                <p className={styles.shopStatus}>(개발필요)</p>
                                            </div>

                                            <div className={styles.menuDescription}>
                                                <p className={styles.menuSummary}>{orderInfo.orderItemsSummary}</p>
                                                <p className={styles.menuDetail}>{orderInfo.orderItemsDetails}</p>
                                            </div>
                                            <p className={styles.menuOrderTime}>{dayjs(orderInfo.arrivingTime).format("h:mm A")}</p>
                                        </div>

                                    )
                                })}
                            </div>
                        </div>

                        <audio preload="auto"
                               src="/static/media/mixkit-retro-game-notification-212.b222ebf03a29c11b61f0.wav"
                               ref={audioRef}></audio>
                    </div>

                    {modal && (<ModalInBeforeAcceptOrders modal={modal} setModal={setModal} setInnerAcceptModal={setInnerAcceptModal}
                                                          setInnerDeniedModal ={setInnerDeniedModal} modalData={modalData}
                                                          setModalData={setModalData} navigate={navigate}
                                                          innerAcceptModal = {innerAcceptModal} innerDeniedModal={innerDeniedModal} />)}


                    {/*{modal && <div className={styles.outter_modal} onClick={(e)=>{*/}
                    {/*    console.log('outter_modal clicked');*/}
                    {/*    // orderInfoGlobal = {};*/}
                    {/*    setModal(prev => !prev);*/}

                    {/*    }}>*/}

                    {/*        <div className={styles.inner_modal} onClick={(e)=>{*/}
                    {/*            console.log('inner_modal clicked')}}>*/}
                    {/*            <div className={styles.modal_box} onClick={(e)=>{*/}
                    {/*                //위로 이벤트 전파 막기 위해 e.stopPropagation()사용 !!*/}
                    {/*                e.stopPropagation();*/}
                    {/*                console.log('modal_box clicked')}}>*/}
                    {/*                <div className={styles.modal_box_header}>*/}
                    {/*                    <div className={styles.modal_box_header_left}>*/}
                    {/*                        <a className={styles.modal_box_header_left_text}>주문상세</a>*/}
                    {/*                    </div>*/}
                    {/*                    <a className={styles.modal_box_header_right} onClick={()=>{*/}
                    {/*                        setModal(prev => !prev);*/}
                    {/*                        setModalData({});*/}
                    {/*                    }}>*/}
                    {/*                        <img className={styles.modal_box_header_right_img} src={closeBtn}/>*/}
                    {/*                    </a>*/}
                    {/*                </div>*/}
                    {/*                <div className={styles.modal_box_content}>*/}
                    {/*                    <div className={styles.modal_box_left_content_wrapper}>*/}
                    {/*                        <div className={styles.modal_box_left_content}>*/}
                    {/*                            <div className={styles.modal_box_left_content_1}>*/}
                    {/*                                <div className={styles.modal_box_left_content_1_line1}>*/}
                    {/*                                    <div className={styles.modal_box_left_content_1_orderbox}>*/}
                    {/*                                        <p className={styles.modal_box_left_content_1_orderbox_ordernum}>주문번호</p>*/}
                    {/*                                        {console.log('orderInfoGlobal in modal', orderInfoGlobal)}*/}
                    {/*                                        {console.log('modal in modal', modal)}*/}
                    {/*                                        <p className={styles.modal_box_left_content_1_orderbox_ordernumtext}>#{modalData.orderId}</p>*/}
                    {/*                                    </div>*/}
                    {/*                                    <div>*/}
                    {/*                                        <p className={styles.modal_box_left_content_1_orderbox_ordertime}>{modalData.orderTime}</p>*/}
                    {/*                                    </div>*/}

                    {/*                                </div>*/}
                    {/*                                <div className={styles.modal_box_left_content_1_line2}>*/}
                    {/*                                    <div className={styles.modal_box_left_content_1_orderstatus}>*/}
                    {/*                                        <p className={styles.modal_box_left_content_1_orderstatus_menu}>{modalData.orderItemsDetails}</p>*/}
                    {/*                                        <p className={styles.modal_box_left_content_1_orderstatus_price}>{modalData.totalAmount}</p>*/}
                    {/*                                        <p className={styles.modal_box_left_content_1_orderstatus_status}>{modalData.orderStatus}</p>*/}
                    {/*                                    </div>*/}
                    {/*                                </div>*/}


                    {/*                            </div>*/}
                    {/*                            <div className={styles.modal_box_left_content_2}>*/}
                    {/*                            {modalData.orderDetailList?.map((orderDetailInfo, index)=>{*/}
                    {/*                                <div className={styles.modal_box_left_content_2_menuList}>*/}
                    {/*                                    <p className={styles.modal_box_left_content_2_menuList_title}>{orderDetailInfo.itemName}</p>*/}
                    {/*                                    <p className={styles.modal_box_left_content_2_menuList_cnt}>{orderDetailInfo.quantity}</p>*/}
                    {/*                                    <p className={styles.modal_box_left_content_2_menuList_price}>{orderDetailInfo.amount}</p>*/}
                    {/*                                </div>*/}

                    {/*                            })}*/}
                    {/*                            </div>*/}
                    {/*                            <div className={styles.modal_box_left_content_3}>*/}
                    {/*                                <div className={styles.modal_box_left_content_3_ordersummary}>*/}
                    {/*                                    <p className={styles.modal_box_left_content_3_ordersummary_total}>총합계</p>*/}
                    {/*                                    <p className={styles.modal_box_left_content_3_ordersummary_totalcnt}>{modalData.orderDetailList}</p>*/}
                    {/*                                    <p className={styles.modal_box_left_content_3_ordersummary_totalprice}>{modalData.finalAmount}원</p>*/}
                    {/*                                </div>*/}



                    {/*                            </div>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}

                    {/*                    <div className={styles.modal_box_right_content_wrapper}>*/}
                    {/*                        <div className={styles.modal_box_right_content}>*/}
                    {/*                            <div className={styles.modal_box_right_content_1}>*/}
                    {/*                                <div className={styles.modal_box_right_content_1_left}>*/}
                    {/*                                    <p>고객 도착예상시간</p>*/}
                    {/*                                </div>*/}
                    {/*                                <div className={styles.modal_box_right_content_1_right}>*/}
                    {/*                                    <p>{modalData.arrivingTime} PM(30분 후)</p>*/}
                    {/*                                    <p>32Km 남음 </p>*/}
                    {/*                                </div>*/}




                    {/*                            </div>*/}
                    {/*                            <div className={styles.modal_box_right_content_2}>*/}
                    {/*                                <div className={styles.modal_box_right_content_2_customerInfo}>*/}
                    {/*                                    <div className={styles.modal_box_right_content_2_customerInfo_cat}>*/}
                    {/*                                        <p>차량번호</p>*/}
                    {/*                                        <p>차량특징</p>*/}
                    {/*                                        <p>고객 연락처</p>*/}
                    {/*                                    </div>*/}
                    {/*                                    <div className={styles.modal_box_right_content_2_customerInfo_value}>*/}
                    {/*                                        <p>{modalData.carNumber}</p>*/}
                    {/*                                        <p>{modalData.carCharacter}</p>*/}
                    {/*                                        <p>{modalData.phoneNumber}</p>*/}
                    {/*                                    </div>*/}
                    {/*                                </div>*/}
                    {/*                            </div>*/}

                    {/*                            <div className={styles.modal_box_right_content_3}>*/}
                    {/*                                <div className={styles.modal_box_right_content_3_btn}>*/}
                    {/*                                    <div  className={styles.modal_box_right_content_3_btn_deny}*/}
                    {/*                                          onClick={(e)=>{*/}
                    {/*                                              setInnerDeniedModal(prev=>!prev);*/}
                    {/*                                              console.log('setInnerModal clicked')*/}
                    {/*                                              e.stopPropagation();*/}
                    {/*                                          }}>*/}
                    {/*                                        <p>거절</p>*/}
                    {/*                                    </div>*/}
                    {/*                                    <div  className={styles.modal_box_right_content_3_btn_accept} onClick={(e)=>{*/}
                    {/*                                        setInnerAcceptModal(prev=>!prev);*/}
                    {/*                                        console.log('setInnerModal clicked')*/}
                    {/*                                        e.stopPropagation();*/}
                    {/*                                    }}><p>수락</p></div>*/}
                    {/*                                </div>*/}
                    {/*                                /!*<div className={styles.modal_box_right_content_3_cofirmBtnBox}>*!/*/}
                    {/*                                /!*    <div  className={styles.modal_box_right_content_3_cofirmBtn}><p>수락</p></div>*!/*/}

                    {/*                                /!*</div>*!/*/}

                    {/*                            </div>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}

                    {/*        {innerAcceptModal && <div className={styles.outter_Innermodal}  onClick={(e)=>{*/}
                    {/*            e.stopPropagation();*/}
                    {/*            console.log('Inneroutter_modal clicked')*/}
                    {/*            setInnerAcceptModal(prev => !prev);}}>*/}

                    {/*            <div className={styles.innerModal}>*/}
                    {/*                <div className={styles.innerModal_box}>*/}
                    {/*                    <div className={styles.innerModal_box_confirmText}><p>차타고 접수를 수락 하시겠습니까?</p></div>*/}
                    {/*                    <div  className={styles.innerModal_box_confirmBtn_accept}*/}
                    {/*                          onClick={(e) => {*/}
                    {/*                              e.stopPropagation();*/}
                    {/*                              console.log('수락버튼 클릭')*/}
                    {/*                              console.log('수락 서버전송')*/}
                    {/*                              console.log('진행중 화면이동')*/}
                    {/*                              navigate('/processingOrders')*/}
                    {/*                          }*/}
                    {/*                          }*/}
                    {/*                    ><p>수락</p></div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        }*/}

                    {/*        {innerDeniedModal && <div className={styles.outter_Innermodal}  onClick={(e)=>{*/}
                    {/*            e.stopPropagation();*/}
                    {/*            console.log('Inneroutter_modal clicked')*/}
                    {/*            setInnerDeniedModal(prev => !prev);}}>*/}

                    {/*            <div className={styles.innerModal}>*/}
                    {/*                <div className={styles.innerModal_box}>*/}
                    {/*                    <div className={styles.innerModal_box_confirmText}><p>차타고 접수를 거절 하시겠습니까?</p></div>*/}
                    {/*                    <div  className={styles.innerModal_box_confirmBtn_denied}*/}
                    {/*                          onClick={(e) => {*/}
                    {/*                              e.stopPropagation();*/}
                    {/*                              console.log('거절버튼 클릭')*/}
                    {/*                              console.log('거절 서버전송')*/}
                    {/*                              console.log('접수중 화면 이동')*/}

                    {/*                              window.location.reload();*/}
                    {/*                              // location.reload();*/}
                    {/*                          }*/}
                    {/*                          }*/}

                    {/*                    ><p>거절</p></div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*        }*/}

                    {/*    </div>}*/}



                    {/*{modal && <div className={styles.outter_modal} onClick={(e)=>{*/}
                    {/*    console.log('outter_modal clicked')*/}
                    {/*    setModal(prev => !prev);*/}

                    {/*}}>*/}

                    {/*    <div className={styles.inner_modal} onClick={(e)=>{*/}
                    {/*        console.log('inner_modal clicked')}}>*/}
                    {/*        <div className={styles.modal_box} onClick={(e)=>{*/}
                    {/*            //위로 이벤트 전파 막기 위해 e.stopPropagation()사용 !!*/}
                    {/*            e.stopPropagation();*/}
                    {/*            console.log('modal_box clicked')}}>*/}
                    {/*            <div className={styles.modal_box_header}>*/}
                    {/*                <div className={styles.modal_box_header_left}>*/}
                    {/*                    <a className={styles.modal_box_header_left_text}>주문상세</a>*/}
                    {/*                </div>*/}
                    {/*                <a className={styles.modal_box_header_right} onClick={()=>setModal(prev => !prev)}>*/}
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
                    {/*                                    <p className={styles.modal_box_left_content_1_orderbox_ordertime}>5:10 PM</p>*/}
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

                    {/*                        <div className={styles.modal_box_right_content_3}>*/}
                    {/*                            <div className={styles.modal_box_right_content_3_btn}>*/}
                    {/*                                <div  className={styles.modal_box_right_content_3_btn_deny}*/}
                    {/*                                      onClick={(e)=>{*/}
                    {/*                                          setInnerDeniedModal(prev=>!prev);*/}
                    {/*                                          console.log('setInnerModal clicked')*/}
                    {/*                                          e.stopPropagation();*/}
                    {/*                                      }}>*/}
                    {/*                                    <p>거절</p>*/}
                    {/*                                </div>*/}
                    {/*                                <div  className={styles.modal_box_right_content_3_btn_accept} onClick={(e)=>{*/}
                    {/*                                    setInnerAcceptModal(prev=>!prev);*/}
                    {/*                                    console.log('setInnerModal clicked')*/}
                    {/*                                    e.stopPropagation();*/}
                    {/*                                }}><p>수락</p></div>*/}
                    {/*                            </div>*/}
                    {/*                            /!*<div className={styles.modal_box_right_content_3_cofirmBtnBox}>*!/*/}
                    {/*                            /!*    <div  className={styles.modal_box_right_content_3_cofirmBtn}><p>수락</p></div>*!/*/}

                    {/*                            /!*</div>*!/*/}

                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}

                    {/*    {innerAcceptModal && <div className={styles.outter_Innermodal}  onClick={(e)=>{*/}
                    {/*        e.stopPropagation();*/}
                    {/*        console.log('Inneroutter_modal clicked')*/}
                    {/*        setInnerAcceptModal(prev => !prev);}}>*/}

                    {/*        <div className={styles.innerModal}>*/}
                    {/*            <div className={styles.innerModal_box}>*/}
                    {/*                <div className={styles.innerModal_box_confirmText}><p>차타고 접수를 수락 하시겠습니까?</p></div>*/}
                    {/*                <div  className={styles.innerModal_box_confirmBtn_accept}*/}
                    {/*                      onClick={(e) => {*/}
                    {/*                          e.stopPropagation();*/}
                    {/*                          console.log('수락버튼 클릭')*/}
                    {/*                          console.log('수락 서버전송')*/}
                    {/*                          console.log('진행중 화면이동')*/}
                    {/*                          navigate('/processingOrders')*/}
                    {/*                      }*/}
                    {/*                      }*/}
                    {/*                ><p>수락</p></div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    }*/}

                    {/*    {innerDeniedModal && <div className={styles.outter_Innermodal}  onClick={(e)=>{*/}
                    {/*        e.stopPropagation();*/}
                    {/*        console.log('Inneroutter_modal clicked')*/}
                    {/*        setInnerDeniedModal(prev => !prev);}}>*/}

                    {/*        <div className={styles.innerModal}>*/}
                    {/*            <div className={styles.innerModal_box}>*/}
                    {/*                <div className={styles.innerModal_box_confirmText}><p>차타고 접수를 거절 하시겠습니까?</p></div>*/}
                    {/*                <div  className={styles.innerModal_box_confirmBtn_denied}*/}
                    {/*                      onClick={(e) => {*/}
                    {/*                          e.stopPropagation();*/}
                    {/*                          console.log('거절버튼 클릭')*/}
                    {/*                          console.log('거절 서버전송')*/}
                    {/*                          console.log('접수중 화면 이동')*/}

                    {/*                          window.location.reload();*/}
                    {/*                          // location.reload();*/}
                    {/*                      }*/}
                    {/*                      }*/}

                    {/*                ><p>거절</p></div>*/}
                    {/*            </div>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    }*/}

                    {/*</div>*/}


                    {/*}*/}
                </>
            )
    );

};

export default BeforeAcceptOrders;


