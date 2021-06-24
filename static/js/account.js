//third-party login
let url = sessionStorage.getItem('url');
let auth = sessionStorage.getItem('auth');

let from = getQueryString('from');

if (from !== '') {
  if (from.indexOf("easyapi.com") > 0) {
    Cookies.set('from', from, {expires: 1});
  }
} else {
  from = Cookies.get("from") ? Cookies.get("from") : "";
}
from = from !== "" ? from : document.referrer;
from = from.indexOf("account.easyapi.com") >= 0 ? "https://www.easyapi.com" : from;
from = from.indexOf("easyapi.com") >= 0 ? from : "https://www.easyapi.com";
let domain = document.domain.indexOf("easyapi") >= 0 ? "easyapi.com" : document.domain;

/**
 * 获取URL参数值
 */
function getQueryString(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return '';
}
