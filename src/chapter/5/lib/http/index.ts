import XMLHttpRequest from "./XMLHttpRequest";

const userAgent = window.navigator.userAgent;

// v10 이하의 IE
const isIE = () => /MSIE/gi.test(userAgent);

const http = XMLHttpRequest;

export default http;
