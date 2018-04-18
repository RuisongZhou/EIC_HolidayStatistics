/**
 * 绑定，删除事件
 * @param {obj对象}   elm       需要绑定事件的对象
 * @param {[type]}   evType     需要绑定的事件名称
 * @param {Function} fn         绑定事件的函数
 * @param {[type]}   useCapture true/false冒泡方式
 */
/**
 * 原生JS获取form中的信息
 * @param  {[type]} frmID [description]
 * @return {[type]}       [description]
 */
//考虑浏览器的兼容性，获取浏览器对象判断后进行声明
let code = 0;
function addEvent(elm, evType, fn, useCapture) {
    if (elm.addEventListener) {
        elm.addEventListener(evType, fn, useCapture); //DOM2.0
        return true;
    } else if (elm.attachEvent) {
        var r = elm.attachEvent("on" + evType, fn); //IE5+
        return r;
    } else {
        elm['on' + evType] = fn; //DOM 0
    }
}

function forbiddenEvent(event) {
    event = event || window.event;
    if (event.stopPropagation) event.stopPropagation();
    else event.cancelBubble = true;
    if (event.preventDefault) event.preventDefault();
    else event.returnValue = false;

}

var xmlhttp;
if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
} else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}

//ajax请求数据
function getData(method, url, queryString, fnc) { //获取JSON数据
    //异步链接服务器，设置连接方式
    xmlhttp.open(method, url, true);
    //设置请求头
    xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    //发送request数据
    xmlhttp.send(queryString);
    //改变状态，调用函数
    xmlhttp.onreadystatechange = fnc;
}

var wait=60;
function time(o) {  
    if (wait == 0) {  
        o.removeAttribute("disabled");            
        o.value="获取验证码";  
        wait = 60;  
    } else {  
        o.setAttribute("disabled", true);  
        o.value="重新发送(" + wait + ")";  
        wait--;  
        setTimeout(function() {  
            time(o)  
        },  
        1000)  
    }
}

addEvent(document.getElementById('get'),"click", function(event) {
    forbiddenEvent(event);
    //获取表单提交数据
    //POST表单json数据到服务器
    var form = document.getElementById('login');
    var info = {
        StudentID:''
    };
    StudentIDPattern = /^U201[0-9]{6}$/;
    if (!StudentIDPattern.test(form.logname.value)) {
        alert('请输入有效的学号');
        form.logname.focus();
    }
    else if (form.logpass.value!=form.relogpass.value) {
        alert('两次密码不一致，请重新输入');
        form.logpass.focus();
    }
    else if (form.logpass.value.length<7) {
        alert('密码长度应不小于6位');
        form.logpass.focus();
    }else{
        info.StudentID = form.logname.value
        alert("验证码已发往您的华中大邮箱")
        time(document.getElementById('get'))
    }
    getData("PUT", "http://118.190.207.113:3030/students", JSON.stringify(info), function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                code = xmlhttp.responseText
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}
, false);

//添加请求
addEvent(document.getElementById('login'),"submit", function(event) {
    forbiddenEvent(event);
    forbiddenEvent(event);
    //获取表单提交数据
    var form = document.getElementById('login');
    var info = {
        StudentID:'',
        password:'',
        stat:'regist',
    };
    StudentIDPattern = /^U201[0-9]{6}$/;
    if (!StudentIDPattern.test(form.logname.value)) {
        alert('请输入有效的学号');
        form.logname.focus();
    }
    else if (form.logpass.value!=form.relogpass.value) {
        alert('两次密码不一致，请重新输入');
        form.logpass.focus();
    }
    else if (form.logpass.value.length<6) {
        alert('密码长度应不小于6位');
        form.logpass.focus();
    }else if (!RegExp(form.code.value).test(code)){
        alert('验证码错误');
        form.code.value = ""
        form.code.focus();
    }else{
    info.StudentID = form.logname.value;
    info.password = form.logpass.value;
    //POST表单json数据到服务器
    getData("POST", "http://118.190.207.113:3030/students", JSON.stringify(info), function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                if (RegExp("regist failed").test(xmlhttp.responseText)){
                    console.log(xmlhttp.responseText);
                    alert('该学生已被注册');
                    form.logname.focus();
                }else{
                    alert('注册成功');
                    document.write(xmlhttp.responseText);
                    window.location.hash = form.logname.value
                }
            } else {
                console.log("发生错误" + xmlhttp.status);
            }
        }
    });
}}
, false);

