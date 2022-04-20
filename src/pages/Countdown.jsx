import React, { useState, useEffect } from "react";
import { withRouter, useLocation, useHistory } from "react-router-dom";
import io from "socket.io-client";
import { Chat, ChatEvents } from 'twitch-js'

function Countdown(props) {
  const location = useLocation();
  console.log(location);
  const history = useHistory();
  const [basis, setBasis] = useState();
  const [timer, setTimer] = useState();
  const [timerDisp, setTimerDisp] = useState(location.state.timeSeconds);
  const [intervalId, setIntervalId] = useState();
  const [buttonShow, setButtonShow] = useState(true);
  const [socket, setSocket] = useState();
  const color = location.state.Color;
  
  const username = "justinfan20394";
  const token = "";
  const channel = location.state.ChannelName;
  console.log("channelconnected:", channel);
  
  const [lastSub, setLastSub] = useState("");
  const [lastResub, setLastResub] = useState("");
  const [lastCheer, setLastCheer] = useState("");
  const [lastSubGift, setLastSubGift] = useState("");
  const [lastSubGiftCommunity, setLastSubGiftCommunity] = useState("");

  const run = async () => {
    const chat = new Chat({
      username,
      token,
      log: { level: "warn" }
    });
  
    chat.on("SUBSCRIPTION", (message) => {
      if (message != lastSub) {
        const subPlan = message.parameters.subPlan || "";
        const userName = message.username || "";
        console.log("SUBSCRIPTION");
        console.log(`${userName} ${subPlan}`);
        setLastSub(message);
      }
    });
    chat.on("RESUBSCRIPTION", (message) => {
      if (message != lastResub) {
        const msg = message.message || "";
        const subPlan = message.parameters.subPlan || "";
        const userName = message.username || "";
        console.log("RESUBSCRIPTION");
        console.log(`${userName} ${subPlan} ${msg}`);
        setLastResub(message);
      }
    });
    chat.on("CHEER", (message) => {
      if (message != lastCheer) {
        const userName = message.username || "";
        const bits = message.bits || 0;
        console.log("CHEER");
        console.log(message);
        console.log(`${userName} ${bits}`);
        setLastCheer(message);
      }
    });
    chat.on("SUBSCRIPTION_GIFT", (message) => {
      if (message != lastSubGift) {
        const msg = message.systemMessage || "";
        console.log("SUBSCRIPTION_GIFT");
        console.log(msg);
        setLastSubGift(message);
      }
    });
    chat.on("SUBSCRIPTION_GIFT_COMMUNITY", (message) => {
      if (message != lastSubGiftCommunity) {
        const msg = message.systemMessage || "";
        console.log("SUBSCRIPTION_GIFT_COMMUNITY");
        console.log(msg);
        setLastSubGiftCommunity(message);
      }
    });
  
    await chat.connect();
    await chat.join(channel);
  };

  useEffect(() => run(),[]);

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

  }, []);

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

  // streamelements or streamlabs socket
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
          onClick={() => history.push('/')}
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
