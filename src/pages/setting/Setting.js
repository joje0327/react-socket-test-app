import {Button, Form, Header, Input, Label} from "../styles";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from 'axios';
import {Link, Navigate, useHistory} from "react-router-dom";
import styles from './Setting.module.css';
import logoImg from '../../images/logos.png'
import closeBtn from '../../images/closeBtn.png'
import dayjs from "dayjs";
import {useNavigate} from "react-router";
import {Skeleton} from "@mui/material";



const Setting = () => {

    const [storeName, setStoreName] = useState();


    const getStoreInformation = async function getStore(storeId) {
        try {
            console.log("오더 리스트로 요청시작");
            const response = await axios.get(`http://localhost:8080/api/v1/store?storeId=${storeId}`);
            console.log("getStoreInformation:", response);
            console.log("setStoreName", response.data.data.storeName)
            setStoreName(response.data.data.storeName);

        } catch (error) {
            console.log(error);
        }}

    const navigate = useNavigate();
    // const history = useHistory();

    const [agreementModal, setAgreementModal] = useState(false);
    const [innerAcceptAgreementModal, setInnerAcceptAgreementModal] = useState(false);
    const [innerDeniedAgreementModal, setInnerDeniedAgreementModal] = useState(false);


    const [boardModal, setBoardModal] = useState(false);
    const [innerAcceptBoardModal, setInnerAcceptBoardModal] = useState(false);
    const [innerDeniedBoardModal, setInnerDeniedBoardModal] = useState(false);

    const [orderHistory, setOrderHistory] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [orderCnt, setOrderCnt] = useState(0);

    const [storeAvailable, setStoreAvailable] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [storeStatus, setStoreStatus] = useState(orderHistory.storeAvailable ? '영업중' : 'CLOSED');


    const getOrderHistoryInfo = async function getOrderHistory() {
        try {
            console.log("오더 리스트로 요청시작");
            const response = await axios.get("http://3.35.164.61:80/api/v1/store/paidorder2");
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

        getStoreInformation(localStorage.getItem("store_id"));

        return undefined;

    }, []);

    useEffect(()=> {
        const updating = setInterval(getOrderHistoryInfo, 2000);
        console.log('setTimeOut실행')

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
                                <Link to="/beforeAcceptOrders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>접수 대기</p></Link>
                                <Link to="/processingOrders" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>진행중</p></Link>
                                <Link to="/orderHistory" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>지난 주문내역</p></Link>
                                <Link to="/stockManage" className={styles.sideBarMenu}><p className={styles.sideBarMenuText}>품절 관리</p></Link>
                                <Link to="/settings" className={styles.sideBarMenuSelected}><p className={styles.sideBarMenuText}>설정</p></Link>
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
                                    <p className={styles.orderStatusText}>설정</p>
                                </div>

                                <div className={styles.settingBox}  onClick={()=>{
                                    setAgreementModal(prev => !prev);
                                    console.log('setAgreementModal', 'clicked')}}>
                                    <div>
                                        <p className={styles.settingBox_text}>이용 약관</p>
                                    </div>
                                </div>
                                <div className={styles.settingBox} onClick={()=>{
                                    setBoardModal(prev => !prev);
                                    console.log('setBoardModal', 'clicked')}}>
                                    <div>
                                        <p className={styles.settingBox_text}>공지사항</p>
                                    </div>
                                </div>
                                <div className={styles.settingBox}>
                                    <div>
                                        <p className={styles.settingBox_text}>로그아웃</p>
                                    </div>
                                </div>
                                <div className={styles.settingBox}>
                                    <div>
                                        <p className={styles.settingBox_text}>회원탈퇴</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {agreementModal && <div className={styles.outter_modal} onClick={(e)=>{
                        console.log('outter_modal clicked')
                        setAgreementModal(prev => !prev);

                    }}>

                        <div className={styles.inner_modal} onClick={(e)=>{
                            console.log('inner_modal clicked')}}>
                            <div className={styles.modal_box} onClick={(e)=>{
                                //위로 이벤트 전파 막기 위해 e.stopPropagation()사용 !!
                                e.stopPropagation();
                                console.log('modal_box clicked')}}>
                                <div className={styles.modal_box_header}>
                                    <div className={styles.modal_box_header_left}>
                                        <a className={styles.modal_box_header_left_text}>이용약관</a>
                                    </div>
                                    <a className={styles.modal_box_header_right} onClick={()=>setAgreementModal(prev => !prev)}>
                                        <img className={styles.modal_box_header_right_img} src={closeBtn}/>
                                    </a>
                                </div>
                                <div className={styles.modal_box_AgreementContentBox}>
                                    <div className={styles.modal_box_AgreementContentBox_content_selected}>
                                        <div>서비스</div>
                                        <div>이용약관</div>
                                    </div>
                                    <div className={styles.modal_box_AgreementContentBox_content}>
                                        <div>개인정보</div>
                                        <div>수집 및 이용동의</div>
                                    </div>
                                    <div className={styles.modal_box_AgreementContentBox_content}>
                                        <div>위치기반</div>
                                        <div>서비스 이용약관</div>
                                    </div>
                                    <div className={styles.modal_box_AgreementContentBox_content}>
                                        <div>전자금융거래</div>
                                        <div>이용약관</div>
                                    </div>
                                    <div className={styles.modal_box_AgreementContentBox_content}>
                                        <div>마케팅 메시지</div>
                                        <div>수신동의</div>
                                    </div>
                                    <div className={styles.modal_box_AgreementContentBox_content}>
                                        <div>약관명시</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    }


                    {boardModal && <div className={styles.outter_modal} onClick={(e)=>{
                        console.log('outter_modal clicked')
                        setBoardModal(prev => !prev);

                    }}>
                        <div className={styles.inner_modal} onClick={(e)=>{
                            console.log('inner_modal clicked')}}>
                            <div className={styles.modal_box} onClick={(e)=>{
                                //위로 이벤트 전파 막기 위해 e.stopPropagation()사용 !!
                                e.stopPropagation();
                                console.log('modal_box clicked')}}>
                                <div className={styles.modal_box_header}>
                                    <div className={styles.modal_box_header_left}>
                                        <a className={styles.modal_box_header_left_text}>공지사항</a>
                                    </div>
                                    <a className={styles.modal_box_header_right} onClick={()=>setBoardModal(prev => !prev)}>
                                        <img className={styles.modal_box_header_right_img} src={closeBtn}/>
                                    </a>
                                </div>
                                <div className={styles.modal_box_ContentBox}>
                                    <div className={styles.modal_box_ContentBox_title}>공지사항</div>
                                    <div className={styles.modal_box_ContentBox_contentBox}>
                                        <div className={styles.modal_box_ContentBox_contentBox_content}><p>차타고 베타버전 출시</p></div>
                                        <div className={styles.modal_box_ContentBox_contentBox_content}><p>고객 주문접수시 주의사항</p></div>
                                    </div>
                                </div>
                                <div className={styles.modal_box_ContentBox}>
                                    <div className={styles.modal_box_ContentBox_title}>자주 묻는 질문</div>
                                    <div className={styles.modal_box_ContentBox_contentBox}>
                                        <div className={styles.modal_box_ContentBox_contentBox_content}><p>Q1. 상품수령은 어떻게 하나요?</p></div>
                                        <div className={styles.modal_box_ContentBox_contentBox_content}><p>Q2. 사장님이 안나오시면 어떻게 하나요?</p></div>
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

export default Setting;


