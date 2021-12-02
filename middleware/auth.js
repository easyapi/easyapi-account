import Cookies from "js-cookie";

export default function ({store, redirect, route}) {
  // let url = sessionStorage.getItem('url');
  // let auth = sessionStorage.getItem('auth');
  let from = route.query.from;
  if (from !== undefined) {
    if (from.indexOf("easyapi.com") > 0) {
      Cookies.set("from", from);
    }
  } else {
    from = Cookies.get("from") ? Cookies.get("from") : "https://account.easyapi.com/login";
  }
  // from = from !== "" ? from : document.referrer;
  from = from.indexOf("account.easyapi.com") >= 0 ? "https://www.easyapi.com" : from;
  from = from.indexOf("easyapi.com") >= 0 ? from : "https://www.easyapi.com";
  Cookies.set("from", from);
  //todo 需要设置domain
  // console.log("document.domain", this.$route.path)
  // Cookies.set("domain", document.domain.indexOf("easyapi") >= 0 ? "easyapi.com" : document.domain);

}
