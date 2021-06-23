//third-party login
let url = sessionStorage.getItem('url');
let auth = sessionStorage.getItem('auth');
let from = GetQueryString('from') ? GetQueryString('from') : '';

if (from != null && from !== '') {
  if (from.indexOf("easyapi.com") > 0) {
    Cookies.set('from', from, {expires: 1});
  }
} else {
  from = Cookies.get("from") ? Cookies.get("from") : "";
}
if (typeof (from) === "undefined") {
  from = '';
}
from = from !== "" ? from : document.referrer;
from = from.indexOf("account.easyapi.com") >= 0 ? "https://www.easyapi.com" : from;
from = from.indexOf("easyapi.com") >= 0 ? from : "https://www.easyapi.com";
let domain = document.domain.indexOf("easyapi") >= 0 ? "easyapi.com" : document.domain;

function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}
