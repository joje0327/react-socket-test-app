let backendHost;

const hostname = window && window.location && window.location.hostname;

if (hostname === "localhost") {
    backendHost = "http://localhost:8080";
} else{

    backendHost = "http://ec2-3-34-205-246.ap-northeast-2.compute.amazonaws.com";
}


export const API_BASE_URL = `${backendHost}`;
