import React, { useState, useEffect } from 'react';
import { Link, withRouter, useLocation } from 'react-router-dom';
import queryString from 'query-string'
import { SketchPicker } from 'react-color';
import FontPicker from 'font-picker-react';

function Login() {
   
    return (
        <div className="bg-white px-4">
            <div className = "font-sans font-bold text-2xl"> Subathon Timer </div>
            <h4 className = "font-sans font-bold text-xl"> Made by <a href = "https://www.twitch.tv/xelus22" className = "text-blue-800">Xelus22</a></h4>
            <h3> Add this as a browser source to your OBS then interact with it </h3>
            <h3> Please login and authorize usage of twitch for the most reliable service</h3>
            
            { /* beta */ }
            {/* <a href= "https://xelus.me/login">  */}
            <a href= "#"> 
                <button className="bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring focus:ring-sky-400 active:bg-sky-700 px-4 py-2 text-xm leading-5 rounded-md font-semibold text-white"> Login - Disabled For Now</button> 
            </a>
            <br/>
            <h2>Rely on only streamlabs or streamelements API</h2>
            <button disabled="true" className="bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring focus:ring-sky-400 active:bg-sky-700 px-4 py-2 text-xm leading-5 rounded-md font-semibold text-white"> 
                <Link
                    to={{
                        pathname: '/home',
                    }}
                > No login </Link> 
            </button> 
        </div>
    )
}

export default withRouter(Login);