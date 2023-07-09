import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "./App.css";
import useSignalR from "./useSignalR";

function App() {
  const [messages, setMessages] = useState([]);
  const [serverTime, setServerTime] = useState(new Date());
  const notifyConn = useSignalR({ endpoint: "/notification" });
  const dateTimeConn = useSignalR({ endpoint: "/dateTime" });
  const notify = (notification) => toast(notification);

  useEffect(() => {
    notifyConn?.on("ReceiveNotification", (notification) => {
      setMessages((prev) => [...prev, notification]);
      notify(notification);
    });
  }, [notifyConn]);

  useEffect(() => {
    dateTimeConn?.on("ReceiveDateTime", (serverTime) => {
      setServerTime(serverTime);
    });
  }, [dateTimeConn]);

  const inputRef = useRef();

  const handleSubmit = () => {
    console.log(inputRef.current.value);
    const msg = inputRef.current.value;
    inputRef.current.value = "";

    notifyConn.invoke("SendNotification", msg);
  };

  return (
    <>
      <h4>Events From Server</h4>
      <h6>Current Time in Server: {new Date(serverTime).toLocaleString()}</h6>
      <div>
        <input type="text" ref={inputRef} />
        <button onClick={handleSubmit}>Submit</button>
        <p>Messages</p>
        {messages?.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </>
  );
}

export default App;
