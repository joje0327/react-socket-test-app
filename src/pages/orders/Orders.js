import {Button, Form, Header, Input, Label} from "../styles";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from 'axios';
import {Link, Navigate} from "react-router-dom";
import styles from './Orders.module.css';
import logoImg from '../../images/logos.png'
import dayjs from "dayjs";
import {Skeleton} from "@mui/material";


const Orders = () => {

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




    const [orderHistory, setOrderHistory] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [orderCnt, setOrderCnt] = useState(0);


    const [storeAvailable, setStoreAvailable] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [storeStatus, setStoreStatus] = useState(orderHistory.storeAvailable ? '영업중' : 'CLOSED');



    useEffect(() => {
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
        const getOrderHistoryInfo = async function getOrderHistory() {
            try {
                console.log("오더 리스트로 요청시작");
                const response = await axios.get("http://ec2-3-35-164-61.ap-northeast-2.compute.amazonaws.com/api/v1/store/orderHistory");
                // const response = await axios.get("http://3.35.164.61:80/api/v1/store/orderHistory");
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

                const checkLogged = localStorage.getItem("store_id")
                if (checkLogged == null || checkLogged == "") {
                    alert("로그인이 필요합니다")
                    window.location.href = "/login"; // redirect
                    return undefined;
                }


                setOrderCnt(sortedResponse.length);
                setIsLoading(false);

            } catch (error) {
                console.log(error);
            }
        };



        setIsLoading(true);
        getOrderHistoryInfo();

        getStoreInformation(localStorage.getItem("store_id"));
        return () => undefined;

    }, []);

    useEffect(()=> {
        const getOrderHistoryInfo = async function getOrderHistory() {
            try {
                console.log("오더 리스트로 요청시작");
                const response = await axios.get("http://ec2-3-35-164-61.ap-northeast-2.compute.amazonaws.com/api/v1/store/orderHistory");
                // const response = await axios.get("http://3.35.164.61:80/api/v1/store/orderHistory");
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

                const checkLogged = localStorage.getItem("store_id")
                if (checkLogged == null || checkLogged == "") {
                    alert("로그인이 필요합니다")
                    window.location.href = "/login"; // redirect
                    return undefined;
                }


                setOrderCnt(sortedResponse.length);
                setIsLoading(false);

            } catch (error) {
                console.log(error);
            }
        };

        const updating = setInterval(getOrderHistoryInfo, 2000);
        console.log('setInterval실행')

        return ()=> clearInterval(updating);
    },[])


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
                            <Link to="/orders" className={styles.sideBarMenuSelected}><p
                                className={styles.sideBarMenuText}>전체 주문 내역 &nbsp;(TEST용)</p></Link>
                            <Link to="/beforeAcceptOrders" className={styles.sideBarMenu}><p
                                className={styles.sideBarMenuText}>접수 대기</p></Link>
                            <Link to="/processingOrders" className={styles.sideBarMenu}><p
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
                            <div className={styles.orderStatus}>
                                <p className={styles.orderStatusText}>전체 주문 {orderCnt}</p>
                            </div>

                            {orderHistory?.map((orderInfo, index) => {
                                return (
                                    <div className={styles.orderBox} key={index}>
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
            </>
        )
    );

};

export default Orders;


