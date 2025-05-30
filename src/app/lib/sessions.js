'use server'
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export const CreateSession = async (user) => {
    console.log("***CREATING THE SESSION***");
    
    
    const cookieStore = await cookies()
    // console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET); // Log the secret key

    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("ACCESS_TOKEN_SECRET is not defined");
    }
    const role = user.role || null;
    const expiryDate = user.expiryDate;
    // Convert the user object into a plain object
    const payload = {
        ...user,
        _id: user._id.toString(), // Convert ObjectId to string
    };
    // console.log('Here we are logging the paylod',payload);
    
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1y" });
    const oneYearInSeconds = 60 * 60 * 24 * 365;


    cookieStore.set({
        name: 'auth',
        value: token,   
        httpOnly: true,
        path: '/',
        maxAge:oneYearInSeconds,
      })
        // Optionally, set a separate cookie for the role (not HttpOnly, can be used client-side)
    if (role) {
        // console.log('role is availabel buddy');
        
        cookieStore.set({
            name: 'role',
            value: role,
            path: '/',
            maxAge:oneYearInSeconds,
        });
    }
    if (expiryDate) {
        // console.log('expirayDate is availabel buddy');
        
        cookieStore.set({
            name: 'expiry Date',
            value: expiryDate,
            path: '/',
            maxAge:oneYearInSeconds,
        });
    }
    const response = NextResponse.json({ msg: "User has been logged in", token });
    // console.log('token has been sent');
    
    response.headers.set("Set-Cookie", `jwtoken=${token}; Path=/; HttpOnly; Max-Age=31536000`);
    // console.log(response);
    
    // return token;
    return response;
};

export const EndSession = async ()=>{
    console.log('End session');
    
    const cookieStore = await cookies()
    cookieStore.set({
        name: 'auth',
        value: '',
        httpOnly: true,
        path: '/',
        maxAge: 0 
      })
      console.log('this is working properly');
      
    return {msg:'Session has been dleted Successfully'};
}