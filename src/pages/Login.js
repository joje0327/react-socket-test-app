import {useCallback, useRef, useState} from "react";
import axios from 'axios';
import {Navigate} from "react-router-dom";
import {signin} from "../service/ApiService";
import {
    Link,
    Button,
    TextField,
    Grid,
    Container,
    Typography,
} from "@material-ui/core";


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


    return (
        <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography component="h1" variant="h5">
                        로그인
                    </Typography>
                </Grid>
            </Grid>
            <form noValidate onSubmit={loginSubmit}>
                {" "}
                {/* submit 버튼을 누르면 handleSubmit이 실행됨. */}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            id="email"
                            label="이메일 주소"
                            name="email"
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            variant="outlined"
                            required
                            fullWidth
                            name="password"
                            label="패스워드"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                        >
                            로그인
                        </Button>
                    </Grid>
                    <Link href="/signup" variant="body2">
                        <Grid item>계정이 없습니까? 여기서 가입 하세요.</Grid>
                    </Link>
                </Grid>
            </form>
        </Container>

    );

};

export default Login;
