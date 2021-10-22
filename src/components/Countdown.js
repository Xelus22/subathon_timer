import React, { useState, useEffect } from 'react';
import { withRouter, useLocation, useHistory } from 'react-router-dom';

import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { DirectConnectionAdapter, EventSubListener } from '@twurple/eventsub';

function Countdown(props) {
    const io = require("socket.io-client");
    const location = useLocation();
    const history = useHistory();
    const [basis, setBasis] = useState();
    const [timer, setTimer] = useState();
    const [timerDisp, setTimerDisp] = useState(location.state.timeSeconds);
    const [intervalId, setIntervalId] = useState();
    const [buttonShow, setButtonShow] = useState(true);
    const [streamlabs, setStreamlabs] = useState()
    const color = location.state.Color;

    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('[error]: The "CLIENT_ID" and "CLIENT_SECRET" environment variable is required')
      process.exit(1)
  }

    const authProvider = new ClientCredentialsAuthProvider(clientId, clientSecret);
    const apiClient = new ApiClient({ authProvider });

    const adapter = new DirectConnectionAdapter({
      hostName: 'example.com',
      sslCert: {
        key: 'aaaaaaaaaaaaaaa',
        cert: 'bbbbbbbbbbbbbbb'
      }
    });
    const secret = 'thisShouldBeARandomlyGeneratedFixedString';
    
    const listener = new EventSubListener({
      apiClient,
      adapter: new NgrokAdapter(),
      secret: 'thisShouldBeARandomlyGeneratedFixedString'
    });
    await listener.listen();

    let hours = Math.floor((timerDisp/ (60 * 60)));
    let minutes = Math.floor((timerDisp / 60) % 60);
    let seconds = Math.floor((timerDisp) % 60);

    useEffect(() => {
      let _intervalId;
      if (basis)
        _intervalId = setInterval(() => {
            setTimer(new Date().valueOf());
          }, 100)
          setIntervalId(_intervalId)
        return () => {
          clearInterval(_intervalId)
        }
      }, [basis]);

    useEffect(() => {
      if (basis && timer) {
        const toDisp = Math.floor((basis - timer) / 1000)
        if (timerDisp !== toDisp) {
          setTimerDisp(toDisp)
          localStorage.setItem('totalTimeSeconds', toDisp);
        }
    }
    // eslint-disable-next-line
    }, [timer])

    useEffect(() => {
        if (timerDisp <= 0) {
            clearInterval(intervalId);
        }
        // eslint-disable-next-line
    }, [timerDisp])

    useEffect(() => {
      localStorage.setItem('totalTimeSeconds', location.state.timeSeconds);
      setStreamlabs(io(`https://sockets.streamlabs.com?token=${location.state.Token}`, {transports: ['websocket']}));
      // eslint-disable-next-line
    }, []);

    if(streamlabs) {
      streamlabs.on('event', (eventData) => {
        if (eventData.type === 'donation') {
          //code to handle donation events
          clearInterval(intervalId);
          setBasis(basis + eventData.message[0].amount * location.state.donationsTime * 1000);
        }
        if (eventData.for === 'twitch_account') {
          switch(eventData.type) {
            case 'resub':
            case 'subscription':
              //code to handle subscription event
              var add;
              switch(eventData.message[0].sub_plan) {
                case '0':
                  break;
                case '2000':
                  add = location.state.T2;
                  break;
                case '3000':
                  add = location.state.T3;
                  break;
                default:
                  add = location.state.T1;
                  break;
              }
              var s = (basis + add * 1000);
              clearInterval(intervalId);
              setBasis(s);
              break;
            case 'bits':
              var time = Math.floor(eventData.message[0].amount * location.state.bitsTime / 100);
              setBasis(basis + time * 1000);
              break;
            case 'follow':
              setBasis(basis + location.state.FollowTime * 1000);
              break;
            default:
              //default case
              //console.log(eventData.message);
          }
        }
      });
    }

    const handleClick = () => {
        var t = new Date();
        t.setSeconds(t.getSeconds() + location.state.timeSeconds);
        setBasis(t.valueOf());
        setButtonShow(false);
    }

    return ( 
        <div>
            { timerDisp > 0 ?
                <span onClick ={() => history.goBack()} 
                  style={{color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`, fontSize:`${location.state.FontSize}px`}}>
                    {hours > 9 ? (hours) :("0" + hours).slice(-2)}:{("0" + minutes).slice(-2)}:{("0" + seconds).slice(-2)}
                </span>
                :
                <span style={{color: `${location.state.Color}`, fontSize:`${location.state.FontSize}px`}}>TIME'S UP</span>
            }
            
            { buttonShow ? <button style={{display:"block"}} onClick = {handleClick}>Start Timer</button> : <br></br>}
        </div>
    )
}

export default withRouter(Countdown);