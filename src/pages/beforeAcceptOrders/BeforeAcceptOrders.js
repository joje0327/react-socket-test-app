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
import chatagoJumun from "../../assets/chatagojumun.wav";
import {Client} from '@stomp/stompjs'



const useAudio = () => {
    const [audio] = useState(new Audio(chatagoJumun));
    console.log(audio);
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
                //             // alert("?????? ??????");
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
            console.log("?????? ???????????? ????????????");
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
    const [storeStatus, setStoreStatus] = useState(orderHistory.storeAvailable ? '?????????' : 'CLOSED');

    const [storeId, setStoreId] = useState(localStorage.getItem("store_id"));



    const getOrderHistoryInfo = async function getOrderHistory(storeId) {
        try {

            console.log("?????? ???????????? ????????????");
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
            console.log("???????????? ????????? ???????????? ???????????? ??????");
            setOrderCnt(sortedResponse.length);
            setIsLoading(false);

            // ????????? ????????? ??????
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
            alert("????????? ????????? ?????? ????????? ?????????");
            window.location.href = "/login";
            return ()=>undefined;

        }

        //????????? ?????? ????????? ??????
        setIsLoading(true);
        getOrderHistoryInfo(storeId);


        //?????? ????????? ??????
        getStoreInformation(localStorage.getItem("store_id"));

        return ()=>(undefined);

    }, []);

    useEffect(()=> {
        //2??? ?????? ?????? ?????? ?????? ???????????? ????????????
        const updating = setInterval(function (){getOrderHistoryInfo(storeId)}, 2000);

        console.log('setTimeOut??????');

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
                            <p><span className={styles.headerLogoutBox_text}>{storeName}</span> ??? ???????????????.</p>
                            <div className={styles.headerLogoutBox_LogoutBtn} onClick={() => {
                                console.log("btn clicked")
                                localStorage.removeItem("store_id");
                                window.location.href = "/login";
                            }}><p>????????????</p></div>
                        </div>
                    </header>
                    <div id="container" className={styles.container}>
                        <div className={styles.sideBar}>
                            <div className={styles.sideBarMenus}>
                                <Link to="/orders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>?????? ?????? ?????? &nbsp;(TEST???)</p></Link>
                                <Link to="/beforeAcceptOrders" className={styles.sideBarMenuSelected}><p className={styles.sideBarMenuText}>?????? ??????</p></Link>
                                <Link to="/processingOrders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>?????????</p></Link>
                                <Link to="/orderHistory" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>?????? ????????????</p></Link>
                                <Link to="/stockManage" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>?????? ??????</p></Link>
                                <Link to="/settings" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>??????</p></Link>
                            </div>
                            <div className={styles.onOpen}>
                                <label className={styles.switch}>
                                    <input type={"checkbox"} checked={storeAvailable} onClick={()=>setStoreAvailable(prev=>!prev)} />
                                    <span className={`${styles.slider} ${styles.round}`}></span>
                                    {/*className={`${styles.description} ${styles.yellow}`}*/}
                                </label>
                                <p className={styles.onOpenText}>{storeAvailable ? '?????????' : 'Closed'}</p>
                            </div>
                        </div>


                        <div className={styles.contentWrapper}>
                            <div className={styles.content}>
                                <div className={styles.orderStatus}>
                                    <p className={styles.orderStatusText}>?????? ?????? {orderCnt}</p>
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
                                                <p className={styles.shopStatus}>02???3456</p>
                                                <p className={styles.shopStatus}>(????????????)</p>
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
                               src="/static/media/chatagojumun.27580a8d193db1903881.wav"
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
                    {/*                //?????? ????????? ?????? ?????? ?????? e.stopPropagation()?????? !!*/}
                    {/*                e.stopPropagation();*/}
                    {/*                console.log('modal_box clicked')}}>*/}
                    {/*                <div className={styles.modal_box_header}>*/}
                    {/*                    <div className={styles.modal_box_header_left}>*/}
                    {/*                        <a className={styles.modal_box_header_left_text}>????????????</a>*/}
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
                    {/*                                        <p className={styles.modal_box_left_content_1_orderbox_ordernum}>????????????</p>*/}
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
                    {/*                                    <p className={styles.modal_box_left_content_3_ordersummary_total}>?????????</p>*/}
                    {/*                                    <p className={styles.modal_box_left_content_3_ordersummary_totalcnt}>{modalData.orderDetailList}</p>*/}
                    {/*                                    <p className={styles.modal_box_left_content_3_ordersummary_totalprice}>{modalData.finalAmount}???</p>*/}
                    {/*                                </div>*/}



                    {/*                            </div>*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}

                    {/*                    <div className={styles.modal_box_right_content_wrapper}>*/}
                    {/*                        <div className={styles.modal_box_right_content}>*/}
                    {/*                            <div className={styles.modal_box_right_content_1}>*/}
                    {/*                                <div className={styles.modal_box_right_content_1_left}>*/}
                    {/*                                    <p>?????? ??????????????????</p>*/}
                    {/*                                </div>*/}
                    {/*                                <div className={styles.modal_box_right_content_1_right}>*/}
                    {/*                                    <p>{modalData.arrivingTime} PM(30??? ???)</p>*/}
                    {/*                                    <p>32Km ?????? </p>*/}
                    {/*                                </div>*/}




                    {/*                            </div>*/}
                    {/*                            <div className={styles.modal_box_right_content_2}>*/}
                    {/*                                <div className={styles.modal_box_right_content_2_customerInfo}>*/}
                    {/*                                    <div className={styles.modal_box_right_content_2_customerInfo_cat}>*/}
                    {/*                                        <p>????????????</p>*/}
                    {/*                                        <p>????????????</p>*/}
                    {/*                                        <p>?????? ?????????</p>*/}
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
                    {/*                                        <p>??????</p>*/}
                    {/*                                    </div>*/}
                    {/*                                    <div  className={styles.modal_box_right_content_3_btn_accept} onClick={(e)=>{*/}
                    {/*                                        setInnerAcceptModal(prev=>!prev);*/}
                    {/*                                        console.log('setInnerModal clicked')*/}
                    {/*                                        e.stopPropagation();*/}
                    {/*                                    }}><p>??????</p></div>*/}
                    {/*                                </div>*/}
                    {/*                                /!*<div className={styles.modal_box_right_content_3_cofirmBtnBox}>*!/*/}
                    {/*                                /!*    <div  className={styles.modal_box_right_content_3_cofirmBtn}><p>??????</p></div>*!/*/}

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
                    {/*                    <div className={styles.innerModal_box_confirmText}><p>????????? ????????? ?????? ???????????????????</p></div>*/}
                    {/*                    <div  className={styles.innerModal_box_confirmBtn_accept}*/}
                    {/*                          onClick={(e) => {*/}
                    {/*                              e.stopPropagation();*/}
                    {/*                              console.log('???????????? ??????')*/}
                    {/*                              console.log('?????? ????????????')*/}
                    {/*                              console.log('????????? ????????????')*/}
                    {/*                              navigate('/processingOrders')*/}
                    {/*                          }*/}
                    {/*                          }*/}
                    {/*                    ><p>??????</p></div>*/}
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
                    {/*                    <div className={styles.innerModal_box_confirmText}><p>????????? ????????? ?????? ???????????????????</p></div>*/}
                    {/*                    <div  className={styles.innerModal_box_confirmBtn_denied}*/}
                    {/*                          onClick={(e) => {*/}
                    {/*                              e.stopPropagation();*/}
                    {/*                              console.log('???????????? ??????')*/}
                    {/*                              console.log('?????? ????????????')*/}
                    {/*                              console.log('????????? ?????? ??????')*/}

                    {/*                              window.location.reload();*/}
                    {/*                              // location.reload();*/}
                    {/*                          }*/}
                    {/*                          }*/}

                    {/*                    ><p>??????</p></div>*/}
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
                    {/*            //?????? ????????? ?????? ?????? ?????? e.stopPropagation()?????? !!*/}
                    {/*            e.stopPropagation();*/}
                    {/*            console.log('modal_box clicked')}}>*/}
                    {/*            <div className={styles.modal_box_header}>*/}
                    {/*                <div className={styles.modal_box_header_left}>*/}
                    {/*                    <a className={styles.modal_box_header_left_text}>????????????</a>*/}
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
                    {/*                                    <p className={styles.modal_box_left_content_1_orderbox_ordernum}>????????????</p>*/}
                    {/*                                    <p className={styles.modal_box_left_content_1_orderbox_ordernumtext}>#0001</p>*/}
                    {/*                                </div>*/}
                    {/*                                <div>*/}
                    {/*                                    <p className={styles.modal_box_left_content_1_orderbox_ordertime}>5:10 PM</p>*/}
                    {/*                                </div>*/}

                    {/*                            </div>*/}
                    {/*                            <div className={styles.modal_box_left_content_1_line2}>*/}
                    {/*                                <div className={styles.modal_box_left_content_1_orderstatus}>*/}
                    {/*                                    <p className={styles.modal_box_left_content_1_orderstatus_menu}>??????3???</p>*/}
                    {/*                                    <p className={styles.modal_box_left_content_1_orderstatus_price}>200000???</p>*/}
                    {/*                                    <p className={styles.modal_box_left_content_1_orderstatus_status}>????????????</p>*/}
                    {/*                                </div>*/}
                    {/*                            </div>*/}


                    {/*                        </div>*/}
                    {/*                        <div className={styles.modal_box_left_content_2}>*/}
                    {/*                            <div className={styles.modal_box_left_content_2_menuList}>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_title}>????????????</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_price}>7,000???</p>*/}
                    {/*                            </div>*/}
                    {/*                            <div className={styles.modal_box_left_content_2_menuList}>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_title}>????????????</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_price}>7,000???</p>*/}
                    {/*                            </div>*/}
                    {/*                            <div className={styles.modal_box_left_content_2_menuList}>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_title}>????????????</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_price}>7,000???</p>*/}
                    {/*                            </div>*/}
                    {/*                            <div className={styles.modal_box_left_content_2_menuList}>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_title}>????????????</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_price}>7,000???</p>*/}
                    {/*                            </div>*/}
                    {/*                            <div className={styles.modal_box_left_content_2_menuList}>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_title}>????????????</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_price}>7,000???</p>*/}
                    {/*                            </div>*/}
                    {/*                            <div className={styles.modal_box_left_content_2_menuList}>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_title}>????????????</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_cnt}>1</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_2_menuList_price}>7,000???</p>*/}
                    {/*                            </div>*/}

                    {/*                        </div>*/}









                    {/*                        <div className={styles.modal_box_left_content_3}>*/}
                    {/*                            <div className={styles.modal_box_left_content_3_ordersummary}>*/}
                    {/*                                <p className={styles.modal_box_left_content_3_ordersummary_total}>?????????</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_3_ordersummary_totalcnt}>2</p>*/}
                    {/*                                <p className={styles.modal_box_left_content_3_ordersummary_totalprice}>20,000???</p>*/}
                    {/*                            </div>*/}



                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}

                    {/*                <div className={styles.modal_box_right_content_wrapper}>*/}
                    {/*                    <div className={styles.modal_box_right_content}>*/}
                    {/*                        <div className={styles.modal_box_right_content_1}>*/}
                    {/*                            <div className={styles.modal_box_right_content_1_left}>*/}
                    {/*                                <p>?????? ??????????????????</p>*/}
                    {/*                            </div>*/}
                    {/*                            <div className={styles.modal_box_right_content_1_right}>*/}
                    {/*                                <p>5:41 PM(30??? ???)</p>*/}
                    {/*                                <p>32Km ?????? </p>*/}
                    {/*                            </div>*/}




                    {/*                        </div>*/}
                    {/*                        <div className={styles.modal_box_right_content_2}>*/}
                    {/*                            <div className={styles.modal_box_right_content_2_customerInfo}>*/}
                    {/*                                <div className={styles.modal_box_right_content_2_customerInfo_cat}>*/}
                    {/*                                    <p>????????????</p>*/}
                    {/*                                    <p>????????????</p>*/}
                    {/*                                    <p>?????? ?????????</p>*/}
                    {/*                                </div>*/}
                    {/*                                <div className={styles.modal_box_right_content_2_customerInfo_value}>*/}
                    {/*                                    <p>12???3456</p>*/}
                    {/*                                    <p>?????? ?????????</p>*/}
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
                    {/*                                    <p>??????</p>*/}
                    {/*                                </div>*/}
                    {/*                                <div  className={styles.modal_box_right_content_3_btn_accept} onClick={(e)=>{*/}
                    {/*                                    setInnerAcceptModal(prev=>!prev);*/}
                    {/*                                    console.log('setInnerModal clicked')*/}
                    {/*                                    e.stopPropagation();*/}
                    {/*                                }}><p>??????</p></div>*/}
                    {/*                            </div>*/}
                    {/*                            /!*<div className={styles.modal_box_right_content_3_cofirmBtnBox}>*!/*/}
                    {/*                            /!*    <div  className={styles.modal_box_right_content_3_cofirmBtn}><p>??????</p></div>*!/*/}

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
                    {/*                <div className={styles.innerModal_box_confirmText}><p>????????? ????????? ?????? ???????????????????</p></div>*/}
                    {/*                <div  className={styles.innerModal_box_confirmBtn_accept}*/}
                    {/*                      onClick={(e) => {*/}
                    {/*                          e.stopPropagation();*/}
                    {/*                          console.log('???????????? ??????')*/}
                    {/*                          console.log('?????? ????????????')*/}
                    {/*                          console.log('????????? ????????????')*/}
                    {/*                          navigate('/processingOrders')*/}
                    {/*                      }*/}
                    {/*                      }*/}
                    {/*                ><p>??????</p></div>*/}
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
                    {/*                <div className={styles.innerModal_box_confirmText}><p>????????? ????????? ?????? ???????????????????</p></div>*/}
                    {/*                <div  className={styles.innerModal_box_confirmBtn_denied}*/}
                    {/*                      onClick={(e) => {*/}
                    {/*                          e.stopPropagation();*/}
                    {/*                          console.log('???????????? ??????')*/}
                    {/*                          console.log('?????? ????????????')*/}
                    {/*                          console.log('????????? ?????? ??????')*/}

                    {/*                          window.location.reload();*/}
                    {/*                          // location.reload();*/}
                    {/*                      }*/}
                    {/*                      }*/}

                    {/*                ><p>??????</p></div>*/}
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


