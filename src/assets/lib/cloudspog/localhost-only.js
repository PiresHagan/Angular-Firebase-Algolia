(function(){var o;window.cloudspongeProxy=function(){var e,o,n,t,r,c,a,i,s;for(o in i=window.location.search,s={},i.replace(/([^?=&]+)(=([^&]*))?/g,function(o,e,n,t){return s[e]=decodeURIComponent(t)}),n={},r=s)a=r[o],"code"!==o&&"state"!==o&&"error"!==o&&"error_code"!==o&&"forward"!==o||(n[o]=a);return(n.code||n.error||n.error_code)&&n.state&&n.state.match(/_csAuth/)&&(t="https://api.cloudsponge.com/auth?"+function(){var o;for(e in o=[],n)c=n[e],o.push(e+"="+c);return o}().join("&"),window.location=t),{}}(),o=function(){function o(){this.location=n(),(window.cloudsponge.config.debug||this.location.queryParams&&this.location.queryParams.debug)&&(this.debug="?debug=true")}var e,n,i;return o.prototype.scriptId="__cs-script__",o.prototype.debug="",o.prototype.initErrors=function(t){var o;return window.Raven?t():(o=function(o){var e;try{if(cloudsponge.r=o||window.Raven&&!window.Raven.isSetup()&&window.Raven.noConflict())return cloudsponge.r.config("https://7ea7da3da02644a3a3063df341cb2c4f@sentry.io/73523",{release:"ceeb3f311d1e6cb3baa664352386f54c05465fea",environment:"production",whitelistUrls:[new RegExp(cloudsponge.bootstrapper.location.origin.replace(/\./g,"\\."))],autoBreadcrumbs:!1,tags:{widgetVersion:cloudsponge.version}}).install()}finally{if(t)try{t()}catch(n){throw e=n,cloudsponge.r&&cloudsponge.r.captureException(e),e}}},"function"==typeof define&&define.amd&&"function"==typeof require?require(["//cdn.ravenjs.com/3.23.3/raven.min.js"],o):this.addJavascript("//cdn.ravenjs.com/3.23.3/raven.min.js","cloudsponge-raven-script",{crossorigin:"anonymous"},o))},o.prototype.load=function(){return window.cloudsponge.config.__beforeLoad&&window.cloudsponge.config.__beforeLoad.call(),this.addJavascript(this.location.origin+"/assets/address_books16-33ae9a49a0104d6f93fbecd82fc70a37d62251332a6fd7cabbd8ccc50227e7a4.js"+this.debug,this.scriptId,{crossorigin:"anonymous"})},e=function(){var o,e;return o="localhost-only",e="k",(new Image).src=cloudsponge.bootstrapper.location.origin+"/wlt?k="+o+"&t="+e+"&v="+window.cloudsponge.version+"&h="+window.location.host},o.prototype.addTrackingPixel=function(){return"complete"===document.readyState?e():document.addEventListener?document.addEventListener("DOMContentLoaded",e):document.attachEvent?document.attachEvent("onload",e):void 0},o.prototype.launchHashExists=function(){var o;if(window.location)return o=/#?\(_cs_import=([^:]+):([^)]+)\)/,!!location.hash.match(o)},o.prototype.addJavascript=function(o,e,n,t){var r,c,a,i,s;for(a in(r=document.createElement("script")).async=1,r.src=o,e&&(r.id=e),i=n||{})s=i[a],r.setAttribute(a,s);return t&&(r.readyState?r.onreadystatechange=function(){if("loaded"===r.readyState||"complete"===r.readyState)return r.onreadystatechange=null,t()}:r.onload=function(){return t()}),(c=document.getElementsByTagName("script")[0]).parentNode.insertBefore(r,c)},o.prototype.addStylesheet=function(o){var e,n;return(e=document.createElement("link")).rel="stylesheet",e.media="screen",e.type="text/css",e.href=o,(n=document.getElementsByTagName("script")[0]).parentNode.insertBefore(e,n)},i=function(o){var r;return r={},o.replace(new RegExp("([^?=&]+)(=([^&]*))?","g"),function(o,e,n,t){return r[e]=decodeURIComponent(t)}),r},n=function(){var o,e,n,t,r,c,a;for(c={src:null,scheme:window.location.protocol,host:"api.cloudsponge.com",origin:"https://api.cloudsponge.com",port:null,search:"",queryParams:{},anchor:null,path:null},t=/^(https?:)?\/\/([^\/:]+):?([0-9]+)?\/widget(\/v[0-9]+)?\/localhost-only\.js\??([^\#]*)\#?(.*)$/,o=0,e=(r=document.getElementsByTagName("script")).length;o<e;o++)if(a=r[o],n=t.exec(a.src)){c.src=n[0],c.scheme=n[1]?n[1]:window.location.protocol,c.host=n[2],c.origin=c.scheme+"//"+n[2],n[3]&&(c.port=n[3],c.origin+=":"+n[3]),n[4]&&(c.path=n[4]),n[5]&&(c.search=n[5],c.queryParams=i(n[5])),n[6]&&(c.anchor=n[6]);break}return c},o}(),function(r,e){if(r.cloudsponge||(r.cloudsponge={initOptions:{}}),!r.cloudsponge.version)r.cloudsponge.loaded=!1,r.cloudsponge.config={key:"8b761f8fa34ffc475726c587d6dd869f33a36363",debug:!0},r.cloudsponge.config.key||(r.cloudsponge.config.key="localhost-only"),r.cloudsponge.init=function(o){var e,n,t;if(o){for(e in n=[],o)t=o[e],n.push(r.cloudsponge.initOptions[e]=t);return n}},r.cloudsponge.load=function(o){if(r.cloudsponge.init(o),!r.cloudsponge.loaded)return r.cloudsponge.loaded=!0,e.load()},r.cloudsponge.launch=function(){return!1},r.cloudsponge.version="1.6.0",r.cloudsponge.bootstrapper=e=new o,r.cloudsponge.bootstrapper.initErrors(function(){return!e.launchHashExists()&&window.csPageOptions&&csPageOptions.lazyLoad||cloudsponge.load(),e.addTrackingPixel()})}(window)}).call(this);