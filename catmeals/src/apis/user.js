import httpInstance from "@/utils/http"

export const loginAPI = ({username, password}) =>{
    return httpInstance({
        url:'/accounts/loginnew/',
        method:'POST',
        data:{
            username,
            password,
        }
    })
}