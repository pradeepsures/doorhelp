//  import React, { useState,useContext } from "react";
//  import AuthContext from "./AuthContext";
//  import axios from "axios";
//  const Usercontextprovider=({children})=>{
//     const [user,setuser]=useState(()=>{
//       try {
//         const token = localStorage.getItem('token');
//         return { token: token ? JSON.parse(token) : null };
//       } catch (error) {
//         console.error('Error reading token from localStorage:', error);
//         return { token: null };
//       }
//     });
  
//     const login = async ({ username, password }) => {
//       try {
//         const response = await axios.post('https://dummyjson.com/auth/login', {
//           username,
//           password,
        
//         });
  
//         const token = response.data.
//         accessToken
//         ; // Adjust this if your API returns `accessToken` instead
//         localStorage.setItem('token', JSON.stringify(token));
//         setuser({ token });
//         return { success: true, data: response.data };
//       } catch (error) {
//         console.error('Login failed:', error);
//         return { success: false, error };
//       }
//     };

//   return(
//     <AuthContext.Provider value={{login,user,setuser}}>  
//     {children}
//     </AuthContext.Provider>
//   )

//  } 
//  export default Usercontextprovider;
//  export const useAuth = () => useContext(AuthContext);