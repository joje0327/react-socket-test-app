import {Button, Form, Header, Input, Label} from "../styles";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from 'axios';
import {Link, Navigate} from "react-router-dom";
import styles from './Orders.module.css';
import logoImg from '../../images/logos.png'
import dayjs from "dayjs";


const Orders = () => {

    const [orderHistory, setOrderHistory] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [orderCnt, setOrderCnt] = useState(0);

    const getOrderHistoryInfo = async function getOrderHistory() {
        try {
            console.log("오더 리스트로 요청시작");
            const response = await axios.get("http://3.35.164.61:80/api/v1/store/orderHistory");
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
        console.log('setInterval실행')

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
                                <Link to="/orders" className={styles.sideBarMenuSelected}><p className={styles.sideBarMenuText}>전체 주문 내역</p></Link>
                                <Link to="/beforeAcceptOrders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>접수 대기</p></Link>
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
                                    <p className={styles.orderStatusText}>전체 주문 {orderCnt}</p>
                                </div>

                                {orderHistory?.map((orderInfo, index) =>{
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


