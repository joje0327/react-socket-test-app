import {Button, Form, Header, Input, Label} from "../styles";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from 'axios';
import {Link, Navigate} from "react-router-dom";
import styles from './StockManage.module.css';
import logoImg from '../../images/logos.png'
import dayjs from "dayjs";
import {useNavigate} from "react-router";
import closeBtn from "../../images/closeBtn.png";
import menuImg from "../../images/menuImg.png"
import ProductInfo from "../productInfo/ProductInfo";
import {Skeleton} from "@mui/material";
import chatagoJumun from "../../sound/chatagojumun.wav";



const useAudio = () => {
    const [audio] = useState(new Audio(chatagoJumun));
    const [playing, setPlaying] = useState(false);



    const toggle = () => {
        console.log('sound clicked !!')
        console.log('audio',audio);
        setPlaying(!playing)
        console.log('playing', playing);
    };

    useEffect(() => {
            playing ? audio.play() : audio.pause();
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

const StockManage = () => {

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

    const [stocksInfo, setStocksInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [orderCnt, setOrderCnt] = useState(0);

    const [modal, setModal] = useState(false);


    const [storeAvailable, setStoreAvailable] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [storeStatus, setStoreStatus] = useState(stocksInfo.storeAvailable ? '영업중' : 'CLOSED');

    const [storeId, setStoreId] = useState(localStorage.getItem("store_id"));


    const [playing, toggle] = useAudio();


    const audioRef = useRef();





    const getStockInfo = async function getStockList(storeId) {
        try {
            console.log("오더 리스트로 요청시작");
            // const response = await axios.get(`http://localhost:8080/api/v1/store/products?storeId=${storeId}`);
            const response = await axios.get(`http://ec2-3-35-164-61.ap-northeast-2.compute.amazonaws.com/api/v1/store/products?storeId=${storeId}`);
            console.log(response)

            const sortedResponse = [...response.data.data].sort(
                (a, b) => {
                    a = new Date(a.arrivingTime);
                    b = new Date(b.arrivingTime);
                    return a > b ? -1 : a < b ? 1 : 0;
                }
            );
            setStocksInfo(sortedResponse);
            console.log("오더내역 리스트 내림차순 정리하여 저장");
            setOrderCnt(sortedResponse.length);
            setIsLoading(false);

            console.log('toggle',toggle)
            // toggle();
            return sortedResponse;


        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {

        setIsLoading(true);

        console.log("화면 로딩시 상점 정보 가져옴");

        getStoreInformation(localStorage.getItem("store_id"));

        console.log("화면 로딩시 재고 정보 가져옴");
        getStockInfo(storeId);

        return undefined;

    }, []);


    useEffect(() => {
        setTimeout(function () {
            console.log("로그인 여부체크");
            const checkLogged = localStorage.getItem("store_id")
            if (checkLogged == null || checkLogged == "") {
                alert("로그인이 필요합니다")
                window.location.href = "/login"; // redirect
                return undefined;
            }
        },2000);
    },[]);

    // useEffect(()=> {
    //     const updating = setInterval(getStockInfo, 3000);
    //     console.log('setTimeOut실행');
    //
    //
    //     return ()=> clearInterval(updating);
    // },[])


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
                            <Link to="/orderHistory" className={styles.sideBarMenu}><p
                                className={styles.sideBarMenuText}>지난 주문내역</p></Link>
                            <Link to="/stockManage" className={styles.sideBarMenuSelected}><p
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
                                <div className={styles.orderStatusText} onClick={() => {
                                    audioRef.current.play()
                                }}>드라이빙 픽업 메뉴
                                    {console.log('다시 랜더링')}
                                </div>
                            </div>


                            {stocksInfo.map((stocksInfo, index)=>{
                                return(
                                    <ProductInfo stocksInfo={stocksInfo} getStockInfo={getStockInfo} setStocksInfo={setStocksInfo} storeId={storeId} ></ProductInfo>
                                    // <div className={styles.pickupMenuBox}>
                                    //     <img src={menuImg} className={styles.pickupMenuBox_image}></img>
                                    //     <div className={styles.pickupMenuBox_menu}>
                                    //         <div className={styles.pickupMenuBox_menu_title}>
                                    //             {stocksInfo.productName}
                                    //         </div>
                                    //         <div className={styles.pickupMenuBox_menu_price}>
                                    //             {stocksInfo.productPrice.toLocaleString()}원
                                    //         </div>
                                    //     </div>
                                    //     <div className={styles.pickupMenuBox_statusbox}>
                                    //
                                    //         <div className={styles.pickupMenuBox_statusbox_slider}>
                                    //             <label className={styles.switch}>
                                    //                 <input type={"checkbox"} checked={stocksInfo.orderAvailable}/>
                                    //                 {console.log('orderAvailable', stocksInfo.orderAvailable)}
                                    //                 <span className={`${styles.slider} ${styles.round}`}></span>
                                    //                 {/*className={`${styles.description} ${styles.yellow}`}*/}
                                    //             </label>
                                    //
                                    //         </div>
                                    //         <p className={styles.pickupMenuBox_statusbox_text}>영업중</p>
                                    //     </div>
                                    // </div>


                                )
                            })}

                            {/*<button onClick={() => setSoundeffect(prev => !prev)}>play Sound</button>*/}
                            {/*<div>*/}
                            {/*    <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>*/}
                            {/*</div>*/}
                            <audio preload="auto"
                                   src="/static/media/mixkit-retro-game-notification-212.b222ebf03a29c11b61f0.wav"
                                   ref={audioRef}></audio>


                        </div>
                    </div>


                </div>


                {modal && <div className={styles.outter_modal} onClick={(e) => {
                    console.log('outter_modal clicked')
                    setModal(prev => !prev);

                }}>

                    <div className={styles.inner_modal} onClick={(e) => {
                        console.log('inner_modal clicked')
                    }}>
                        <div className={styles.modal_box} onClick={(e) => {
                            //위로 이벤트 전파 막기 위해 e.stopPropagation()사용 !!
                            e.stopPropagation();
                            console.log('modal_box clicked')
                        }}>
                            <div className={styles.modal_box_header}>
                                <div className={styles.modal_box_header_left}>
                                    <a className={styles.modal_box_header_left_text}>주문상세</a>
                                </div>
                                <a className={styles.modal_box_header_right} onClick={() => setModal(prev => !prev)}>
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
                                                    <p className={styles.modal_box_left_content_1_orderbox_ordertime}>5:10
                                                        PM</p>
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

export default StockManage;


