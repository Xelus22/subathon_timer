import React, { useState, useEffect } from "react";
import { withRouter, useLocation, useHistory } from "react-router-dom";
import io from "socket.io-client";

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

  let hours = Math.floor(timerDisp / (60 * 60));
  let minutes = Math.floor((timerDisp / 60) % 60);
  let seconds = Math.floor(timerDisp % 60);

  useEffect(() => {
    let _intervalId;
    if (basis)
      _intervalId = setInterval(() => {
        setTimer(new Date().valueOf());
      }, 10);
    setIntervalId(_intervalId);
    return () => {
      clearInterval(_intervalId);
    };
  }, [basis]);

  useEffect(() => {
    if (basis && timer) {
      const toDisp = Math.floor((basis - timer) / 1000);
      if (timerDisp !== toDisp) {
        setTimerDisp(toDisp);
        localStorage.setItem("totalTimeSeconds", toDisp);
      }
    }
    // eslint-disable-next-line
  }, [timer]);

  useEffect(() => {
    if (timerDisp <= 0) {
      clearInterval(intervalId);
    }
    // eslint-disable-next-line
  }, [timerDisp]);

  useEffect(() => {
    localStorage.setItem("totalTimeSeconds", location.state.timeSeconds);
    if (location.state.Token == "" || location.state.Api == "0") {
      console.log("NO STREAMLABS/STREAMELEMENTS TOKEN GIVEN");
    } else if (location.state.Api == "1") {
      //streamlabs
      setSocket(
        io(`https://sockets.streamlabs.com?token=${location.state.Token}`, {
          transports: ["websocket"],
        })
      );
      // eslint-disable-next-line
    } else if (location.state.Api == "2") {
      setSocket(
        io(`https://realtime.streamelements.com`, { transports: ["websocket"] })
      );
      // eslint-disable-next-line
    }

    // check if theres a xelus(twitch) forwarder session
    if (location.state.Sid == "" || location.state.Sau == "") {
      // no login session
      console.log("no xelus proxy websocket");
    } else {
      setXelusSocket(io(`wss://xelus.me/ws`), {
        transports: ["websocket"],
        extraHeaders: {
          "x-session-id": `${location.state.Sid}`,
          "x-session-secret": `${location.state.Sau}`,
        },
      });
    }
  }, []);

  // initialise xelus propxy websocket
  if (xelusSocket) {
    xelusSocket.on("connect", () => {
      console.log("connected with xelus proxy forwarder");
      xelusSocket.emit("authenticate", {
        "sessionId":location.state.Sid,
        "sessionSecret":location.state.Sau
      })
      console.log(socket.connected); // true
    });

    xelusSocket.on("disconnect", () => {
      console.log("disconnected from xelus proxy forwarder");
    });
    
    xelusSocket.on("event", (data) => {
      console.log("event data");
      console.log(data);
    });

    xelusSocket.on("authenticated", (data) => {
      const { status } = data;
      console.log(`Status: ${status}`);
    });
  }

  if (socket) {
    if (location.state.Api == "1") {
      //streamlabs
      socket.on("connect", () => {
        console.log("connected with streamlabs");
        console.log(socket.connected); // true
      });

      socket.on("event", (eventData) => {
        if (eventData.type === "donation") {
          //code to handle donation events
          clearInterval(intervalId);
          setBasis(
            basis +
              eventData.message[0].amount * location.state.donationsTime * 1000
          );
        }
        if (eventData.for === "twitch_account") {
          if (eventData.type == "follow") {
            setBasis(basis + location.state.FollowTime * 1000);
          } else if ((eventData.type == "resub" || eventData.type == "subscription") && !xelusSocket) {
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
          } else if (eventData.type == "bits" && !xelusSocket) {
            var time = Math.floor(eventData.message[0].amount * location.state.bitsTime / 100);
            setBasis(basis + time * 1000);
          }
        }
      });
    } else if (location.state.Api == "2") {
      //streamelements
      socket.on("connect", () => {
        console.log("Successfully connected to streamelements websocket");
        socket.emit("authenticate", {
          method: "jwt",
          token: `${location.state.Token}`,
        });
      });

      socket.on("disconnect", () => {
        console.log("disconnected from streamelements websocket");
      });

      socket.on("authenticated", (data) => {
        const { channelId } = data;
        console.log(`Successfully connected to channel ${channelId}`);
      });

      socket.on("event", (data) => {
        handleStreamElementsEvents(data);
      });

      socket.on("event:test", (data) => {
        handleStreamElementsEvents(data);
      });
    };
  };

  const handleStreamElementsEvents = (data) => {
    if (data.listener == "follower-latest") {
      clearInterval(intervalId);
      setBasis(basis + location.state.FollowTime * 1000);
    } else if (data.listener == "subscriber-latest" && !xelusSocket) {
      // dont run this if xelusSocket for subs is running
      // console.log("added time sub - streamelements");
      // let amount = data.event.amount;
      let amount = 1;
      // console.log(amount);
      if (data.listener.tier == 2000) {
        clearInterval(intervalId);
        setBasis(basis + location.state.T2 * amount * 1000);
      } else if (data.listener.tier == 3000) {
        clearInterval(intervalId);
        setBasis(basis + location.state.T3 * amount * 1000);
      } else {
        //prime && T1
        clearInterval(intervalId);
        setBasis(basis + location.state.T1 * amount * 1000);
      }
    } else if (data.listener == "cheer-latest" && !xelusSocket) {
      // console.log(data);
      let amount = data.event.amount;
      var time = Math.floor(amount * location.state.bitsTime / 100);
      setBasis(basis + time * 1000);
    } else if (data.listener == "tip-latest") {
      let amount = data.event.amount;
      setBasis(basis + amount * location.state.donationsTime * 1000);
    }
  };

  const handleClick = () => {
    var t = new Date();
    t.setSeconds(t.getSeconds() + location.state.timeSeconds);
    setBasis(t.valueOf());
    setButtonShow(false);
  };

  return (
    <div>
      {timerDisp > 0 ? (
        <span
          onClick={() => history.goBack()}
          style={{
            color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
            fontFamily: `${location.state.FontType}`,
            fontSize: `${location.state.FontSize}px`,
          }}
        >
          {hours > 9 ? hours : ("0" + hours).slice(-2)}:
          {("0" + minutes).slice(-2)}:{("0" + seconds).slice(-2)}
        </span>
      ) : (
        <span
          style={{
            color: `${location.state.Color}`,
            fontSize: `${location.state.FontSize}px`,
          }}
        >
          TIME'S UP
        </span>
      )}

      {buttonShow ? (
        <button
          className="bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring focus:ring-sky-400 active:bg-sky-700 px-4 py-2 text-xm leading-5 rounded-md font-semibold text-white"
          style={{ display: "block" }}
          onClick={handleClick}
        >
          Start Timer
        </button>
      ) : (
        <br></br>
      )}
    </div>
  );
}

export default withRouter(Countdown);
