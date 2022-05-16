import {Button, Form, Header, Input, Label} from "../styles";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from 'axios';
import {Link, Navigate} from "react-router-dom";
import styles from './ProductInfo.module.css'
import logoImg from '../../images/logos.png'
import dayjs from "dayjs";
import {useNavigate} from "react-router";
import closeBtn from "../../images/closeBtn.png";
import menuImg from "../../images/menuImg.png"
import textSound from '../../sound/mixkit-retro-game-notification-212.wav'
import {ca} from "wait-on/exampleConfig";



const ProductInfo = ({stocksInfo, getStockInfo, setStocksInfo}) => {
    // console.log('stocksInfo in ProductInfo : ', stocksInfo);

    const [orderAvailable, setOrderAvailable] = useState(stocksInfo.orderAvailable);
    const [disabled, setDisabled] = useState(false);


    const [stockStatus, setStockStatus] = useState(stocksInfo.orderAvailable ? '판매중' : '품절');
    console.log('stockStatus',stockStatus);


    return (

        <div className={styles.pickupMenuBox}>
            <img src={menuImg} className={styles.pickupMenuBox_image}></img>
            <div className={styles.pickupMenuBox_menu}>
                <div className={styles.pickupMenuBox_menu_title}>
                    {stocksInfo.productName}
                </div>
                <div className={styles.pickupMenuBox_menu_price}>
                    {stocksInfo.productPrice.toLocaleString()}원
                </div>
            </div>
            <div className={styles.pickupMenuBox_statusbox}>

                <div className={styles.pickupMenuBox_statusbox_slider}>
                    <label className={styles.switch}>
                        <input type={"checkbox"} checked={orderAvailable}
                               onClick={() => {

                                   const aaa = async function bbb(){
                                       try{

                                           console.log("재고상태 변경 요청시작");
                                           setDisabled(true);
                                           setStockStatus(!orderAvailable ? '판매중' : '품절')
                                           await setOrderAvailable(prev => !prev);
                                           // await setStockStatus(prev => !prev);
                                           const params = new URLSearchParams();
                                           params.append('productId', stocksInfo.productId);
                                           params.append('productStatus', !orderAvailable);
                                           // const response =await axios.post("http://localhost:8080/api/v1/store/productstate2", params)
                                           const response =await axios.post("http://ec2-3-35-164-61.ap-northeast-2.compute.amazonaws.com/api/v1/store/productstate2", params)

                                           console.log('reponse: ', response);
                                           if (response.data.code === "확인요망") {
                                               alert('재고상태를 확인바랍니다');
                                               return null;
                                           }
                                           setDisabled(false);

                                           let stockInfo = await getStockInfo();
                                           setStocksInfo(stockInfo);
                                           console.log('setOrderAvailable 실행 : ');
                                           // await setOrderAvailable(prev => !prev);
                                           console.log('상태변경후 서버에서 넘어온값 : ',stockInfo);
                                           // await setOrderAvailable(stockInfo.orderAvailable);
                                           console.log('orderAvailable', orderAvailable);
                                           // console.log('stockInfo.orderAvailable', stockInfo.orderAvailable);


                                       }
                                       catch (err){
                                           console.log(err);
                                       }
                                   }

                                   aaa();

                               }}/>
                        {/*{console.log('orderAvailable', stocksInfo.orderAvailable)}*/}
                        <span className={`${styles.slider} ${styles.round}`}></span>
                        {/*className={`${styles.description} ${styles.yellow}`}*/}
                    </label>

                </div>
                <p className={styles.pickupMenuBox_statusbox_text}>{stockStatus}</p>
            </div>
        </div>

    );


};

export default ProductInfo;
