import {useCallback, useEffect, useRef, useState} from "react";
import axios from 'axios';
import {Navigate} from "react-router-dom";
import {signin} from "../../service/ApiService";
import styles from "./Login.module.css"
import backImg from '../../images/backImg.png'
import {
    Link,
    Button,
    TextField,
    Grid,
    Container,
    Typography,
} from "@material-ui/core";
import logoImg from "../../images/logos.png";
const ACCESS_TOKEN = "ACCESS_TOKEN";


const Login = () => {

    // const [userData, setUserData] = useState(null);
    // const [login, setLogIn] = useState(false);
    // const idInput = useRef<HTMLInputElement>(null);
    // const passwordInput = useRef<HTMLInputElement>(null);


    // const onSubmit = useCallback(
    //     (e) => {
    //         e.preventDefault();
    //
    //         console.log('test');
    //         setLogIn(!login);
    //         console.log(login);
    //         // console.log(idInput.current?.value);
    //         // console.log(passwordInput.current?.value);
    //
    //         axios.get('http://localhost:8080/api/v1/user',
    //             {params : {provider: 'kakao', provider_id: passwordInput.current?.value}},
    //         )
    //             .then((response) => {
    //                 console.log("aaaaa",response.data.data);
    //                 if (!response.data.data.isEmpty) {
    //                     setUserData(response.data.data);
    //                     console.log(response.data.data);
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.log(error);
    //                 console.log('error')
    //             })
    //
    //     },
    //     [login],
    // );

    // if (userData) {
    //     console.log(userData);
    //     return <Navigate replace to={"/paidorder/?storeId=1"} />;
    // }


    // const loginSubmit = useCallback((e) => {
    //     console.log('clicked');
    //     e.preventDefault();
    //     const data = new FormData(e.target);
    //     const email = data.get("email");
    //     const password = data.get("password");
    //     // ApiService의 signin 메서드를 사용 해 로그인.
    //     signin({email: email, password: password});
    //
    // }, []);



    const loginSubmit = (e) => {
        console.log('clicked');
        e.preventDefault();
        const data = new FormData(e.target);
        const email = data.get("email");
        const password = data.get("password");
        // ApiService의 signin 메서드를 사용'해 로그인.
        signin({email: email, password: password});
    };

    useEffect(()=>{
        const checkLogged = localStorage.getItem("store_id")
        if (!checkLogged == null || !checkLogged == "") {
            window.location.href = "/"; // redirect
        }
    },[])

    // const getStoreInformation = async function getStore(storeId) {
    //     try {
    //         console.log("오더 리스트로 요청시작");
    //         const response = await axios.get(`http://localhost:8080/api/v1/store?storeId=${storeId}`);
    //         console.log("getStoreInformation:", response);
    //         console.log("setStoreName", response.data.data.storeName)
    //         setStoreName(response.data.data.storeName);
    //
    //     } catch (error) {
    //         console.log(error);
    //     }}

    // const [userData, setUserData] = useState(null);
    // const [login, setLogIn] = useState(false);
    // const idInput = useRef<HTMLInputElement>(null);
    // const passwordInput = useRef<HTMLInputElement>(null);




    return (
        <>
            <div className={styles.container}>
                <div className={styles.leftContent}>
                    <div className={styles.loginBox}>
                        <div  className={styles.loginBox_textTile}>Login</div>
                        <p  className={styles.loginBox_textContent}>차타고 주문접수를 사용하기 위해 로그인을 해주세요</p>
                        <form className={styles.loginBox_textContent_form} noValidate onSubmit={(e)=>{
                            e.preventDefault();
                            const data = new FormData(e.target);
                            const id = data.get("id");
                            const password = data.get("password");
                            console.log("e:",e)
                            console.log("email:",id)
                            console.log("password:",password)
                            const sendata = {storeUserId:id, storePassword:password}
                            console.log("sendata", sendata);
                            JSON.stringify(sendata);
                            const form = new FormData();
                            form.append("storeUserId", id)
                            form.append("storePassword", password)
                            async function login() {
                                try {
                                    console.log("오더 리스트로 요청시작");
                                    const response = await axios.post("http://localhost:8080/api/v1/store/login",
                                        form,
                                        {
                                            headers: { "Content-Type": `application/x-www-form-urlencoded` },
                                        },
                                        );
                                    console.log(response)

                                    // const sortedResponse = [...response.data.data].sort(
                                    //     (a, b) => {
                                    //         a = new Date(a.arrivingTime);
                                    //         b = new Date(b.arrivingTime);
                                    //         return a > b ? -1 : a < b ? 1 : 0;
                                    //     }
                                    // );
                                    // setOrderHistory(sortedResponse);
                                    console.log("api호출");
                                    // setOrderCnt(sortedResponse.length);
                                    // setIsLoading(false);
                                    // window.location.href = "/"; // redirect
                                    console.log(response.data.code);


                                    if (response.data.code == "확인요망") {
                                        // console.log(error);
                                        alert("로그인이 정상 진행되지 않았습니다. 다시 해주세요")
                                        window.location.href = "/login"; // redirect
                                        return null;
                                    }

                                    console.log("store_id", response.data.data.storeId);

                                    // await getStoreInformation(response.data.data.storeId);
                                    //
                                    // console.log("storeName", storeName);



                                    localStorage.setItem("store_id", response.data.data.storeId)

                                    window.location.href = "/"; // redirect

                                    // if(response.data.code)


                                } catch (error) {
                                    console.log(error);
                                    alert("로그인이 정상 진행되지 않았습니다. 다시 해주세요")
                                    window.location.href = "/login"; // redirect
                                }
                        }
                            login()
                        }
                        }
                        >
                            <TextField
                                className={styles.loginBox_textField}
                                variant="outlined"
                                required
                                id="id"
                                fullWidth
                                label="아이디"
                                name="id"
                                autoComplete="id"/>

                            <TextField
                                className={styles.loginBox_textField}
                                variant="outlined"
                                required
                                id="password"
                                fullWidth
                                type="password"
                                label="비밀번호"
                                name="password"
                                autoComplete="password"/>

                            <Button
                                className={styles.loginBox_button}
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                로그인
                            </Button>


                        </form>

                    </div>

                </div>
                <div className={styles.rightContent}>
                    <img src={backImg} className={styles.rightContent_backImg}/>
                    <div className={styles.rightContent_textBox}>
                        <div className={styles.rightContent_textBox_title}><p>차타고 주문접수 프로그램</p></div>
                        <p className={styles.rightContent_textBox_content}>차타고 주문접수를 통해 온라인 주문을 관리하고 고객이 도착하는 시간을</p>
                        <p className={styles.rightContent_textBox_content}>정확히 안내받을 수 있습니다. 차별화된 서비스 도입으로 매출을 느려보세요!</p>

                    </div>

                </div>

            </div>

        </>

        // <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
        //     <Grid container spacing={2}>
        //         <Grid item xs={12}>
        //             <Typography component="h1" variant="h5">
        //                 로그인
        //             </Typography>
        //         </Grid>
        //     </Grid>
        //     <form noValidate onSubmit={loginSubmit}>
        //         {" "}
        //         {/* submit 버튼을 누르면 handleSubmit이 실행됨. */}
        //         <Grid container spacing={2}>
        //             <Grid item xs={12}>
        //                 <TextField
        //                     variant="outlined"
        //                     required
        //                     fullWidth
        //                     id="email"
        //                     label="이메일 주소"
        //                     name="email"
        //                     autoComplete="email"
        //                 />
        //             </Grid>
        //             <Grid item xs={12}>
        //                 <TextField
        //                     variant="outlined"
        //                     required
        //                     fullWidth
        //                     name="password"
        //                     label="패스워드"
        //                     type="password"
        //                     id="password"
        //                     autoComplete="current-password"
        //                 />
        //             </Grid>
        //             <Grid item xs={12}>
        //                 <Button
        //                     type="submit"
        //                     fullWidth
        //                     variant="contained"
        //                     color="primary"
        //                 >
        //                     로그인
        //                 </Button>
        //             </Grid>
        //             <Link href="/signup" variant="body2">
        //                 <Grid item>계정이 없습니까? 여기서 가입 하세요.</Grid>
        //             </Link>
        //         </Grid>
        //     </form>
        // </Container>

    );

};

export default Login;
