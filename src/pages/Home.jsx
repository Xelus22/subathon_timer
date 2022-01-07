import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { SketchPicker } from 'react-color';

function Home(props) {
    const [startingHours, setStartingHours] = useState(5);
    const [startingMinutes, setStartingMinutes] = useState(0);
    const [startingSeconds, setStartingSeconds] = useState(0);
    const [bitsTime, setBitsTime] = useState(60);
    const [donationsTime, setDonationsTimes] = useState(60);
    const [T1SubsciptionTime, setT1SubsciptionTime] = useState(300);
    const [T2SubsciptionTime, setT2SubsciptionTime] = useState(600);
    const [T3SubsciptionTime, setT3SubsciptionTime] = useState(900);
    const [socketToken, setSocketToken] = useState(localStorage.getItem('token'));
    const [color, setColor] = useState({ r: 0, g: 0, b: 0, a:100 });
    const [fontSize, setFontSize] = useState(150);
    const [followTime, setFollowTime] = useState(0);
    
    const changeColor = (props) =>{
        console.log(props.rgb);
        setColor(props.rgb);
        localStorage.setItem('colorR', props.rgb.r);
        localStorage.setItem('colorG', props.rgb.g);
        localStorage.setItem('colorB', props.rgb.b);
        localStorage.setItem('colorA', props.rgb.a);
    };

    const changeFont = (props) =>{
        localStorage.setItem('fontSize', props);
        setFontSize(props);
    };

    const resetDefault = () =>{
        setStartingHours(5);
        setStartingMinutes(0);
        setStartingSeconds(0);
        setBitsTime(60);
        setDonationsTimes(60);
        setT1SubsciptionTime(300);
        setT2SubsciptionTime(600);
        setT3SubsciptionTime(900);
        setColor({ r: 0, g: 0, b: 0, a:100 });
        setFontSize(150);
        setFollowTime(0);
    };

    const saveToken = (target) => {
        setSocketToken(target);
        localStorage.setItem('token', target);
    };

    useEffect(() => {
        if(localStorage.totalTimeSeconds) {
            setStartingHours(Math.floor((localStorage.totalTimeSeconds/ (60 * 60))));
            setStartingMinutes(Math.floor((localStorage.totalTimeSeconds / 60) % 60));
            setStartingSeconds(Math.floor((localStorage.totalTimeSeconds) % 60));
        }

        if(localStorage.colorR !== undefined) {
            setColor({r:localStorage.colorR, g:localStorage.colorG, b:localStorage.colorB, a:localStorage.colorA});
        }

        if(localStorage.fontSize) {
            setFontSize(localStorage.fontSize);
        }
        // eslint-disable-next-line
    }, []);

    const setMinutes = (target) => {
        if (target >= 60) {
            setStartingMinutes(0);
            setStartingHours(startingHours + 1);
        } else if (target < 0 && startingHours > 0) {
            setStartingMinutes(59);
            setStartingHours(startingHours - 1);
        } else if (target < 0 && startingHours <= 0) {
            setStartingMinutes(0);
        } else {
            setStartingMinutes(target);
        }
    }

    const setSeconds = (target) => {
        console.log(target, startingHours, startingMinutes, startingSeconds);
        if (target >= 60 && startingMinutes >=59) {
            setStartingHours(startingHours + 1);
            setStartingMinutes(0);
            setStartingSeconds(0);
        } else if (target < 0 && startingMinutes <= 0 && startingHours > 0) {
            setStartingHours(startingHours - 1);
            setStartingMinutes(59);
            setStartingSeconds(59);
        } else if (target < 0 && startingMinutes > 0) {
            setStartingSeconds(59);
            setStartingMinutes(startingMinutes - 1);
        } else if (target < 0 && startingMinutes <= 0 && startingHours <= 0) {
            setStartingSeconds(0);
        } else if (target >= 60) {
            setStartingSeconds(0);
            setStartingMinutes(startingMinutes + 1);
        } else {
            setStartingSeconds(target);
        }
    }

    const submit = () => {
        localStorage.setItem('totalTimeSeconds', startingHours * 60 * 60 + startingMinutes * 60 + startingSeconds * 1);
    }
    
    return (
        <div>
            <div class = "font-sans font-bold text-2xl"> Subathon Timer - add this as a browser source to your OBS then interact with it </div>
            <h4 class = "font-sans font-bold text-xl"> Made by <a href = "https://www.twitch.tv/xelus22" class = "text-blue-800">Xelus22</a></h4>
            <h4> Completely client end. No reliability on bots</h4>
            <span> Hours: </span>
            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500 focus:ring-sky-500" type="number" id="hours" min="0" value={startingHours} onChange={e => setStartingHours(e.target.value)}/>
            <span> Minutes: </span>
            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500 focus:ring-sky-500" type="number" id="minutes" min="-1" max="60" value={startingMinutes} onChange={e => setMinutes(e.target.value)}/>
            <span> Seconds: </span>
            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500 focus:ring-sky-500" type="number" id="Seconds" min="-1" max="60" value={startingSeconds} onChange={e => setSeconds(e.target.value)}/>
            <br/>

            <span> Seconds per Follow </span>
            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500 focus:ring-sky-500" type="number" id="Seconds" value={followTime} onChange={e => setFollowTime(e.target.value)}/>
            <br/>
            <span> Seconds per 100 bits </span>
            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500 focus:ring-sky-500" type="number" id="Seconds" value={bitsTime} onChange={e => setBitsTime(e.target.value)}/>
            <br/>
            <span> Donations - seconds per $1 </span>
            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500 focus:ring-sky-500" type="number" id="Seconds" value={donationsTime} onChange={e => setDonationsTimes(e.target.value)}/>
            <br/>
            <span> T1 Subscription Time (seconds) </span>
            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500 focus:ring-sky-500" type="number" id="Seconds" value={T1SubsciptionTime} onChange={e => setT1SubsciptionTime(e.target.value)}/>
            <br/>
            <span> T2 Subscription Time (seconds) </span>
            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500 focus:ring-sky-500" type="number" id="Seconds" value={T2SubsciptionTime} onChange={e => setT2SubsciptionTime(e.target.value)}/>
            <br/>
            <span> T3 Subscription Time (seconds) </span>
            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500 focus:ring-sky-500" type="number" id="Seconds" value={T3SubsciptionTime} onChange={e => setT3SubsciptionTime(e.target.value)}/>
            <br/>
            <span class = "font-sans font-bold text-xl"> Streamlabs Socket API Token (KEEP SECRET) </span><br/>
            <span class = "font-sans font-bold text-xl"> If no token is given, defaults to just being a countdown timer </span><br/>
            <span> Streamlabs -> settings -> API tokens -> Your Socket API Token </span>
            <input type="text" id="JWT-Token" value={socketToken} onChange={e => saveToken(e.target.value)}/>
            <br/>
            <br/>
            <span> Background of timer will be invisible </span><br/>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <SketchPicker
                                color = { color }
                                onChange={ changeColor }
                            />
                        </td>
                        <td><span style={{color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`, fontSize: `${fontSize}px`}}> {startingHours > 9 ? (startingHours) :("0" + startingHours).slice(-2)}:{("0" + startingMinutes).slice(-2)}:{("0" + startingSeconds).slice(-2)} </span></td>
                    </tr>
                </tbody>
            </table>
            <br/>
            <span> Text size </span>
            <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500 focus:ring-sky-500" type="number" value={fontSize} onChange={e => changeFont(e.target.value)}/>
            <br/>
            <span>  Count down timer size and colour on next page below </span>
            <br/>
            <span> Click on the timer on the next page to come back to this screen </span>
            <br/>
            <br/>
            <button onClick={ resetDefault }> Reset all to Default </button>
            <br/>
            <br/>
            <br/>
            <button onClick={submit}>
                <Link 
                    to={{
                        pathname: '/countdown',
                        state: {
                            timeSeconds: startingHours * 60 * 60 + startingMinutes * 60 + startingSeconds * 1,
                            bitsTime: bitsTime,
                            donationsTime: donationsTime,
                            T1: T1SubsciptionTime,
                            T2: T2SubsciptionTime,
                            T3: T3SubsciptionTime,
                            Token: socketToken,
                            Color: color,
                            FontSize: fontSize,
                            FollowTime: followTime,
                        }
                    }}
                > To Countdown</Link>
            </button>

            
        </div>
    )
}

export default withRouter(Home);