(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-728ed530"],{"144c":function(e,t,o){"use strict";o("889d")},2017:function(e,t,o){"use strict";o("cafe")},"889d":function(e,t,o){},"9ed6":function(e,t,o){"use strict";o.r(t);var r=function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",{staticClass:"login-container"},[o("el-form",{ref:"loginForm",staticClass:"login-form",attrs:{model:e.loginForm,rules:e.loginRules,autocomplete:"on","label-position":"left"}},[o("div",{staticClass:"title-container"},[o("h3",{staticClass:"title"},[e._v("Login Form")])]),o("el-form-item",[o("span",{staticClass:"svg-containter"},[o("svg-icon",{attrs:{"icon-class":"user"}})],1),o("el-input",{ref:"username",attrs:{placeholder:"请输入用户名",name:"username",type:"text",tabindex:"1",autocomplete:"on"},model:{value:e.loginForm.username,callback:function(t){e.$set(e.loginForm,"username",t)},expression:"loginForm.username"}})],1),o("el-tooltip",{attrs:{content:"大写锁定已开启",placement:"left",manual:""},model:{value:e.capsTooltip,callback:function(t){e.capsTooltip=t},expression:"capsTooltip"}},[o("el-form-item",[o("span",{staticClass:"svg-containter"},[o("svg-icon",{attrs:{"icon-class":"password"}})],1),o("el-input",{ref:"password",attrs:{placeholder:"请输入密码",name:"password",type:e.passwordType,tabindex:"2",autocomplete:"off"},model:{value:e.loginForm.password,callback:function(t){e.$set(e.loginForm,"password",t)},expression:"loginForm.password"}}),o("span",{staticClass:"show-pwd",on:{click:e.showPwd}},[o("svg-icon",{attrs:{"icon-class":"password"===e.passwordType?"eye":"eye-open"}})],1)],1)],1),o("el-button",{staticStyle:{width:"100%","margin-bottom":"30px"},attrs:{loading:e.loading,type:"primary"},nativeOn:{click:function(t){return t.preventDefault(),e.handleLogin.apply(null,arguments)}}},[e._v("Login")])],1)],1)},n=[],s=(o("d9e2"),o("d3b7"),o("b64b"),o("61f7")),i={data:function(){var e=function(e,t,o){Object(s["b"])(t)?o():o(new Error("请输入用户名: admin 或者 editor"))},t=function(e,t,o){t.length<6?o(new Error("密码长度不能少于6位")):o()};return{loginForm:{username:"admin",password:"111111"},loginRules:{username:[{required:!0,trigger:"blur",validator:e}],password:[{required:!0,trigger:"blur",validator:t}]},passwordType:"password",capsTooltip:!1,loading:!1,redirect:void 0,otherQuery:{}}},watch:{$route:{handler:function(e){console.log(e,"route-watch");var t=e.query;t&&(this.redirect=t.redirect,this.otherQuery=this.getOtherQuery(t),console.log(this.redirect,this.otherQuery))},immediate:!0}},methods:{showPwd:function(){"password"===this.passwordType?this.passwordType="":this.passwordType="password"},handleLogin:function(){var e=this;console.log("开始登录"),this.$refs["loginForm"].validate((function(t){if(!t)return!1;e.loading=!0,e.$store.dispatch("user/login",e.loginForm).then((function(){e.$router.push({path:e.redirect||"/",query:e.otherQuery}),e.loading=!1})).catch((function(){e.loading=!1}))}))},getOtherQuery:function(e){return Object.keys(e).reduce((function(t,o){return"redirect"!==o&&(t[o]=e[o]),t}),{})}}},a=i,l=(o("2017"),o("144c"),o("2877")),c=Object(l["a"])(a,r,n,!1,null,"56fb363e",null);t["default"]=c.exports},cafe:function(e,t,o){}}]);
//# sourceMappingURL=chunk-728ed530.a0c66c1e.js.map