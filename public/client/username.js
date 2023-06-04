const loginidch=document.getElementById('log-email')
const loginpassch=document.getElementById('log-pass')

const logbut=document.getElementById('login-submit')

function loginidfunc(logid,logpass){
    var logdata={
        loginidchfunc :logid,
        loginpasschfunc: logpass
    }
    return logdata
    
}

logbut.addEventListener('click',()=>{
    
    console.log(loginidfunc(loginidch.value,loginpassch.value))

})


