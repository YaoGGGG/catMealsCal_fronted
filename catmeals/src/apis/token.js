import httpInstance from "@/utils/http"

export const tokenAPI = ({username, password}) =>{
    return httpInstance({
        url:'/api/token/',
        method:'POST',
        data:{
            username,
            password,
        }
    })
}