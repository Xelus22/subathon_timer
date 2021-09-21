import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { SketchPicker } from 'react-color';

function HomePage(props) {
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
        setColor({ r: 51, g: 51, b: 51, a:100 });
        setFontSize(150);
    };

    const saveToken = (target) => {
        setSocketToken(target);
        localStorage.setItem('token', target);
    };

    useEffect(() => {
        if(localStorage.totalTimeSeconds !== undefined) {
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
    
    return (
        <div style={{ backgroundColor: 'white' }}>
            <h1> Subathon Timer - add this as a browser source to your OBS then interact with it </h1>
            <h4> Made by <a href = "https://www.twitch.tv/xelus22">Xelus22</a></h4>
            <h4> Completely client end. No reliability on bots</h4>
            <span> Hours </span>
            <input type="number" id="hours" min="0" value={startingHours} onChange={e => setStartingHours(e.target.value)}/>
            <span> Minutes </span>
            <input type="number" id="minutes" min="0" max="59" value={startingMinutes} onChange={e => setStartingMinutes(e.target.value)}/>
            <span> Seconds </span>
            <input type="number" id="Seconds" min="0" max="59" value={startingSeconds} onChange={e => setStartingSeconds(e.target.value)}/>
            <br/>

            <span> Seconds per 100 bits </span>
            <input type="number" id="Seconds" value={bitsTime} onChange={e => setBitsTime(e.target.value)}/>
            <br/>
            <span> Donations - seconds per $1 </span>
            <input type="number" id="Seconds" value={donationsTime} onChange={e => setDonationsTimes(e.target.value)}/>
            <br/>
            <span> T1 Subscription Time (seconds) </span>
            <input type="number" id="Seconds" value={T1SubsciptionTime} onChange={e => setT1SubsciptionTime(e.target.value)}/>
            <br/>
            <span> T2 Subscription Time (seconds) </span>
            <input type="number" id="Seconds" value={T2SubsciptionTime} onChange={e => setT2SubsciptionTime(e.target.value)}/>
            <br/>
            <span> T3 Subscription Time (seconds) </span>
            <input type="number" id="Seconds" value={T3SubsciptionTime} onChange={e => setT3SubsciptionTime(e.target.value)}/>
            <br/>
            <span> Streamlabs Socket API Token (MUST BE ENTERED - KEEP SECRET) </span><br/>
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
            <input type="number" value={fontSize} onChange={e => changeFont(e.target.value)}/>
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
            <button>
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
                        }
                    }}
                > To Countdown</Link>
            </button>

            
        </div>
    )
}

export default withRouter(HomePage);