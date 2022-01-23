import React, { useState, useEffect } from 'react';
import { withRouter, useLocation, useHistory } from 'react-router-dom';
import io from 'socket.io-client';

import { PubSubClient } from '@twurple/pubsub';
import { RefreshingAuthProvider, StaticAuthProvider } from '@twurple/auth';

function Countdown(props) {
    const location = useLocation();
    const history = useHistory();
    const [basis, setBasis] = useState();
    const [timer, setTimer] = useState();
    const [timerDisp, setTimerDisp] = useState(location.state.timeSeconds);
    const [intervalId, setIntervalId] = useState();
    const [buttonShow, setButtonShow] = useState(true);
    const [socket, setSocket] = useState();
    const color = location.state.Color;
    
    const [accessToken, setAccessToken] = useState("INITIAL_ACCESS_TOKEN");
    const [refreshToken, setRefreshToken] = useState("INITIAL_REFRESH_TOKEN");
    const [expiresIn, setExpiresIn] = useState(0);
    const [obtainmentTimestamp, setObtainmentTimestamp] = useState(0);
    
    const pubSubClient = new PubSubClient();

    const clientId = import.meta.env.VITE_TWITCH_CLIENT_ID
    const clientSecret = import.meta.env.VITE_TWITCH_CLIENT_SECRET;
    console.log(clientSecret);

    const authProvider = new RefreshingAuthProvider(
      {
        clientId,
        clientSecret,
        onRefresh: async newTokenData => {
          setAccessToken(newTokenData.accessToken);
          setRefreshToken(newTokenData.refreshToken);
          setExpiresIn(newTokenData.expiresIn);
          setObtainmentTimestamp(newTokenData.obtainmentTimestamp);
        }
      },
      { accessToken, refreshToken, expiresIn, obtainmentTimestamp }
    );

    // useEffect(() => {
    //   pubSubClient.registerUserListener(authProvider).then(uid => setUserId(uid));
    // }, [userId]);

    // useEffect(() => {
    //   console.log("test");
    //   console.log(userId);
    //   pubSubClient.onSubscription(userId, (message) => {
    //     console.log(`${message.userDisplayName} just subscribed!`);
    //   }).then(listener => setListener(listener));
    // }, [listener]);

    // hack to use async effect functions without React complaining
    function useAsyncEffect(fn, dependencies) {
      useEffect(() => void fn(), dependencies);
    }
    // ...
    useAsyncEffect(async () => {
      const userId = await pubSubClient.registerUserListener(authProvider);
      setListener(await pubSubClient.onSubscription(userId, (message) => {
        console.log(`${message.userDisplayName} just subscribed!`);
      }));
    }, []);

    let hours = Math.floor((timerDisp/ (60 * 60)));
    let minutes = Math.floor((timerDisp / 60) % 60);
    let seconds = Math.floor((timerDisp) % 60);

    useEffect(() => {
      let _intervalId;
      if (basis)
        _intervalId = setInterval(() => {
            setTimer(new Date().valueOf());
          }, 10)
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
      setSocket(io(`https://sockets.streamlabs.com?token=${location.state.Token}`, {transports: ['websocket']}));
      // eslint-disable-next-line
    }, []);
    
    if(socket) {
      socket.on('connect', () => {
        console.log(socket.connected); // true
      });

      socket.on('event', (eventData) => {
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
                  style={{color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`, fontFamily:`${location.state.FontType}` , fontSize:`${location.state.FontSize}px`}}>
                    {hours > 9 ? (hours) :("0" + hours).slice(-2)}:{("0" + minutes).slice(-2)}:{("0" + seconds).slice(-2)}
                </span>
                :
                <span style={{color: `${location.state.Color}`, fontSize:`${location.state.FontSize}px`}}>TIME'S UP</span>
            }
            
            { buttonShow ? <button className="bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring focus:ring-sky-400 active:bg-sky-700 px-4 py-2 text-xm leading-5 rounded-md font-semibold text-white" style={{display:"block"}} onClick = {handleClick}>Start Timer</button> : <br></br>}
        </div>
    )
}

export default withRouter(Countdown);