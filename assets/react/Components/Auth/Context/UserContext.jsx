import React, { useReducer, createContext, useEffect } from "react";

import UserReducer from './UserReducer';
import axios from "axios";


const getUser = async () => {
    const formData = new FormData();
    formData.append('userId', sessionStorage.getItem('user'));
    formData.append('sessionId', sessionStorage.getItem('user_id'));
    try {
        const res = await axios.post('/api/connected-user', formData)
        if(res.data?.length < 1){
            sessionStorage.setItem("user", null)
            sessionStorage.setItem("user_id", null)
            return null
        }
        sessionStorage.setItem("user", res.data?.user_id)
        sessionStorage.setItem("user_id", res.data?.sessionId)
        return res.data
        
    } catch (error) {
        console.log(error)
    }
}


// initial state
const INIT_STATE = {
    user: await getUser(),
    isLoading: false,
    error: false,
}

export const UserContext = createContext(INIT_STATE);

// Wrap usercontext inside app
export const UserContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(UserReducer, INIT_STATE);

    useEffect(() => {
        sessionStorage.setItem("user", state.user?.user_id || null)
        sessionStorage.setItem("user_id", state.user?.sessionId || null)
    },[state.user])

    return (
        <UserContext.Provider value={ {user:state.user, isLoading:state.isLoading, error:state.error, dispatch} } >
            {children}
        </UserContext.Provider>
    )
}