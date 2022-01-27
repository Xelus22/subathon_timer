import React, { useState, useEffect } from 'react';
import { withRouter, useLocation, useHistory } from 'react-router-dom';
import io from 'socket.io-client';

function Countdown(props) {
    const location = useLocation();
    const history = useHistory();
    const [basis, setBasis] = useState();
    const [timer, setTimer] = useState();
    const [timerDisp, setTimerDisp] = useState(location.state.timeSeconds);
    const [intervalId, setIntervalId] = useState();
    const [buttonShow, setButtonShow] = useState(true);
    const [socket, setSocket] = useState();
    const [xelusSocket, setXelusSocket] = useState();
    const color = location.state.Color;

    let hours = Math.floor((timerDisp/ (60 * 60)));
    let minutes = Math.floor((timerDisp / 60) % 60);
    let seconds = Math.floor((timerDisp) % 60);

    useEffect(() => {
      let _intervalId;
      if (basis)
        _intervalId = setInterval(() => {
            setTimer(new Date().valueOf());
          }, 50)
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
      if(location.state.Api == "1") {
        //streamlabs
        setSocket(io(`https://sockets.streamlabs.com?token=${location.state.Token}`, {transports: ['websocket']}));
        // eslint-disable-next-line
      } else if (location.state.Api == "2") {
        setSocket(io(`https://realtime.streamelements.com`, {transports: ['websocket']}));
        // eslint-disable-next-line
      } else {
        console.log("NO TOKEN GIVEN")
      }

      // check if theres a xelus(twitch) forwarder session
      if (location.state.Sid == "" || location.state.Sau == "") {
        // no login session
      }
    }, []);
    
    if(socket) {
      console.log("socket -test1");
      if (location.state.Api == "1") {
        //streamlabs
        socket.on('connect', () => {
          console.log("connected with streamlabs");
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
      } else if (location.state.Api == "2") {
        //streamelements
        socket.on('connect', () => {
          console.log('Successfully connected to streamelements websocket');
          socket.emit('authenticate', {method: 'jwt', token: `${location.state.Token}`});
        });

        socket.on('disconnect', () => {
          console.log("disconnected from streamelements websocket");
        });

        socket.on('authenticated', (data) => {
          const {
            channelId
          } = data;
          console.log(`Successfully connected to channel ${channelId}`);
        });

        socket.on('event', (data)=> {
          console.log(data);
        });
        socket.on('event:test', (data)=> {
          console.log(data);
        });
        socket.on('event:update', (data) => {
          console.log(data);
        });
        socket.on('event:reset', (data) => {
          console.log(data);
        });
      }
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