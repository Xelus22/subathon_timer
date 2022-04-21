import React, { useState, useEffect } from "react";
import { withRouter, useLocation, useHistory } from "react-router-dom";
import io from "socket.io-client"
import { Chat, ChatEvents } from 'twitch-js'
import Countdown, {zeroPad} from 'react-countdown'

function CountdownPage(props) {
  const location = useLocation();
  const history = useHistory();
  let defaultAdditionalTime;
  if (localStorage.totalTimeSeconds) {
    defaultAdditionalTime = localStorage.totalTimeSeconds
  } else {
    defaultAdditionalTime = location.state.timeSeconds
  }
  const [targetDate, setTargetDate] = useState(Date.now() + defaultAdditionalTime * 1000);
  const [socket, setSocket] = useState();
  const color = location.state.Color;
  
  const username = "justinfan20394";
  const token = "";
  const channel = location.state.ChannelName;
  
  const [lastSub, setLastSub] = useState("");
  const [lastResub, setLastResub] = useState("");
  const [lastCheer, setLastCheer] = useState("");
  // const [lastSubGift, setLastSubGift] = useState("");
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
        console.log(`${userName}`, subPlan);
        setLastSub(message);
        handleSubs(subPlan, 1);
      }
    });
    chat.on("RESUBSCRIPTION", (message) => {
      if (message != lastResub) {
        const msg = message.message || "";
        const subPlan = message.parameters.subPlan || "";
        const userName = message.username || "";
        console.log("RESUBSCRIPTION");
        console.log(`${userName} ${msg}`, subPlan);
        setLastResub(message);
        handleSubs(subPlan, 1);
      }
    });
    chat.on("CHEER", (message) => {
      if (message != lastCheer) {
        const userName = message.username || "";
        const bits = message.bits || 0;
        console.log("CHEER");
        console.log(message);
        console.log(`${userName} ${bits} bits`);
        setLastCheer(message);
        handleBits(bits);
      }
    });
    // chat.on("SUBSCRIPTION_GIFT", (message) => {
    //   if (message != lastSubGift) {
    //     const msg = message.systemMessage || "";
    //     console.log("SUBSCRIPTION_GIFT");
    //     console.log(msg);
    //     setLastSubGift(message);
    //   }
    // });
    chat.on("SUBSCRIPTION_GIFT_COMMUNITY", (message) => {
      if (message != lastSubGiftCommunity) {
        const msg = message.systemMessage || "";
        const numGifts = message.parameters.massGiftCount
        const subPlan = message.parameters.subPlan || ""
        console.log("SUBSCRIPTION_GIFT_COMMUNITY");
        console.log(numGifts, subPlan, msg);
        setLastSubGiftCommunity(message);
        handleSubs(subPlan, numGifts);
      }
    });
  
    await chat.connect();
    await chat.join(channel);
  };

  useEffect(() => {
    console.log("channelconnected:", channel);
    // set target Date
    // console.log("new target", new Date(targetDate).toUTCString())
    run();
  },[]);

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
          setTargetDate(targetDate + eventData.message[0].amount * location.state.donationsTime * 1000);
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

  const handleBits = (bits) => {
    if (bits > 0) {
      setTargetDate(targetDate + location.state.bitsTime * 1000);
    } else {
      console.log("bits ERROR", bits);
    }
  }

  const handleSubs = (subType, subAmount) => {
    console.log("prev targetDate:", targetDate);
    switch (subType) {
      case "Prime":
      case "1000":
        // targetDate += subAmount * location.state.T1 * 1000;
        setTargetDate(targetDate + subAmount * location.state.T1 * 1000);
        break;
      case "2000":
        // targetDate += subAmount * location.state.T2 * 1000;
        setTargetDate(targetDate + subAmount * location.state.T2 * 1000);
        break;
      case "3000":
        // targetDate += subAmount * location.state.T3 * 1000;
        setTargetDate(targetDate + subAmount * location.state.T3 * 1000);
        break;
      default:
        console.log("error", subType, subAmount);
        break;
      }
    console.log("successfully added", subType, subAmount);
    console.log("new targetDate:", targetDate);
    //console.log(new Date(targetDate).toUTCString())
  }
  
  const handleStreamElementsEvents = (data) => {
    if (data.listener == "follower-latest") {
      clearInterval(intervalId);
      // targetDate += location.state.FollowTime * 1000;
      setTargetDate(targetDate + location.state.FollowTime * 1000);
    } else if (data.listener == "tip-latest") {
      let amount = data.event.amount;
      // targetDate += amount * location.state.donationsTime * 1000;
      setTargetDate(targetDate + amount * location.state.donationsTime * 1000);
    }
  };

  const Completionist = () => <span style={{color: `${location.state.Color}`,fontSize: `${location.state.FontSize}px`,}}>TIME'S UP</span>;
  
  // Renderer callback with condition
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <Completionist />;
    } else {
      // Render a countdown
      //console.log(new Date(targetDate).toUTCString())
      console.log(targetDate)
      localStorage.setItem('totalTimeSeconds', ((days * 24 + hours) * 60 + minutes) * 60 + seconds);
      return <span>{zeroPad(hours + days*24)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
    }
  };

  return (
    <div>
      <span
          onClick={() => history.goBack()}
          style={{
            color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
            fontFamily: `${location.state.FontType}`,
            fontSize: `${location.state.FontSize}px`,
          }}
        >
          <Countdown
            autoStart = {true}
            key = {targetDate}
            date = {targetDate}
            renderer = {renderer}
          />
      </span>
    </div>
  );
}

export default withRouter(CountdownPage);
