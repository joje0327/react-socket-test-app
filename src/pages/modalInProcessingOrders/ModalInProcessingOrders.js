import styles from "../modalInProcessingOrders/ModalInProcessingOrders.module.css";
import closeBtn from "../../images/closeBtn.png";
import dayjs from "dayjs";
import axios from "axios";
import Text1 from "../../images/1.png";
import Text2 from "../../images/2.png";
import Text3 from "../../images/3.png";


const ModalInProcessingOrders = ({ modal, setModal, modalData, setModalData, navigate}) => {


    console.log('modalData',modalData);

    const acceptActivated = (modalData.orderStatus == "ACCEPT") ? styles.activated:"";
    const readyActivated = (modalData.orderStatus == 'READY') ? styles.activated:"";
    const pickupActivated = (modalData.orderStatus == 'PICKUP') ? styles.activated:"";




    return (

        <div className={styles.outter_modal} onClick={(e)=>{
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
                                            <p className={styles.modal_box_left_content_1_orderbox_ordernumtext}>#{modalData.orderId}</p>
                                        </div>
                                        <div>
                                            <p className={styles.modal_box_left_content_1_orderbox_ordertime}>{dayjs(new Date()).format("h:mm A")}</p>
                                        </div>

                                    </div>
                                    <div className={styles.modal_box_left_content_1_line2}>
                                        <div className={styles.modal_box_left_content_1_orderstatus}>
                                            <p className={styles.modal_box_left_content_1_orderstatus_menu}>메뉴{modalData.orderDetailList.length}개</p>
                                            <p className={styles.modal_box_left_content_1_orderstatus_price}>{modalData.finalAmount.toLocaleString()}원</p>
                                            <p className={styles.modal_box_left_content_1_orderstatus_status}>{modalData.orderStatus}</p>
                                        </div>
                                    </div>


                                </div>


                                <div className={styles.modal_box_left_content_2}>
                                    {modalData.orderDetailList.map((orderDetailInfo, index)=>{return (
                                        <div className={styles.modal_box_left_content_2_menuList}>
                                            <p className={styles.modal_box_left_content_2_menuList_title}>{orderDetailInfo.itemName}</p>
                                            <p className={styles.modal_box_left_content_2_menuList_cnt}>{orderDetailInfo.quantity}</p>
                                            <p className={styles.modal_box_left_content_2_menuList_price}>{orderDetailInfo.amount.toLocaleString()}원</p>
                                        </div>)
                                    })}
                                </div>




                                <div className={styles.modal_box_left_content_3}>
                                    <div className={styles.modal_box_left_content_3_ordersummary}>
                                        <p className={styles.modal_box_left_content_3_ordersummary_total}>총합계</p>
                                        <p className={styles.modal_box_left_content_3_ordersummary_totalcnt}>{modalData.orderDetailList.length}</p>
                                        <p className={styles.modal_box_left_content_3_ordersummary_totalprice}>{modalData.finalAmount.toLocaleString()}원</p>
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
                                        <p>{dayjs(modalData.arrivingTime).format("h:mm A")} (30분 후)</p>
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
                                            {/*<p>{modalData.carNumber}로그인후</p>*/}
                                            {/*<p>{modalData.carCharacter}로그인후</p>*/}
                                            {/*<p>{modalData.phoneNumber}로그인후</p>*/}
                                            <p>개발필요</p>
                                            <p>개발필요</p>
                                            <p>개발필요</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.modal_box_right_content_3}>
                                    <div className={styles.modal_box_right_content_3_btn}>


                                        <div  className={`${styles.modal_box_right_content_3_btn_accepted} ${acceptActivated}`}
                                              onClick={(e)=>{
                                                  console.log('접수완료 clicked');
                                                  e.stopPropagation();
                                              }}>
                                            <img src={Text1} className={styles.modal_box_right_content_3_btn_accepted_Text1}></img>
                                            <p  className={styles.modal_box_right_content_3_btn_accepted_Text2}>접수완료</p>
                                        </div>

                                        <div  className={`${styles.modal_box_right_content_3_btn_ready} ${readyActivated}`}
                                              onClick={(e)=>{
                                                  console.log('준비완료 clicked')
                                                  async function getREADY() {
                                                      try {
                                                          console.log(" 상태변경 요청시작");
                                                          const params = new URLSearchParams();
                                                          params.append('orderStatus', 'READY');
                                                          params.append('orderId', modalData.orderId);
                                                          // const response = await axios.post("http://localhost:8080/api/v1/store/orderstate2", params);
                                                          const response = await axios.post("http://ec2-3-35-164-61.ap-northeast-2.compute.amazonaws.com/api/v1/store/orderstate2", params);
                                                          console.log('reponse: ', response);
                                                          if (response.data.code === "확인요망") {
                                                              setModal(prev => !prev)
                                                              alert('주문상태 확인바랍니다');
                                                              return null;
                                                          }
                                                          setModalData({...modalData,orderStatus:'READY'})
                                                      } catch (error) {
                                                          console.log(error);
                                                          setModal(prev => !prev)
                                                          alert('네트워크 이상이 발생했습니다 관리자에게 문의바랍니다', error);
                                                      }
                                                  };
                                                  getREADY();
                                                  console.log('수락 서버전송')
                                                  console.log('진행중 화면이동')


                                                  e.stopPropagation();
                                              }}>
                                            <img src={Text2} className={styles.modal_box_right_content_3_btn_accepted_Text1}></img>
                                            <p  className={styles.modal_box_right_content_3_btn_accepted_Text2}>준비완료</p>
                                        </div>

                                        <div  className={`${styles.modal_box_right_content_3_pickedup} ${pickupActivated}`} onClick={(e)=>{
                                            console.log('전달완료 clicked')

                                            async function getPICKUP() {
                                                try {
                                                    console.log(" 상태변경 요청시작");
                                                    const params = new URLSearchParams();
                                                    params.append('orderStatus', 'PICKUP');
                                                    params.append('orderId', modalData.orderId);
                                                    const response = await axios.post("http://ec2-3-35-164-61.ap-northeast-2.compute.amazonaws.com/api/v1/store/orderstate2", params);
                                                    // const response = await axios.post("http://localhost:8080/api/v1/store/orderstate2", params);
                                                    console.log('reponse: ', response);
                                                    if (response.data.code === "확인요망") {
                                                        setModal(prev => !prev)
                                                        alert('주문상태 확인바랍니다');
                                                        return null;
                                                    }
                                                    setModalData({...modalData,orderStatus:'PICKUP'})
                                                    navigate('/orderHistory')
                                                } catch (error) {
                                                    console.log(error);
                                                    setModal(prev => !prev)
                                                    alert('네트워크 이상이 발생했습니다 관리자에게 문의바랍니다', error);
                                                }
                                            };
                                            getPICKUP();
                                            console.log('수락 서버전송')
                                            console.log('진행중 화면이동')

                                            e.stopPropagation();


                                        }}>
                                            <img src={Text3} className={styles.modal_box_right_content_3_btn_accepted_Text1}></img>
                                            <p  className={styles.modal_box_right_content_3_btn_accepted_Text2}>전달완료</p>
                                        </div>
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

        </div>

    );
}

export default ModalInProcessingOrders;
