import axios from "axios";

//create an instance of axios that automatically sends the csurf header with every http request

var instance = axios.create({
    xsrfCookieName: "mytoken",
    xsrfHeaderName: "csrf-token"
});

export default instance;
