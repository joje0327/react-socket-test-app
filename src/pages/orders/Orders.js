import {Button, Form, Header, Input, Label} from "../styles";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from 'axios';
import {Navigate} from "react-router-dom";
import styles from './Orders.module.css';
import logoImg from '../../images/logos.png'
import dayjs from "dayjs";


const Orders = () => {

    const [orderHistory, setOrderHistory] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [orderCnt, setOrderCnt] = useState(0);

    const getOrderHistoryIngo = async function getOrderHistory() {
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
        getOrderHistoryIngo();

        return undefined;

    }, []);





    return (
        (isLoading) ?(<h1>로딩중</h1>):(
                <>
                    <header className={styles.header}>
                        <img src={logoImg} className={styles.headerLogo}/>
                    </header>
                    <div id="container" className={styles.container}>
                        <div className={styles.sideBar}>
                            <div className={styles.sideBarMenus}>
                                <a className={styles.sideBarMenuSelected}><p className={styles.sideBarMenuText}>접수 대기</p></a>
                                <a className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>진행중</p></a>
                                <a className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>지난 주문내역</p></a>
                                <a className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>품절 관리</p></a>
                                <a className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>설정</p></a>
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
                                    <p className={styles.orderStatusText}>접수 대기 6</p>
                                </div>

                                {orderHistory?.map((orderInfo, index) =>{
                                    return (
                                        <div className={styles.orderBox} key={index}>
                                            <p className={styles.shopName}>{orderInfo.storeName}</p>
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


