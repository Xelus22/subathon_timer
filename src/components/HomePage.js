import React, { useState } from 'react';
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
    const [color, setColor] = useState("#000000");
    const [fontSize, setFontSize] = useState(150);
    
    const changeSpy = (props) =>{
        console.dir(props.hex);
        setColor(props.hex);
    };

    const saveToken = (target) => {
        setSocketToken(target);
        localStorage.setItem('token', target);
    };
    
    return (
        <div style={{ backgroundColor: 'white' }}>
            <h1> Subathon Timer - add this as a browser source to your OBS then interact with it </h1>
            <h4> Made by <a href = "https://www.twitch.tv/xelus22">Xelus22</a></h4>
            <span> Hours </span>
            <input type="number" id="hours" value={startingHours} onChange={e => setStartingHours(e.target.value)}/>
            <span> Minutes </span>
            <input type="number" id="minutes" value={startingMinutes} onChange={e => setStartingMinutes(e.target.value)}/>
            <span> Seconds </span>
            <input type="number" id="Seconds" value={startingSeconds} onChange={e => setStartingSeconds(e.target.value)}/>
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
                                onChange={ changeSpy }
                            />
                        </td>
                        <td><span style={{color: color, fontSize: `${fontSize}px`}}> {("0" + startingHours).slice(-2)}:{("0" + startingMinutes).slice(-2)}:{("0" + startingSeconds).slice(-2)} </span></td>
                    </tr>
                </tbody>
            </table>
            <br/>
            <span> Text size </span>
            <input type="number" value={fontSize} onChange={e => setFontSize(e.target.value)}/>
            <br/>
            <span>  Count down timer size and colour on next page below </span>
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