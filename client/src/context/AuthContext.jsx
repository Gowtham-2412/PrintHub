import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import api from "../services/AxiosSetup";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const storedUser = localStorage.getItem('user');
        if(storedUser) {
            setUser(JSON.parse(storedUser))
        }
        setLoading(false);
    }, [])

    const login = async (email, password) => {
        const { data }= await api.post('/auth/login', { email, password });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    }
    const register = async (userData) => {
        const { data }= await api.post('/auth/register', userData);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        return data;
    }
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out succesfully')
    }

    return (
        <AuthContext.Provider value={{user, login, register, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )

}