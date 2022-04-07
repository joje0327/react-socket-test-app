import {Button, Form, Header, Input, Label} from "./styles";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from 'axios';
import {Navigate} from "react-router-dom";
import {call, signout} from "../service/ApiService";
import {API_BASE_URL} from "../app-config";

const ACCESS_TOKEN = "ACCESS_TOKEN";

const Home = () => {

    const [userId, setUserId] = useState(null);


    // useEffect(fetch(API_BASE_URL + "/api/v1/test101", {
    //     method: "GET",
    // })
    //     .then(console.log("성공"))
    //     .catch((error) => {
    //         // 추가된 부분
    //         console.log(error);
    //         console.log(error.status);
    //         if (error.status === 403) {
    //             window.location.href = "/login"; // redirect
    //         }
    //         return Promise.reject(error);
    //     }), []);


    // fetch(API_BASE_URL + "/api/v1/test101", {
    //     headers: new Headers({
    //         "Content-Type": "application/json",
    //         "Authorization" : "Bearer "+localStorage.getItem("ACCESS_TOKEN"),
    //     }),
    //     method: "GET",
    // })
    //     .then((response) => {
    //         console.log(response);
    //         console.log(localStorage.getItem("ACCESS_TOKEN"))
    //         setUserId(response.data)
    //         if (response.status === 403) {
    //             window.location.href = "/login"; // redirect
    //             console.log(response);
    //         }
    //     })
    //     .catch((error) => {
    //         // 추가된 부분
    //         console.log(error);
    //         console.log(error.status);
    //         if (error.status === 403) {
    //             // window.location.href = "/login"; // redirect
    //         }
    //         return Promise.reject(error);
    //     })


    // useEffect(call("/api/v1/store/1", "GET", null).then((response) => {
    //     setUserId(response.data);
    //     }
    // ), []);

    // var list = ""
    // async function init() {
    //     list = await call("/api/v1/store/1", "GET", null).then((response) => {
    //         setUserId(response.data)
    //         console.log(response.data)
    //     })
    // }



    call("/api/v1/store/1", "GET", null).then((response) => {
        // setUserId(response.data)
        setUserId(response.data[1].description);
        // list.map((a) => console.log(a.description))
        // console.log(list.map);
    })


    return (
        <>
            <br/>
            <br/>
            <div id="container">
                Home
            </div>
            <br/>
            <br/>

            <div>{userId}</div>
            <br/>
            <br/>
            <button onClick={signout}>로그아웃</button>
        </>


    );

};

export default Home;
