import styles from "../beforeAcceptOrders/BeforeAcceptOrders.module.css";
import closeBtn from "../../images/closeBtn.png";
import dayjs from "dayjs";
import axios from "axios";

const ModalInBeforeAcceptOrders = ({ modal, setModal, setInnerAcceptModal, setInnerDeniedModal, modalData, setModalData, navigate, innerAcceptModal, innerDeniedModal}) => {
    console.log(modal)
    console.log(modalData)
    console.log(innerAcceptModal)
    console.log(innerDeniedModal)



    return (
        <div className={styles.outter_modal} onClick={(e)=>{
            console.log('outter_modal clicked');
            // orderInfoGlobal = {};
            setModal(prev => !prev);
            setModalData({});

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
                        <a className={styles.modal_box_header_right} onClick={()=>{
                            setModal(prev => !prev);
                            setModalData({});
                        }}>
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
                                            {console.log('modal in modal', modal)}
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
                                            <p>{modalData.carNumber}개발예정</p>
                                            <p>{modalData.carCharacter}개발예정</p>
                                            <p>{modalData.phoneNumber}개발예정</p>
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
                                  async function getAccept() {
                                      try {
                                          console.log(" 상태변경 요청시작");
                                          const params = new URLSearchParams();
                                          params.append('orderStatus', 'ACCEPT');
                                          params.append('orderId', modalData.orderId);
                                          // const response = await axios.post("http://localhost:8080/api/v1/store/orderstate2", params);
                                          const response = await axios.post("http://ec2-3-35-164-61.ap-northeast-2.compute.amazonaws.com/api/v1/store/orderstate2", params);
                                          console.log('reponse: ', response);
                                          if (response.data.code == "확인요망") {
                                              setModal(prev => !prev)
                                              setInnerAcceptModal(prev => !prev);
                                              alert('주문상태 확인바랍니다');
                                              return null;
                                          }
                                          navigate('/processingOrders');

                                      } catch (error) {
                                          console.log(error);
                                          setModal(prev => !prev)
                                          setInnerAcceptModal(prev => !prev);
                                          alert('네트워크 이상이 발생했습니다 관리자에게 문의바랍니다', error);
                                      }
                                  };
                                  getAccept();
                                  console.log('수락 서버전송')
                                  console.log('진행중 화면이동')
                                  // navigate('/processingOrders')
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
                                  async function getDenied() {
                                      try {
                                          console.log("거절 상태변경 요청시작");
                                          const params = new URLSearchParams();
                                          params.append('orderStatus', 'DENIED');
                                          params.append('orderId', modalData.orderId);
                                          const response = await axios.post("http://ec2-3-35-164-61.ap-northeast-2.compute.amazonaws.com/api/v1/store/orderstate2", params);
                                          // const response = await axios.post("http://localhost:8080/api/v1/store/orderstate2", params);
                                          console.log('reponse: ', response);
                                          if (response.data.code == "확인요망") {
                                              setModal(prev => !prev)
                                              setInnerAcceptModal(prev => !prev);
                                              alert('주문상태 확인바랍니다');
                                              return null;
                                          }
                                          window.location.reload();

                                      } catch (error) {
                                          console.log(error);
                                          setModal(prev => !prev)
                                          setInnerDeniedModal(prev => !prev);
                                          alert('네트워크 이상이 발생했습니다 관리자에게 문의바랍니다', error);
                                      }
                                  };
                                  getDenied();
                                  console.log('거절 서버전송완료')
                                  console.log('접수중 화면 이동')

                                  // window.location.reload();
                                  // location.reload();
                              }
                              }

                        ><p>거절</p></div>
                    </div>
                </div>
            </div>
            }

        </div>
    );

};


export default ModalInBeforeAcceptOrders;
