import React, { useState, useEffect } from 'react';
import { Link, withRouter, useLocation } from 'react-router-dom';
import Collapsible from 'react-collapsible'
import ScrollButton from '../components/ScrollToTop';
//css
import "../css/collapsible.css"
//images
import browser_source_image from '../images/browser_source_properties.png'
import interact_image from '../images/interact_image.jpg'
import interact_window from '../images/interact_window.png'
import configuration_window from '../images/configuration_window.png'
import streamelements_token from '../images/streamelements_token.png'
import streamlabs_token from '../images/streamlabs_token.png'
import post_config from '../images/post_config.png'
import streamelements_test from '../images/streamelements_test.png'
import streamlabs_test from '../images/streamlabs_test.png'

function Login() {
    return (
        <div className="bg-white px-4">
            <div className = "font-sans font-bold text-2xl"> Subathon Timer </div>
            <h4 className = "font-sans font-bold text-xl"> Made by <a href = "https://www.twitch.tv/xelus22" className = "text-blue-800">Xelus22</a></h4>
            <h3> Add this as a browser source to your OBS then interact with it </h3>
            {/* <h3> Please login and authorize usage of twitch for the most reliable service</h3> */}
            
            <br/>
            <button className="bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring focus:ring-sky-400 active:bg-sky-700 px-4 py-2 text-xm leading-5 rounded-md font-semibold text-white"> 
                <Link
                    to={'/home'}
                    > Start </Link> 
            </button> 

            <br/>
            <br/>
            <Collapsible className='w-1/2' trigger="HOW TO USE">
            <p className='font-bold'>
                Follow this side-by-side with your OBS/SLOBS.
            </p>
            <p>
                You can use this website to test configuration, however please copy this URL into your OBS as a starting point.
                <br/>
                Start by creating a new <span className = "font-bold">browser source.</span>
                <ul className='list-disc list-inside'>
                    <li>
                        <span className='font-bold'>Most importantly, un-tick "shutdown source" and "refresh browser"</span>
                    </li>
                    <li>
                        Make the width and height the same as your monitor resolution.
                    </li>
                </ul>
            </p>
            <img className="w-1/2" src = {browser_source_image}></img>
            <p>Now right click on source or box on your stream and click on <span className='font-bold'>interact</span>.</p>
            <img src = {interact_image}></img>
            <br/>
            <p>It should now look like this below.</p>
            <p>Now click on <span className='font-bold'>start</span></p>
            <img src = {interact_window}></img>
            <br/>
            <p>Now click on <span className='font-bold'>start</span></p>
            <img src = {configuration_window}></img>
            <br/>
            <p>
                Add in your channel name (for subs and bits) and pick your preferred provider for <span className='font-bold'>Donations and Follows</span>.
                <br/>
                <span className='font-bold'>REMEMBER TO NEVER SHOW THIS TO ANYONE.</span>
                <ul className='list-disc list-inside'>
                    <li>
                        Streamlabs:
                        <p>
                            Settings -> API Settings -> API Tokens -> Your Socket API Token
                        </p>
                        <img src = {streamlabs_token}></img>
                    </li>
                    <li>
                        StreamElements:
                        <p>
                            Your profile icon in the top right -> profile icon again -> show secrets -> JWT Token
                        </p>
                        <img src = {streamelements_token}></img>
                    </li>
                </ul>
            </p>
            <p>
                Now play with your colours, font and text size (make it bigger than u need so that you can make it smaller in OBS)
            </p>
            <img src = {post_config}></img>
            <p>
                Now you should be good to go! Timer starts immediately! You can close the interact window.
            </p>
            <p>
                If you need to test, you can use StreamElements or StreamLabs to test donations/follows.
            </p>
            <img className='w-1/3 inline-block' src = {streamelements_test}></img>
            <img className='w-1/2 inline-block' src = {streamlabs_test}></img>
            <br/>
            <br/>
            <p>
                If you need to go back to edit or change anything, interact with the window <br/>
                and <span className='font-bold'>click on the numbers itself</span>. It will bring you back out to configuration.
            </p>

            <p><span className='font-bold'>ENJOY!</span></p>
            <ScrollButton/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            </Collapsible>
        </div>
    )
}

export default withRouter(Login);