/*! tracker_node 30-12-2014 */
function firePixel(){var a=new Image(1,1);if(a.src="//googleads.g.doubleclick.net/pagead/viewthroughconversion/968411418/?value=0&amp;guid=ON&amp;script=0",window.location.href.indexOf("opensky.com")>-1&&window.location.href.indexOf("/checkout/thanks")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6014810155557&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("opensky.com")>-1&&window.location.href.indexOf("/checkout")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6015083716957&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("opensky.com")>-1&&window.location.href.indexOf("/product")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6015083703957&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("udemy.com")>-1&&window.location.href.indexOf("/payment/checkout")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6013930556336&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("udemy.com")>-1&&window.location.href.indexOf("/payment/success")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6013930557336&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("udemy.com")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6013930540736&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("clarity.fm")>-1&&window.location.href.indexOf("/payment")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6013699328429&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("clarity.fm")>-1&&window.location.href.indexOf("/precall")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6013699325629&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("clarity.fm")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6013296226029&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("ticketleap.com")>-1&&window.location.href.indexOf("/review-order")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6016830030141&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("ticketleap.com")>-1&&window.location.href.indexOf("/checkout")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6016830025141&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("ticketleap.com")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6016830006941&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("backerkit.com")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6020643936940&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("fiverr.com")>-1&&window.location.href.indexOf("/orders/")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6021767043400&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("fiverr.com")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6021767055800&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("storenvy.com")>-1&&window.location.href.indexOf("/cart")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6019582419100&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("storenvy.com")>-1&&window.location.href.indexOf("/checkout/success")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6019582411500&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}if(window.location.href.indexOf("storenvy.com")>-1){var b=new Image(1,1);b.src="https://www.facebook.com/tr?ev=6019582423700&amp;cd[value]=0&amp;cd[currency]=USD&amp;noscript=1"}}function hasChanged(){_boost.push(["setDocumentTitle",document.title]),_boost.push(["setCustomUrl",window.location.href]),_boost.push(["setReferrerUrl",current_url]),_boost.push(["trackPageView"]),firePixel()}if("object"!=typeof JSON2&&(JSON2={}),function(){"use strict";function f(a){return 10>a?"0"+a:a}function objectToJSON(a,b){var c=Object.prototype.toString.apply(a);return"[object Date]"===c?isFinite(a.valueOf())?a.getUTCFullYear()+"-"+f(a.getUTCMonth()+1)+"-"+f(a.getUTCDate())+"T"+f(a.getUTCHours())+":"+f(a.getUTCMinutes())+":"+f(a.getUTCSeconds())+"Z":null:"[object String]"===c||"[object Number]"===c||"[object Boolean]"===c?a.valueOf():"[object Array]"!==c&&"function"==typeof a.toJSON?a.toJSON(b):a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return"string"==typeof b?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g,h=gap,i=b[a];switch(i&&"object"==typeof i&&(i=objectToJSON(i,a)),"function"==typeof rep&&(i=rep.call(b,a,i)),typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";if(gap+=indent,g=[],"[object Array]"===Object.prototype.toString.apply(i)){for(f=i.length,c=0;f>c;c+=1)g[c]=str(c,i)||"null";return e=0===g.length?"[]":gap?"[\n"+gap+g.join(",\n"+gap)+"\n"+h+"]":"["+g.join(",")+"]",gap=h,e}if(rep&&"object"==typeof rep)for(f=rep.length,c=0;f>c;c+=1)"string"==typeof rep[c]&&(d=rep[c],e=str(d,i),e&&g.push(quote(d)+(gap?": ":":")+e));else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&g.push(quote(d)+(gap?": ":":")+e));return e=0===g.length?"{}":gap?"{\n"+gap+g.join(",\n"+gap)+"\n"+h+"}":"{"+g.join(",")+"}",gap=h,e}}var cx=new RegExp("[\x00­؀-؄܏឴឵‌-‏\u2028- ⁠-⁯﻿￰-￿]","g"),pattern='\\\\\\"\x00--­؀-؄܏឴឵‌-‏\u2028- ⁠-⁯﻿￰-￿]',escapable=new RegExp("["+pattern,"g"),gap,indent,meta={"\b":"\\b","	":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;"function"!=typeof JSON2.stringify&&(JSON2.stringify=function(a,b,c){var d;if(gap="",indent="","number"==typeof c)for(d=0;c>d;d+=1)indent+=" ";else"string"==typeof c&&(indent=c);if(rep=b,b&&"function"!=typeof b&&("object"!=typeof b||"number"!=typeof b.length))throw new Error("JSON2.stringify");return str("",{"":a})}),"function"!=typeof JSON2.parse&&(JSON2.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&"object"==typeof e)for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),void 0!==d?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;if(text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})),new RegExp("^[\\],:{}\\s]*$").test(text.replace(new RegExp('\\\\(?:["\\\\/bfnrt]|u[0-9a-fA-F]{4})',"g"),"@").replace(new RegExp('"[^"\\\\\n\r]*"|true|false|null|-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?',"g"),"]").replace(new RegExp("(?:^|:|,)(?:\\s*\\[)+","g"),"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON2.parse")})}(),window.location.href.indexOf("clarity.fm")>-1){var _boost=_boost||[];_boost.push(["trackPageView"])}"object"!=typeof _boost&&(_boost=[]),"object"!=typeof Piwik&&(Piwik=function(){"use strict";function isDefined(a){var b=typeof a;return"undefined"!==b}function isFunction(a){return"function"==typeof a}function isObject(a){return"object"==typeof a}function isString(a){return"string"==typeof a||a instanceof String}function apply(){var a,b,c;for(a=0;a<arguments.length;a+=1)c=arguments[a],b=c.shift(),isString(b)?asyncTracker[b].apply(asyncTracker,c):b.apply(asyncTracker,c)}function addEventListener(a,b,c,d){return a.addEventListener?(a.addEventListener(b,c,d),!0):a.attachEvent?a.attachEvent("on"+b,c):void(a["on"+b]=c)}function executePluginMethod(a,b){var c,d,e="";for(c in plugins)Object.prototype.hasOwnProperty.call(plugins,c)&&(d=plugins[c][a],isFunction(d)&&(e+=d(b)));return e}function beforeUnloadHandler(){var a;if(executePluginMethod("unload"),expireDateTime)do a=new Date;while(a.getTimeAlias()<expireDateTime)}function loadHandler(){var a;if(!hasLoaded)for(hasLoaded=!0,executePluginMethod("load"),a=0;a<registeredOnLoadHandlers.length;a++)registeredOnLoadHandlers[a]();return!0}function addReadyListener(){var a;documentAlias.addEventListener?addEventListener(documentAlias,"DOMContentLoaded",function b(){documentAlias.removeEventListener("DOMContentLoaded",b,!1),loadHandler()}):documentAlias.attachEvent&&(documentAlias.attachEvent("onreadystatechange",function c(){"complete"===documentAlias.readyState&&(documentAlias.detachEvent("onreadystatechange",c),loadHandler())}),documentAlias.documentElement.doScroll&&windowAlias===windowAlias.top&&!function d(){if(!hasLoaded){try{documentAlias.documentElement.doScroll("left")}catch(a){return void setTimeout(d,0)}loadHandler()}}()),new RegExp("WebKit").test(navigatorAlias.userAgent)&&(a=setInterval(function(){(hasLoaded||/loaded|complete/.test(documentAlias.readyState))&&(clearInterval(a),loadHandler())},10)),addEventListener(windowAlias,"load",loadHandler,!1)}function loadScript(a,b){var c=documentAlias.createElement("script");c.type="text/javascript",c.src=a,c.readyState?c.onreadystatechange=function(){var a=this.readyState;("loaded"===a||"complete"===a)&&(c.onreadystatechange=null,b())}:c.onload=b,documentAlias.getElementsByTagName("head")[0].appendChild(c)}function getReferrer(){var a="";try{a=windowAlias.top.document.referrer}catch(b){if(windowAlias.parent)try{a=windowAlias.parent.document.referrer}catch(c){a=""}}return""===a&&(a=documentAlias.referrer),a}function getProtocolScheme(a){var b=new RegExp("^([a-z]+):"),c=b.exec(a);return c?c[1]:null}function getHostName(a){var b=new RegExp("^(?:(?:https?|ftp):)/*(?:[^@]+@)?([^:/#]+)"),c=b.exec(a);return c?c[1]:a}function getParameter(a,b){var c="[\\?&#]"+b+"=([^&#]*)",d=new RegExp(c),e=d.exec(a);return e?decodeWrapper(e[1]):""}function utf8_encode(a){return urldecode(encodeWrapper(a))}function sha1(a){var b,c,d,e,f,g,h,i,j,k,l=function(a,b){return a<<b|a>>>32-b},m=function(a){var b,c,d="";for(b=7;b>=0;b--)c=a>>>4*b&15,d+=c.toString(16);return d},n=[],o=1732584193,p=4023233417,q=2562383102,r=271733878,s=3285377520,t=[];for(a=utf8_encode(a),k=a.length,c=0;k-3>c;c+=4)d=a.charCodeAt(c)<<24|a.charCodeAt(c+1)<<16|a.charCodeAt(c+2)<<8|a.charCodeAt(c+3),t.push(d);switch(3&k){case 0:c=2147483648;break;case 1:c=a.charCodeAt(k-1)<<24|8388608;break;case 2:c=a.charCodeAt(k-2)<<24|a.charCodeAt(k-1)<<16|32768;break;case 3:c=a.charCodeAt(k-3)<<24|a.charCodeAt(k-2)<<16|a.charCodeAt(k-1)<<8|128}for(t.push(c);14!==(15&t.length);)t.push(0);for(t.push(k>>>29),t.push(k<<3&4294967295),b=0;b<t.length;b+=16){for(c=0;16>c;c++)n[c]=t[b+c];for(c=16;79>=c;c++)n[c]=l(n[c-3]^n[c-8]^n[c-14]^n[c-16],1);for(e=o,f=p,g=q,h=r,i=s,c=0;19>=c;c++)j=l(e,5)+(f&g|~f&h)+i+n[c]+1518500249&4294967295,i=h,h=g,g=l(f,30),f=e,e=j;for(c=20;39>=c;c++)j=l(e,5)+(f^g^h)+i+n[c]+1859775393&4294967295,i=h,h=g,g=l(f,30),f=e,e=j;for(c=40;59>=c;c++)j=l(e,5)+(f&g|f&h|g&h)+i+n[c]+2400959708&4294967295,i=h,h=g,g=l(f,30),f=e,e=j;for(c=60;79>=c;c++)j=l(e,5)+(f^g^h)+i+n[c]+3395469782&4294967295,i=h,h=g,g=l(f,30),f=e,e=j;o=o+e&4294967295,p=p+f&4294967295,q=q+g&4294967295,r=r+h&4294967295,s=s+i&4294967295}return j=m(o)+m(p)+m(q)+m(r)+m(s),j.toLowerCase()}function urlFixup(a,b,c){return"translate.googleusercontent.com"===a?(""===c&&(c=b),b=getParameter(b,"u"),a=getHostName(b)):("cc.bingj.com"===a||"webcache.googleusercontent.com"===a||"74.6."===a.slice(0,5))&&(b=documentAlias.links[0].href,a=getHostName(b)),[a,b,c]}function domainFixup(a){var b=a.length;return"."===a.charAt(--b)&&(a=a.slice(0,b)),"*."===a.slice(0,2)&&(a=a.slice(1)),a}function titleFixup(a){if(a=a&&a.text?a.text:a,!isString(a)){var b=documentAlias.getElementsByTagName("title");b&&isDefined(b[0])&&(a=b[0].text)}return a}function getPiwikUrlForOverlay(a,b){return b?b:("piwik.php"===a.slice(-9)&&(a=a.slice(0,a.length-9)),a)}function isOverlaySession(a){var b="Piwik_Overlay",c=new RegExp("index\\.php\\?module=Overlay&action=startOverlaySession&idsite=([0-9]+)&period=([^&]+)&date=([^&]+)$"),d=c.exec(documentAlias.referrer);if(d){var e=d[1];if(e!==String(a))return!1;var f=d[2],g=d[3];windowAlias.name=b+"###"+f+"###"+g}var h=windowAlias.name.split("###");return 3===h.length&&h[0]===b}function injectOverlayScripts(a,b,c){var d=windowAlias.name.split("###"),e=d[1],f=d[2],g=getPiwikUrlForOverlay(a,b);loadScript(g+"plugins/Overlay/client/client.js?v=1",function(){Piwik_Overlay_Client.initialize(g,c,e,f)})}function Tracker(trackerUrl,siteId){function setCookie(a,b,c,d,e,f){if(!configCookiesDisabled){var g;c&&(g=new Date,g.setTime(g.getTime()+c)),documentAlias.cookie=a+"="+encodeWrapper(b)+(c?";expires="+g.toGMTString():"")+";path="+(d||"/")+(e?";domain="+e:"")+(f?";secure":"")}}function getCookie(a){if(configCookiesDisabled)return 0;var b=new RegExp("(^|;)[ ]*"+a+"=([^;]*)"),c=b.exec(documentAlias.cookie);return c?decodeWrapper(c[2]):0}function purify(a){var b;return configDiscardHashTag?(b=new RegExp("#.*"),a.replace(b,"")):a}function resolveRelativeReference(a,b){var c,d=getProtocolScheme(b);return d?b:"/"===b.slice(0,1)?getProtocolScheme(a)+"://"+getHostName(a)+b:(a=purify(a),c=a.indexOf("?"),c>=0&&(a=a.slice(0,c)),c=a.lastIndexOf("/"),c!==a.length-1&&(a=a.slice(0,c+1)),a+b)}function isSiteHostName(a){var b,c,d;for(b=0;b<configHostsAlias.length;b++){if(c=domainFixup(configHostsAlias[b].toLowerCase()),a===c)return!0;if("."===c.slice(0,1)){if(a===c.slice(1))return!0;if(d=a.length-c.length,d>0&&a.slice(d)===c)return!0}}return!1}function getImage(a){var b=new Image(1,1);b.onload=function(){iterator=0},b.src=configTrackerUrl+(configTrackerUrl.indexOf("?")<0?"?":"&")+a}function sendXmlHttpRequest(a){try{var b=windowAlias.XMLHttpRequest?new windowAlias.XMLHttpRequest:windowAlias.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):null;b.open("POST",configTrackerUrl,!0),b.onreadystatechange=function(){4===this.readyState&&200!==this.status&&getImage(a)},b.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),b.send(a)}catch(c){getImage(a)}}function sendRequest(a,b){var c=new Date;configDoNotTrack||("POST"===configRequestMethod?sendXmlHttpRequest(a):getImage(a),expireDateTime=c.getTime()+b)}function getCookieName(a){return configCookieNamePrefix+a+"."+configTrackerSiteId+"."+domainHash}function hasCookies(){if(configCookiesDisabled)return"0";if(!isDefined(navigatorAlias.cookieEnabled)){var a=getCookieName("testcookie");return setCookie(a,"1"),"1"===getCookie(a)?"1":"0"}return navigatorAlias.cookieEnabled?"1":"0"}function updateDomainHash(){domainHash=hash((configCookieDomain||domainAlias)+(configCookiePath||"/")).slice(0,4)}function getCustomVariablesFromCookie(){var a=getCookieName("cvar"),b=getCookie(a);return b.length&&(b=JSON2.parse(b),isObject(b))?b:{}}function loadCustomVariables(){customVariables===!1&&(customVariables=getCustomVariablesFromCookie())}function activityHandler(){var a=new Date;lastActivityTime=a.getTime()}function setVisitorIdCookie(a,b,c,d,e,f){setCookie(getCookieName("id"),a+"."+b+"."+c+"."+d+"."+e+"."+f,configVisitorCookieTimeout,configCookiePath,configCookieDomain)}function loadVisitorIdCookie(){var a,b=new Date,c=Math.round(b.getTime()/1e3),d=getCookie(getCookieName("id"));return d?(a=d.split("."),a.unshift("0")):(visitorUUID||(visitorUUID=hash((navigatorAlias.userAgent||"")+(navigatorAlias.platform||"")+JSON2.stringify(browserFeatures)+c).slice(0,16)),a=["1",visitorUUID,c,0,c,"",""]),a}function loadReferrerAttributionCookie(){var a=getCookie(getCookieName("ref"));if(a.length)try{if(a=JSON2.parse(a),isObject(a))return a}catch(b){}return["","",0,""]}function deleteCookies(){var a=configCookiesDisabled;configCookiesDisabled=!1,setCookie(getCookieName("id"),"",-86400,configCookiePath,configCookieDomain),setCookie(getCookieName("ses"),"",-86400,configCookiePath,configCookieDomain),setCookie(getCookieName("cvar"),"",-86400,configCookiePath,configCookieDomain),setCookie(getCookieName("ref"),"",-86400,configCookiePath,configCookieDomain),configCookiesDisabled=a}function sortObjectByKeys(a){if(a&&isObject(a)){var b,c=[];for(b in a)Object.prototype.hasOwnProperty.call(a,b)&&c.push(b);var d={};c.sort();var e,f=c.length;for(e=0;f>e;e++)d[c[e]]=a[c[e]];return d}}function getRequest(a,b,c,d){function e(a,b){var c=JSON2.stringify(a);return c.length>2?"&"+b+"="+encodeWrapper(c):""}var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t=new Date,u=Math.round(t.getTime()/1e3),v=1024,w=customVariables,x=getCookieName("ses"),y=getCookieName("ref"),z=getCookieName("cvar"),A=loadVisitorIdCookie(),B=getCookie(x),C=loadReferrerAttributionCookie(),D=configCustomUrl||locationHrefAlias;if(configCookiesDisabled&&deleteCookies(),configDoNotTrack)return"";g=A[0],h=A[1],j=A[2],i=A[3],k=A[4],l=A[5],isDefined(A[6])||(A[6]=""),m=A[6],isDefined(d)||(d="");var E=documentAlias.characterSet||documentAlias.charset;if(E&&"utf-8"!==E.toLowerCase()||(E=null),r=C[0],s=C[1],n=C[2],o=C[3],!B){var F=configSessionCookieTimeout/1e3;if((!l||u-l>F)&&(i++,l=k),!configConversionAttributionFirstReferrer||!r.length){for(f in configCampaignNameParameters)if(Object.prototype.hasOwnProperty.call(configCampaignNameParameters,f)&&(r=getParameter(D,configCampaignNameParameters[f]),r.length))break;for(f in configCampaignKeywordParameters)if(Object.prototype.hasOwnProperty.call(configCampaignKeywordParameters,f)&&(s=getParameter(D,configCampaignKeywordParameters[f]),s.length))break}p=getHostName(configReferrerUrl),q=o.length?getHostName(o):"",!p.length||isSiteHostName(p)||configConversionAttributionFirstReferrer&&q.length&&!isSiteHostName(q)||(o=configReferrerUrl),(o.length||r.length)&&(n=u,C=[r,s,n,purify(o.slice(0,v))],setCookie(y,JSON2.stringify(C),configReferralCookieTimeout,configCookiePath,configCookieDomain))}a+="&idsite="+configTrackerSiteId+"&rec=1&r="+String(Math.random()).slice(2,8)+"&h="+t.getHours()+"&m="+t.getMinutes()+"&s="+t.getSeconds()+"&url="+encodeWrapper(purify(D))+(configReferrerUrl.length?"&urlref="+encodeWrapper(purify(configReferrerUrl)):"")+"&_id="+h+"&_idts="+j+"&_idvc="+i+"&_idn="+g+(r.length?"&_rcn="+encodeWrapper(r):"")+(s.length?"&_rck="+encodeWrapper(s):"")+"&_refts="+n+"&_viewts="+l+(String(m).length?"&_ects="+m:"")+(String(o).length?"&_ref="+encodeWrapper(purify(o.slice(0,v))):"")+(E?"&cs="+encodeWrapper(E):"");for(f in browserFeatures)Object.prototype.hasOwnProperty.call(browserFeatures,f)&&(a+="&"+f+"="+browserFeatures[f]);b?a+="&data="+encodeWrapper(JSON2.stringify(b)):configCustomData&&(a+="&data="+encodeWrapper(JSON2.stringify(configCustomData)));var G=sortObjectByKeys(customVariablesPage),H=sortObjectByKeys(customVariablesEvent);if(a+=e(G,"cvar"),a+=e(H,"e_cvar"),customVariables){a+=e(customVariables,"_cvar");for(f in w)Object.prototype.hasOwnProperty.call(w,f)&&(""===customVariables[f][0]||""===customVariables[f][1])&&delete customVariables[f];setCookie(z,JSON2.stringify(customVariables),configSessionCookieTimeout,configCookiePath,configCookieDomain)}return configPerformanceTrackingEnabled&&(configPerformanceGenerationTime?a+="&gt_ms="+configPerformanceGenerationTime:performanceAlias&&performanceAlias.timing&&performanceAlias.timing.requestStart&&performanceAlias.timing.responseEnd&&(a+="&gt_ms="+(performanceAlias.timing.responseEnd-performanceAlias.timing.requestStart))),setVisitorIdCookie(h,j,i,u,l,isDefined(d)&&String(d).length?d:m),setCookie(x,"*",configSessionCookieTimeout,configCookiePath,configCookieDomain),a+=executePluginMethod(c),configAppendToTrackingUrl.length&&(a+="&"+configAppendToTrackingUrl),a}function logEcommerce(a,b,c,d,e,f){var g,h,i="idgoal=0",j=new Date,k=[];if(String(a).length&&(i+="&ec_id="+encodeWrapper(a),g=Math.round(j.getTime()/1e3)),i+="&revenue="+b,String(c).length&&(i+="&ec_st="+c),String(d).length&&(i+="&ec_tx="+d),String(e).length&&(i+="&ec_sh="+e),String(f).length&&(i+="&ec_dt="+f),ecommerceItems){for(h in ecommerceItems)Object.prototype.hasOwnProperty.call(ecommerceItems,h)&&(isDefined(ecommerceItems[h][1])||(ecommerceItems[h][1]=""),isDefined(ecommerceItems[h][2])||(ecommerceItems[h][2]=""),isDefined(ecommerceItems[h][3])&&0!==String(ecommerceItems[h][3]).length||(ecommerceItems[h][3]=0),isDefined(ecommerceItems[h][4])&&0!==String(ecommerceItems[h][4]).length||(ecommerceItems[h][4]=1),k.push(ecommerceItems[h]));i+="&ec_items="+encodeWrapper(JSON2.stringify(k))}i=getRequest(i,configCustomData,"ecommerce",g),sendRequest(i,configTrackerPause)}function logEcommerceOrder(a,b,c,d,e,f){String(a).length&&isDefined(b)&&logEcommerce(a,b,c,d,e,f)}function logEcommerceCartUpdate(a){isDefined(a)&&logEcommerce("",a,"","","","")}function logPageView(a,b){var c=new Date,d=getRequest("action_name="+encodeWrapper(titleFixup(a||configTitle)),b,"log");sendRequest(d,configTrackerPause),configMinimumVisitTime&&configHeartBeatTimer&&!activityTrackingInstalled&&(activityTrackingInstalled=!0,addEventListener(documentAlias,"click",activityHandler),addEventListener(documentAlias,"mouseup",activityHandler),addEventListener(documentAlias,"mousedown",activityHandler),addEventListener(documentAlias,"mousemove",activityHandler),addEventListener(documentAlias,"mousewheel",activityHandler),addEventListener(windowAlias,"DOMMouseScroll",activityHandler),addEventListener(windowAlias,"scroll",activityHandler),addEventListener(documentAlias,"keypress",activityHandler),addEventListener(documentAlias,"keydown",activityHandler),addEventListener(documentAlias,"keyup",activityHandler),addEventListener(windowAlias,"resize",activityHandler),addEventListener(windowAlias,"focus",activityHandler),addEventListener(windowAlias,"blur",activityHandler),lastActivityTime=c.getTime(),setTimeout(function e(){var a;c=new Date,lastActivityTime+configHeartBeatTimer>c.getTime()&&(configMinimumVisitTime<c.getTime()&&(a=getRequest("ping=1",b,"ping"),sendRequest(a,configTrackerPause)),setTimeout(e,configHeartBeatTimer))},configHeartBeatTimer))}function logEvent(a,b,c,d,e){if(0===String(a).length||0===String(b).length)return!1;var f=getRequest("e_c="+encodeWrapper(a)+"&e_a="+encodeWrapper(b)+(isDefined(c)?"&e_n="+encodeWrapper(c):"")+(isDefined(d)?"&e_v="+encodeWrapper(d):""),e,"event");sendRequest(f,configTrackerPause)}function logSiteSearch(a,b,c,d){var e=getRequest("search="+encodeWrapper(a)+(b?"&search_cat="+encodeWrapper(b):"")+(isDefined(c)?"&search_count="+c:""),d,"sitesearch");sendRequest(e,configTrackerPause)}function logGoal(a,b,c){var d=getRequest("idgoal="+a+(b?"&revenue="+b:""),c,"goal");sendRequest(d,configTrackerPause)}function logLink(a,b,c){var d=getRequest(b+"="+encodeWrapper(purify(a)),c,"link");sendRequest(d,configTrackerPause)}function prefixPropertyName(a,b){return""!==a?a+b.charAt(0).toUpperCase()+b.slice(1):b}function trackCallback(a){var b,c,d,e=["","webkit","ms","moz"];if(!configCountPreRendered)for(c=0;c<e.length;c++)if(d=e[c],Object.prototype.hasOwnProperty.call(documentAlias,prefixPropertyName(d,"hidden"))){"prerender"===documentAlias[prefixPropertyName(d,"visibilityState")]&&(b=!0);break}return b?void addEventListener(documentAlias,d+"visibilitychange",function f(){documentAlias.removeEventListener(d+"visibilitychange",f,!1),a()}):void a()}function getClassesRegExp(a,b){var c,d="(^| )(piwik[_-]"+b;if(a)for(c=0;c<a.length;c++)d+="|"+a[c];return d+=")( |$)",new RegExp(d)}function getLinkType(a,b,c){var d=getClassesRegExp(configDownloadClasses,"download"),e=getClassesRegExp(configLinkClasses,"link"),f=new RegExp("\\.("+configDownloadExtensions+")([?&#]|$)","i");return e.test(a)?"link":d.test(a)||f.test(b)?"download":c?0:"link"}function processClick(a){var b,c,d;for(b=a.parentNode;null!==b&&isDefined(b)&&(c=a.tagName.toUpperCase(),"A"!==c&&"AREA"!==c);)a=b,b=a.parentNode;if(isDefined(a.href)){var e=a.hostname||getHostName(a.href),f=e.toLowerCase(),g=a.href.replace(e,f),h=new RegExp("^(javascript|vbscript|jscript|mocha|livescript|ecmascript|mailto):","i");h.test(g)||(d=getLinkType(a.className,g,isSiteHostName(f)),d&&(g=urldecode(g),logLink(g,d)))}}function clickHandler(a){var b,c;a=a||windowAlias.event,b=a.which||a.button,c=a.target||a.srcElement,"click"===a.type?c&&processClick(c):"mousedown"===a.type?1!==b&&2!==b||!c?lastButton=lastTarget=null:(lastButton=b,lastTarget=c):"mouseup"===a.type&&(b===lastButton&&c===lastTarget&&processClick(c),lastButton=lastTarget=null)}function addClickListener(a,b){b?(addEventListener(a,"mouseup",clickHandler,!1),addEventListener(a,"mousedown",clickHandler,!1)):addEventListener(a,"click",clickHandler,!1)}function addClickListeners(a){if(!linkTrackingInstalled){linkTrackingInstalled=!0;var b,c=getClassesRegExp(configIgnoreClasses,"ignore"),d=documentAlias.links;if(d)for(b=0;b<d.length;b++)c.test(d[b].className)||addClickListener(d[b],a)}}function detectBrowserFeatures(){var a,b,c={pdf:"application/pdf",qt:"video/quicktime",realp:"audio/x-pn-realaudio-plugin",wma:"application/x-mplayer2",dir:"application/x-director",fla:"application/x-shockwave-flash",java:"application/x-java-vm",gears:"application/x-googlegears",ag:"application/x-silverlight"},d=new RegExp("Mac OS X.*Safari/").test(navigatorAlias.userAgent)?windowAlias.devicePixelRatio||1:1;if(!new RegExp("MSIE").test(navigatorAlias.userAgent)){if(navigatorAlias.mimeTypes&&navigatorAlias.mimeTypes.length)for(a in c)Object.prototype.hasOwnProperty.call(c,a)&&(b=navigatorAlias.mimeTypes[c[a]],browserFeatures[a]=b&&b.enabledPlugin?"1":"0");"unknown"!=typeof navigator.javaEnabled&&isDefined(navigatorAlias.javaEnabled)&&navigatorAlias.javaEnabled()&&(browserFeatures.java="1"),isFunction(windowAlias.GearsFactory)&&(browserFeatures.gears="1"),browserFeatures.cookie=hasCookies()}browserFeatures.res=screenAlias.width*d+"x"+screenAlias.height*d}function registerHook(hookName,userHook){var hookObj=null;if(isString(hookName)&&!isDefined(registeredHooks[hookName])&&userHook){if(isObject(userHook))hookObj=userHook;else if(isString(userHook))try{eval("hookObj ="+userHook)}catch(ignore){}registeredHooks[hookName]=hookObj}return hookObj}var registeredHooks={},locationArray=urlFixup(documentAlias.domain,windowAlias.location.href,getReferrer()),domainAlias=domainFixup(locationArray[0]),locationHrefAlias=locationArray[1],configReferrerUrl=locationArray[2],configRequestMethod="GET",configTrackerUrl=trackerUrl||"",configApiUrl="",configAppendToTrackingUrl="",configTrackerSiteId=siteId||"",configCustomUrl,configTitle=documentAlias.title,configDownloadExtensions="7z|aac|apk|ar[cj]|as[fx]|avi|bin|csv|deb|dmg|docx?|exe|flv|gif|gz|gzip|hqx|jar|jpe?g|js|mp(2|3|4|e?g)|mov(ie)?|ms[ip]|od[bfgpst]|og[gv]|pdf|phps|png|pptx?|qtm?|ra[mr]?|rpm|sea|sit|tar|t?bz2?|tgz|torrent|txt|wav|wm[av]|wpd||xlsx?|xml|z|zip",configHostsAlias=[domainAlias],configIgnoreClasses=[],configDownloadClasses=[],configLinkClasses=[],configTrackerPause=500,configMinimumVisitTime,configHeartBeatTimer,configDiscardHashTag,configCustomData,configCampaignNameParameters=["bt_campaign","boost_campaign","utm_campaign","utm_source","utm_medium"],configCampaignKeywordParameters=["bt_kwd","boost_kwd","utm_term"],configCookieNamePrefix="_bt_",configCookieDomain,configCookiePath,configCookiesDisabled=!1,configDoNotTrack,configCountPreRendered,configConversionAttributionFirstReferrer,configVisitorCookieTimeout=63072e6,configSessionCookieTimeout=18e5,configReferralCookieTimeout=15768e6,configPerformanceTrackingEnabled=!0,configPerformanceGenerationTime=0,customVariables=!1,customVariablesPage={},customVariablesEvent={},customVariableMaximumLength=200,ecommerceItems={},browserFeatures={},linkTrackingInstalled=!1,activityTrackingInstalled=!1,lastActivityTime,lastButton,lastTarget,hash=sha1,domainHash,visitorUUID;return detectBrowserFeatures(),updateDomainHash(),executePluginMethod("run",registerHook),{hook:registeredHooks,getHook:function(a){return registeredHooks[a]},getVisitorId:function(){return loadVisitorIdCookie()[1]},getVisitorInfo:function(){return loadVisitorIdCookie()},getAttributionInfo:function(){return loadReferrerAttributionCookie()},getAttributionCampaignName:function(){return loadReferrerAttributionCookie()[0]},getAttributionCampaignKeyword:function(){return loadReferrerAttributionCookie()[1]},getAttributionReferrerTimestamp:function(){return loadReferrerAttributionCookie()[2]},getAttributionReferrerUrl:function(){return loadReferrerAttributionCookie()[3]},setTrackerUrl:function(a){configTrackerUrl=a},setSiteId:function(a){configTrackerSiteId=a},setCustomData:function(a,b){isObject(a)?configCustomData=a:(configCustomData||(configCustomData=[]),configCustomData[a]=b)},appendToTrackingUrl:function(a){configAppendToTrackingUrl=a},getCustomData:function(){return configCustomData},setCustomVariable:function(a,b,c,d){var e;isDefined(d)||(d="visit"),a>0&&(b=isDefined(b)&&!isString(b)?String(b):b,c=isDefined(c)&&!isString(c)?String(c):c,e=[b.slice(0,customVariableMaximumLength),c.slice(0,customVariableMaximumLength)],"visit"===d||2===d?(loadCustomVariables(),customVariables[a]=e):"page"===d||3===d?customVariablesPage[a]=e:"event"===d&&(customVariablesEvent[a]=e))},getCustomVariable:function(a,b){var c;return isDefined(b)||(b="visit"),"page"===b||3===b?c=customVariablesPage[a]:"event"===b?c=customVariablesEvent[a]:("visit"===b||2===b)&&(loadCustomVariables(),c=customVariables[a]),!isDefined(c)||c&&""===c[0]?!1:c},deleteCustomVariable:function(a,b){this.getCustomVariable(a,b)&&this.setCustomVariable(a,"","",b)},setLinkTrackingTimer:function(a){configTrackerPause=a},setDownloadExtensions:function(a){configDownloadExtensions=a},addDownloadExtensions:function(a){configDownloadExtensions+="|"+a},setDomains:function(a){configHostsAlias=isString(a)?[a]:a,configHostsAlias.push(domainAlias)},setIgnoreClasses:function(a){configIgnoreClasses=isString(a)?[a]:a},setRequestMethod:function(a){configRequestMethod=a||"GET"},setReferrerUrl:function(a){configReferrerUrl=a},setCustomUrl:function(a){configCustomUrl=resolveRelativeReference(locationHrefAlias,a)},setDocumentTitle:function(a){configTitle=a},setAPIUrl:function(a){configApiUrl=a},setDownloadClasses:function(a){configDownloadClasses=isString(a)?[a]:a},setLinkClasses:function(a){configLinkClasses=isString(a)?[a]:a},setCampaignNameKey:function(a){configCampaignNameParameters=isString(a)?[a]:a},setCampaignKeywordKey:function(a){configCampaignKeywordParameters=isString(a)?[a]:a},discardHashTag:function(a){configDiscardHashTag=a},setCookieNamePrefix:function(a){configCookieNamePrefix=a,customVariables=getCustomVariablesFromCookie()},setCookieDomain:function(a){configCookieDomain=domainFixup(a),updateDomainHash()},setCookiePath:function(a){configCookiePath=a,updateDomainHash()},setVisitorCookieTimeout:function(a){configVisitorCookieTimeout=1e3*a},setSessionCookieTimeout:function(a){configSessionCookieTimeout=1e3*a},setReferralCookieTimeout:function(a){configReferralCookieTimeout=1e3*a},setConversionAttributionFirstReferrer:function(a){configConversionAttributionFirstReferrer=a},disableCookies:function(){configCookiesDisabled=!0,browserFeatures.cookie="0"},deleteCookies:function(){deleteCookies()},setDoNotTrack:function(a){var b=navigatorAlias.doNotTrack||navigatorAlias.msDoNotTrack;configDoNotTrack=a&&("yes"===b||"1"===b),configDoNotTrack&&this.disableCookies()},addListener:function(a,b){addClickListener(a,b)},enableLinkTracking:function(a){hasLoaded?addClickListeners(a):registeredOnLoadHandlers.push(function(){addClickListeners(a)})},disablePerformanceTracking:function(){configPerformanceTrackingEnabled=!1},setGenerationTimeMs:function(a){configPerformanceGenerationTime=parseInt(a,10)},setHeartBeatTimer:function(a,b){var c=new Date;configMinimumVisitTime=c.getTime()+1e3*a,configHeartBeatTimer=1e3*b},killFrame:function(){windowAlias.location!==windowAlias.top.location&&(windowAlias.top.location=windowAlias.location)},redirectFile:function(a){"file:"===windowAlias.location.protocol&&(windowAlias.location=a)},setCountPreRendered:function(a){configCountPreRendered=a},trackGoal:function(a,b,c){trackCallback(function(){logGoal(a,b,c)
})},trackLink:function(a,b,c){trackCallback(function(){logLink(a,b,c)})},trackPageView:function(a,b){trackCallback(isOverlaySession(configTrackerSiteId)?function(){injectOverlayScripts(configTrackerUrl,configApiUrl,configTrackerSiteId)}:function(){logPageView(a,b)})},trackEvent:function(a,b,c,d){trackCallback(function(){logEvent(a,b,c,d)})},trackSiteSearch:function(a,b,c){trackCallback(function(){logSiteSearch(a,b,c)})},setEcommerceView:function(a,b,c,d){isDefined(c)&&c.length?c instanceof Array&&(c=JSON2.stringify(c)):c="",customVariablesPage[5]=["_btc",c],isDefined(d)&&String(d).length&&(customVariablesPage[2]=["_btp",d]),(isDefined(a)&&a.length||isDefined(b)&&b.length)&&(isDefined(a)&&a.length&&(customVariablesPage[3]=["_bts",a]),isDefined(b)&&b.length||(b=""),customVariablesPage[4]=["_btn",b])},addEcommerceItem:function(a,b,c,d,e){a.length&&(ecommerceItems[a]=[a,b,c,d,e])},trackEcommerceOrder:function(a,b,c,d,e,f){logEcommerceOrder(a,b,c,d,e,f)},trackEcommerceCartUpdate:function(a){logEcommerceCartUpdate(a)}}}function TrackerProxy(){return{push:apply}}var expireDateTime,plugins={},documentAlias=document,navigatorAlias=navigator,screenAlias=screen,windowAlias=window,performanceAlias=windowAlias.performance||windowAlias.mozPerformance||windowAlias.msPerformance||windowAlias.webkitPerformance,hasLoaded=!1,registeredOnLoadHandlers=[],encodeWrapper=windowAlias.encodeURIComponent,decodeWrapper=windowAlias.decodeURIComponent,urldecode=unescape,asyncTracker,iterator,Piwik;for(addEventListener(windowAlias,"beforeunload",beforeUnloadHandler,!1),addReadyListener(),Date.prototype.getTimeAlias=Date.prototype.getTime,asyncTracker=new Tracker,iterator=0;iterator<_boost.length;iterator++)("setTrackerUrl"===_boost[iterator][0]||"setSiteId"===_boost[iterator][0])&&(apply(_boost[iterator]),delete _boost[iterator]);for(iterator=0;iterator<_boost.length;iterator++)_boost[iterator]&&apply(_boost[iterator]);return _boost=new TrackerProxy,Piwik={addPlugin:function(a,b){plugins[a]=b},getTracker:function(a,b){return new Tracker(a,b)},getAsyncTracker:function(){return asyncTracker}},"function"==typeof define&&define.amd&&define("piwik",[],function(){return Piwik}),Piwik}()),"function"!=typeof piwik_log&&(piwik_log=function(documentTitle,siteId,piwikUrl,customData){"use strict";function getOption(optionName){try{return eval("piwik_"+optionName)}catch(ignore){}}var option,piwikTracker=Piwik.getTracker(piwikUrl,siteId);piwikTracker.setDocumentTitle(documentTitle),piwikTracker.setCustomData(customData),option=getOption("tracker_pause"),option&&piwikTracker.setLinkTrackingTimer(option),option=getOption("download_extensions"),option&&piwikTracker.setDownloadExtensions(option),option=getOption("hosts_alias"),option&&piwikTracker.setDomains(option),option=getOption("ignore_classes"),option&&piwikTracker.setIgnoreClasses(option),piwikTracker.trackPageView(),getOption("install_tracker")&&(piwik_track=function(a,b,c,d){piwikTracker.setSiteId(b),piwikTracker.setTrackerUrl(c),piwikTracker.trackLink(a,d)},piwikTracker.enableLinkTracking())}),function(){window._fbds=window._fbds||{},_fbds.pixelId=0x5433eb5e23a1d;var a=document.createElement("script");a.async=!0,a.src="//connect.facebook.net/en_US/fbds.js";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}(),window._fbq=window._fbq||[],window._fbq.push(["track","PixelInitialized",{}]);var current_url=window.location.href;window.setInterval(function(){window.location.href!=current_url&&(hasChanged(window.location.href),current_url=window.location.href)},100),firePixel();