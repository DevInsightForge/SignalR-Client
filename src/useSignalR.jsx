import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";

const useSignalR = ({ endpoint = "" }) => {
  const [connectionRef, setConnection] = useState();

  function createHubConnection() {
    const con = new HubConnectionBuilder()
      .withUrl(`https://localhost:44356${endpoint}`, {
        // accessTokenFactory: () => AuthService.getToken(),
        // transport: "ServerSentEvents",
      })
      .withAutomaticReconnect()
      .build();
    setConnection(con);
  }

  useEffect(() => {
    createHubConnection();
  }, []);

  useEffect(() => {
    if (connectionRef) {
      connectionRef.start();
    }

    return () => {
      connectionRef?.stop();
    };
  }, [connectionRef]);

  return connectionRef;
};

export default useSignalR;
