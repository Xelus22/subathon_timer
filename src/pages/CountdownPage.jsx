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
  const [totalAdd, setTotalAdd] = useState(0);
  const [targetDate, setTargetDate] = useState(Date.now() + defaultAdditionalTime * 1000);
  const [socket, setSocket] = useState();
  const [startTime, setStartTime] = useState(targetDate);
  const color = location.state.Color;

  // implement queue to synchronously do async tasks
  const [queue, setQueue] = useState({isProcessing: false, tasks: []})

  useEffect(() => {
    // console.log(queue.tasks);
    // console.log("IM IN THE QUEUE");
    if (queue.tasks.length === 0) return
    if (queue.isProcessing) return

    const task = queue.tasks[0]
    setQueue((prev) => ({
      isProcessing: true,
      tasks: prev.tasks.slice(1),
    }))

    Promise.resolve(task)
    .then((val) => {
      console.log("before:", targetDate);
      console.log("time to add:", val);
      setTargetDate(targetDate + val);
      setTotalAdd(totalAdd + val);
    })
    .then(() => {
      console.log("check after 1:", targetDate + task);
    })
    .finally(() => {
      setQueue((prev) => ({
        isProcessing: false,
        tasks: prev.tasks,
      }))
    })
  }, [queue, queue.tasks, queue.isProcessing])

  
  const username = "justinfan20394";
  const token = "";
  const channel = location.state.ChannelName.toString().toLowerCase();
  
  const [lastSub, setLastSub] = useState("");
  const [lastResub, setLastResub] = useState("");
  const [lastCheer, setLastCheer] = useState("");
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
        console.log(`ADD: SUBSCRIPTION ${userName}`, subPlan);
        setLastSub(message);
        handleSubs(subPlan, 1);
      }
    });
    chat.on("RESUBSCRIPTION", (message) => {
      if (message != lastResub) {
        const msg = message.message || "";
        const subPlan = message.parameters.subPlan || "";
        const userName = message.username || "";
        console.log(`ADD: RESUBSCRIPTION ${userName} ${msg}`, subPlan);
        setLastResub(message);
        handleSubs(subPlan, 1);
      }
    });
    chat.on("CHEER", (message) => {
      if (message != lastCheer) {
        const userName = message.username || "";
        const bits = message.bits || 0;
        console.log(`ADD: CHEER ${userName} ${bits} bits`);
        setLastCheer(message);
        handleBits(bits);
      }
    });
    chat.on("SUBSCRIPTION_GIFT_COMMUNITY", (message) => {
      if (message != lastSubGiftCommunity) {
        const msg = message.systemMessage || "";
        const numGifts = message.parameters.massGiftCount
        const subPlan = message.parameters.subPlan || ""
        console.log("ADD: SUBSCRIPTION_GIFT_COMMUNITY",numGifts, subPlan, msg);
        setLastSubGiftCommunity(message);
        handleSubs(subPlan, numGifts);
      }
    });
  
    await chat.connect();
    await chat.join(channel);
  };

  useEffect(() => {
    console.log("channelconnected:", channel);
    console.log("initial target date check:", targetDate);
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
          setQueue(
            (prev) => ({
              isProcessing: prev.isProcessing,
              tasks: prev.tasks.concat([eventData.message[0].amount * location.state.donationsTime * 1000]),
            })
          )
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
      // setTargetDate(targetDate + location.state.bitsTime * 1000);
      setQueue(
        (prev) => ({
          isProcessing: prev.isProcessing,
          tasks: prev.tasks.concat([location.state.bitsTime * 1000]),
        })
      )
    } else {
      console.log("bits ERROR", bits);
    }
  }

  const handleSubs = (subType, subAmount) => {
    let addAmount = subAmount;
    switch (subType) {
      case "Prime":
      case "1000":
        // targetDate += subAmount * location.state.T1 * 1000;
        addAmount *= location.state.T1;
        break;
      case "2000":
        // targetDate += subAmount * location.state.T2 * 1000;
        addAmount *= location.state.T2;
        break;
      case "3000":
        // targetDate += subAmount * location.state.T3 * 1000;
        addAmount *= location.state.T3;
        break;
      default:
        console.log("error add", subType, subAmount);
        break;
      }
    if (addAmount >= 1) {
      // queue.tasks.concat(addAmount * 1000);
      setQueue(
        (prev) => ({
          isProcessing: prev.isProcessing,
          tasks: prev.tasks.concat([addAmount * 1000]),
        })
      )
      // setTargetDate(targetDate + addAmount * 1000)
    }
    console.log("check successfully added", subType, subAmount);
  }
  
  const handleStreamElementsEvents = (data) => {
    if (data.listener == "follower-latest") {
      clearInterval(intervalId);
      setQueue(
        (prev) => ({
          isProcessing: prev.isProcessing,
          tasks: prev.tasks.concat([location.state.FollowTime*1000]),
        })
      )
    } else if (data.listener == "tip-latest") {
      let amount = data.event.amount;
      setQueue(
        (prev) => ({
          isProcessing: prev.isProcessing,
          tasks: prev.tasks.concat([amount*location.state.donationsTime*1000]),
        })
      )
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
      console.log("current target check: ",targetDate, "total add:", totalAdd)
      if (startTime + totalAdd != targetDate) {
        console.log("ERROR: ", startTime + totalAdd, targetDate, "DO NOT MATCH")
      }
      // console.log(hours + days*24, minutes, seconds);
      localStorage.setItem('totalTimeSeconds', ((days * 24 + hours) * 60 + minutes) * 60 + seconds);
      return <span>{zeroPad(hours + days*24)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
    }
  };

  const handleClick=()=> {
    console.log("button pressed");
    console.log(queue);
    setQueue(
      (prev) => ({
        isProcessing: prev.isProcessing,
        tasks: prev.tasks.concat([60*1000]),
      })
    )
    console.log(queue);
  }

  const handleClickBack = () => {
    console.log(totalAdd);
    history.goBack();
  }

  return (
    <div>
      <span
          onClick={handleClickBack}
          style={{
            color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
            fontFamily: `${location.state.FontType}`,
            fontSize: `${location.state.FontSize}px`,
          }}
        >
          <Countdown
            autoStart = {true}
            date = {targetDate}
            renderer = {renderer}
          />
      </span>
      {/* <button
          className="bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring focus:ring-sky-400 active:bg-sky-700 px-4 py-2 text-xm leading-5 rounded-md font-semibold text-white"
          style={{ display: "block" }}
          onClick={handleClick}
        ></button> */}
    </div>
  );
}

export default withRouter(CountdownPage);
