let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost") {
    backendHost = "http://localhost:8080";
} else{

    backendHost = "http://ec2-3-35-164-61.ap-northeast-2.compute.amazonaws.com";
}


export const API_BASE_URL = `${backendHost}`;
