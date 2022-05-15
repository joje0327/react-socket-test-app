import {Button, Form, Header, Input, Label} from "../styles";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from 'axios';
import {Link, Navigate} from "react-router-dom";
import styles from './ProccessingOrders.module.css';
import logoImg from '../../images/logos.png'
import dayjs from "dayjs";
import {RenderAfterNavermapsLoaded, NaverMap, Marker} from 'react-naver-maps';
import closeBtn from "../../images/closeBtn.png";
import Text1 from "../../images/1.png"
import Text2 from "../../images/2.png"
import Text3 from "../../images/3.png"
import {useNavigate} from "react-router";
import ModalInBeforeAcceptOrders from "../modalInbeforAcceptOrders/ModalInBeforeAcceptOrders";
import ModalInProcessingOrders from "../modalInProcessingOrders/ModalInProcessingOrders";
import {Skeleton} from "@mui/material";



import { Client, Message } from '@stomp/stompjs';

// const { naver } = window;
// console.log(naver);
// const navermaps = window.naver.maps;
//

let socket = '';
var latlog = undefined;


const ProcessingOrders = () => {

    const navermaps = window.naver.maps;

    const latlog2 = [{latitude: 37.32605360999999, logitude: 126.95153044999995},
        {latitude: 37.32705360999999, logitude: 126.95153044999995},
        {latitude: 37.32805360999999, logitude: 126.95153044999995},
        {latitude: 37.32905360999999, logitude: 126.95153044999995},
        {latitude: 37.32505360999999, logitude: 126.95153044999995},
    ];

    // const [latlog, setLatlog] = useState();


    const SOCKET_URL = 'ws://ec2-3-35-164-61.ap-northeast-2.compute.amazonaws.com/ws-message';
    // const SOCKET_URL = 'ws://localhost:8080/ws-message';

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
                console.log("message:", msg);
                let jsonBody = JSON.parse(msg.body);
                console.log("jsonBody:", jsonBody);
                latlog = jsonBody;
                // setLatlog(prev => jsonBody);
                console.log("latlog", latlog);

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

    // const SOCKET_URL = 'ws://localhost:8080/ws-message';
    //
    //
    // const [client, setClient] = useState(new Client({
    //     brokerURL: SOCKET_URL,
    //     reconnectDelay: 5000,
    //     heartbeatIncoming: 4000,
    //     heartbeatOutgoing: 4000,
    //     // onConnect:onConnected,
    //     // onDisconnect: onDisconnected);
    // }));
    //
    // useEffect(() => {
    //
    //     console.log('소켓연결시작')
    //
    //     let connection = async function () {
    //         let client = await new Client({
    //                 brokerURL: SOCKET_URL,
    //                 reconnectDelay: 5000,
    //                 heartbeatIncoming: 4000,
    //                 heartbeatOutgoing: 4000,
    //                 // onConnect:onConnected,
    //                 // onDisconnect: onDisconnected
    //             }
    //         )
    //         console.log('client:', client)
    //         client.onConnect = () => {
    //             console.log("Connected!!");
    //             client.subscribe('/topic/message', function (msg) {
    //                 console.log('topic/message:', msg.body);
    //                 if (msg.body) {
    //                     var jsonBody = JSON.parse(msg.body);
    //                     if (jsonBody) {
    //                         console.log('mesaage:',jsonBody);
    //                     }
    //                 }
    //             });
    //         };
    //         client.onDisconnect = () => {
    //             console.log("Disconnected!!");
    //         }
    //         await client.activate();
    //         console.log('client', client);
    //         socket = client;
    //     }
    //
    //     connection();
    //
    //     console.log('socket return', socket)
    //
    //
    //     return (ddd)=> {
    //         // ddd.deactivate()
    //         console.log('socket in cleanupss', socket);
    //         socket.deactivate().then(r => console.log('클린업이후 소켓',socket));
    //         console.log('클린업이후 소켓DDDD',socket)
    //
    //
    //
    //         console.log('clean up');
    //     };
    //
    // }, [])
    //
    // function pubtostore() {
    //     console.log("app/sendMessage")
    //     client.publish({destination: '/app/sendMessage', body: '{"message":"bbbccc"}'});
    // }



    const navigate = useNavigate();

    const [orderHistory, setOrderHistory] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [orderCnt, setOrderCnt] = useState(0);


    const [modal, setModal] = useState(false);
    const [modalData, setModalData] = useState({});

    const [storeAvailable, setStoreAvailable] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [storeStatus, setStoreStatus] = useState(orderHistory.storeAvailable ? '영업중' : 'CLOSED');


    const [storeId, setStoreId] = useState(localStorage.getItem("store_id"));


    // const mapOptions = {
    //     center: new naver.maps.LatLng(37.3595704, 127.105399),
    //     zoom: 10,
    // };
    // const map = new naver.maps.Map("map", mapOptions);




    const getOrderHistoryInfo = async function getOrderHistory(storeId) {
        try {
            console.log("오더 리스트로 요청시작");
            const response = await axios.get(`http://3.35.164.61:80/api/v1/store/processingorder?storeId=${storeId}`);
            // const response = await axios.get(`http://localhost:8080/api/v1/store/processingorder?storeId=${storeId}`);
            console.log(response)
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
        getOrderHistoryInfo(storeId);
        const checkLogged = localStorage.getItem("store_id")
        if (checkLogged == null || checkLogged == "") {
            alert("로그인이 필요합니다")
            window.location.href = "/login"; // redirect
            return undefined;
        }
        getStoreInformation(localStorage.getItem("store_id"));



        return undefined;

    }, []);

    useEffect(()=> {
        // const updating = setInterval(getOrderHistoryInfo, 2000);
        const updating = setInterval(function (){getOrderHistoryInfo(storeId)}, 2000);
        console.log('setTimeOut실행')

        return ()=> clearInterval(updating);
    },[])

    // useEffect(() => {
    //     let map = null;
    //     const initMap = () => {
    //         const map = new naver.maps.Map("map", {
    //             center: new naver.maps.LatLng(37.511337, 127.012084),
    //             zoom: 13,
    //         })};
    //     initMap();
    // }, []);


    return (
        (isLoading) ? (<Skeleton
            sx={{bgcolor: '#A0A7AC'}}
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
                            <Link to="/orders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>전체
                                주문 내역 &nbsp;(TEST용)</p></Link>
                            <Link to="/beforeAcceptOrders" className={styles.sideBarMenu}><p
                                className={styles.sideBarMenuText}>접수 대기</p></Link>
                            <Link to="/processingOrders" className={styles.sideBarMenuSelected}><p
                                className={styles.sideBarMenuText}>진행중</p></Link>
                            <Link to="/orderHistory" className={styles.sideBarMenu}><p
                                className={styles.sideBarMenuText}>지난 주문내역</p></Link>
                            <Link to="/stockManage" className={styles.sideBarMenu}><p
                                className={styles.sideBarMenuText}>품절 관리</p></Link>
                            <Link to="/settings" className={styles.sideBarMenu}><p
                                className={styles.sideBarMenuText}>설정</p></Link>
                        </div>
                        <div className={styles.onOpen}>
                            <label className={styles.switch}>
                                <input type={"checkbox"} checked={storeAvailable}
                                       onClick={() => setStoreAvailable(prev => !prev)}/>
                                <span className={`${styles.slider} ${styles.round}`}></span>
                                {/*className={`${styles.description} ${styles.yellow}`}*/}
                            </label>
                            <p className={styles.onOpenText}>{storeAvailable ? '영업중' : 'Closed'}</p>
                        </div>
                    </div>


                    <div className={styles.contentWrapper}>
                        <div className={styles.content}>
                            <div className={styles.leftContents}>
                                <div className={styles.orderStatus}>
                                    <p className={styles.orderStatusText}>진행중 {orderCnt}</p>
                                </div>

                                {orderHistory?.map((orderInfo, index) => {
                                    return (
                                        <div className={styles.orderBox} key={index}
                                             onClick={(e) => {
                                                 console.log('button clicked');
                                                 console.log('data in button', orderInfo);
                                                 setModalData(orderInfo);
                                                 setModal(prev => !prev);
                                             }}
                                        >
                                            <div>
                                                {/*<p className={styles.shopName}>{orderInfo.storeName}</p>*/}
                                                {/*<p className={styles.shopStatus}>status : {orderInfo.orderStatus}</p>*/}
                                                <p className={styles.shopStatus}>02가3456</p>
                                                {/*<p className={styles.shopStatus}>orderId : {orderInfo.orderId}</p>*/}
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

                            <div className={styles.rightContents}>
                                <div className={styles.mapContent}>
                                    <p className={styles.mapText}>실시간 고객위치</p>
                                </div>
                                <RenderAfterNavermapsLoaded
                                    ncpClientId='5cjph8zkm1' // 자신의 네이버 계정에서 발급받은 Client ID
                                    error={<p>Maps Load Error</p>}
                                    loading={<p>Maps Loading...</p>}
                                >
                                    <NaverMap
                                        mapDivId={'maps-getting-started-uncontrolled'} // default: react-naver-map
                                        style={{
                                            width: '100%', // 네이버지도 가로 길이
                                            height: '85vh' // 네이버지도 세로 길이
                                        }}
                                        defaultCenter={{lat: 37.554722, lng: 126.970833}} // 지도 초기 위치
                                        defaultZoom={13} // 지도 초기 확대 배율
                                    >
                                        {/*{latlog && (latlog.map((pos, index)=>(*/}
                                        {/*    <Marker*/}
                                        {/*    key={index}*/}
                                        {/*    position={new navermaps.LatLng(pos.message.latitude, pos.message.logitude)}*/}
                                        {/*    onClick={() => {alert('여기는 N서울타워입니다.');}}*/}
                                        {/*    />*/}
                                        {/*)))}*/}

                                        {console.log("hahahahah2222", latlog2)}
                                        {console.log("hahahahah1111", latlog)}

                                        {console.log(typeof (latlog))}
                                        {console.log(typeof (latlog2))}

                                        {(latlog !== undefined || latlog !== null) &&
                                            (
                                                latlog?.map((pos,index) => (
                                                    <Marker key={index}
                                                            position = {new navermaps.LatLng(pos.latitude, pos.longitude)}
                                                    />
                                                    )

                                                )
                                            )
                                        }


                                        {/*{console.log("hahahahah",latlog)}*/}
                                        {latlog?.map(i => console.log(i.latitude, i.longitude))}


                                        {/*{latlog2.map((pos, index)=> (*/}
                                        {/*    <Marker*/}
                                        {/*        key={index}*/}
                                        {/*        position = {new navermaps.LatLng(pos.latitude, pos.logitude)}*/}
                                        {/*    />)*/}
                                        {/*)}*/}

                                        {/*{setInterval(function (latlog) {*/}
                                        {/*    console.log("dddd lat lll : ", latlog)*/}
                                        {/*    latlog.map((pos, index) => (*/}
                                        {/*        <Marker*/}
                                        {/*            key={index}*/}
                                        {/*            position={new navermaps.LatLng(pos.message.latitude, pos.message.logitude)}*/}
                                        {/*            onClick={() => {*/}
                                        {/*                alert('여기는 N서울타워입니다.');*/}
                                        {/*            }}*/}
                                        {/*        />*/}
                                        {/*    ))*/}
                                        {/*}, 2000)}*/}

                                        {/*<Marker*/}
                                        {/*    key={1}*/}
                                        {/*    position={new navermaps.LatLng(37.32605360999999, 126.95153044999995)}*/}
                                        {/*    // animation={2}*/}
                                        {/*    onClick={() => {alert('여기는 N서울타워입니다.');}}*/}
                                        {/*/>*/}

                                    </NaverMap>
                                </RenderAfterNavermapsLoaded>

                            </div>

                        </div>
                    </div>
                </div>


                {modal && (<ModalInProcessingOrders modal={modal} setModal={setModal} modalData={modalData}
                                                    setModalData={setModalData} navigate={navigate}/>)}


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
                {/*                                <div  className={styles.modal_box_right_content_3_btn_accepted}*/}
                {/*                                      onClick={(e)=>{*/}
                {/*                                          console.log('접수완료 clicked')*/}
                {/*                                          e.stopPropagation();*/}
                {/*                                      }}>*/}
                {/*                                    <img src={Text1} className={styles.modal_box_right_content_3_btn_accepted_Text1}></img>*/}
                {/*                                    <p  className={styles.modal_box_right_content_3_btn_accepted_Text2}>접수완료</p>*/}
                {/*                                </div>*/}
                {/*                                <div  className={styles.modal_box_right_content_3_btn_ready}*/}
                {/*                                      onClick={(e)=>{*/}
                {/*                                          console.log('준비완료 clicked')*/}
                {/*                                          e.stopPropagation();*/}
                {/*                                      }}>*/}
                {/*                                    <img src={Text2} className={styles.modal_box_right_content_3_btn_accepted_Text1}></img>*/}
                {/*                                    <p  className={styles.modal_box_right_content_3_btn_accepted_Text2}>준비완료</p>*/}
                {/*                                </div>*/}
                {/*                                <div  className={styles.modal_box_right_content_3_pickedup} onClick={(e)=>{*/}
                {/*                                    console.log('전달완료 clicked')*/}
                {/*                                    e.stopPropagation();*/}
                {/*                                    navigate('/orderHistory')*/}

                {/*                                }}>*/}
                {/*                                    <img src={Text3} className={styles.modal_box_right_content_3_btn_accepted_Text1}></img>*/}
                {/*                                    <p  className={styles.modal_box_right_content_3_btn_accepted_Text2}>전달완료</p>*/}
                {/*                                </div>*/}
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

                {/*</div>*/}


                {/*}*/}


            </>
        )
    );

};

export default ProcessingOrders;


