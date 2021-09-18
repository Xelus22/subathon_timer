import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';

function HomePage(props) {
    const [totalTimeSeconds, setTotalTimeSeconds] = useState(0);
    const [startingHours, setStartingHours] = useState(0);
    const [startingMinutes, setStartingMinutes] = useState(0);
    const [startingSeconds, setStartingSeconds] = useState(0);
    const [bitsTime, setBitsTime] = useState(0);
    const [donationsTime, setDonationsTimes] = useState(0);
    const [T1SubsciptionTime, setT1SubsciptionTime] = useState(0);
    const [T2SubsciptionTime, setT2SubsciptionTime] = useState(0);
    const [T3SubsciptionTime, setT3SubsciptionTime] = useState(0);
    const [socketToken, setSocketToken] = useState("");

    const handleClick = (e) => {
        //...
        let totalTime = startingHours * 60 * 60 + startingMinutes * 60 + startingSeconds * 1;
        setTotalTimeSeconds(totalTime);
        console.log('Time: ', startingHours, startingMinutes, startingSeconds);  
        console.log('bits Time: ', bitsTime);
        console.log('dono Time: ', donationsTime);
        console.log('t1 Time: ', T1SubsciptionTime);
        console.log('t2 Time: ', T2SubsciptionTime);
        console.log('t3 Time: ', T3SubsciptionTime);
    }


    return (
        <div>
            <h1> hi </h1>
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
            <span> Streamlabs Socket API Token (MUST BE ENTERED) </span>
            <input required type="text" id="JWT-Token" value={socketToken} onChange={e => setSocketToken(e.target.value)}/>

            <br/>
            <br/>
            <button onClick={handleClick}>
                Submit
            </button>

            <Link 
                to={{
                    pathname: '/countdown',
                    state: {
                        timeSeconds: totalTimeSeconds,
                        bitsTime: bitsTime,
                        donationsTime: donationsTime,
                        T1: T1SubsciptionTime,
                        T2: T2SubsciptionTime,
                        T3: T3SubsciptionTime,
                        Token: socketToken,
                    }
                }}
            > To Countdown</Link>
        </div>
    )
}

export default withRouter(HomePage);