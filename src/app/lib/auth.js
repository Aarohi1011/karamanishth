'use server'
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


import jwt from 'jsonwebtoken';
export const auth = async()=>{
    console.log('auth is running ');
    const cookiestore = await cookies();
    const token = cookiestore.get('auth');
    console.log('I am logging the token from the auth',token);
    try {
        
        
        if (!token) {
            console.log('idhar kaise aayega re vo ')
            const error_message = 'No Token'
            return error_message;
        }
        const value = token.value
        const decoded = jwt.verify(value, process.env.ACCESS_TOKEN_SECRET);
        // console.log('This is the decoding log',decoded);
        
        const user  = decoded._doc; 
        // console.log('I am logging the detail of the user from the auth',user);
        
        return user;
       
 
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            success: false,
               msg: 'Error'
           },{ status : 400});
    }


}
