import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

function App() {
  const [socketUrl] = useState("ws://localhost:8080");
  const [messageHistory, setMessageHistory] = useState([]);
  const [array, setArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  const [disableKey, setDisableKey] = useState([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  useEffect(() => {
    console.log("lastMessage", lastMessage);
    if (lastMessage !== null) {
      const jsonDataFromMessage = JSON.parse(lastMessage.data);
      if (jsonDataFromMessage.operation === "remove") {
        //parse the message value to number
        const value = parseInt(jsonDataFromMessage.value);
        setArray(() => array.filter((item) => item !== value));
      } else if (jsonDataFromMessage.operation === "add") {
        setArray(() => array.concat(jsonDataFromMessage.value));
      }
    }
  }, [lastMessage]);

  const handleClickSendMessage = useCallback(
    (e) => sendMessage(e),
    [sendMessage]
  );

  // eslint-disable-next-line no-unused-vars
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="App">
      <header className="App-header">
        {array.map((item) => (
          <button
            key={item}
            onClick={() => {
              handleClickSendMessage(item);
              setDisableKey([...disableKey, item]);
            }}
            disabled={
              readyState !== ReadyState.OPEN || disableKey.includes(item)
            }
          >
            Click me to send message {item}
          </button>
        ))}
      </header>
    </div>
  );
}

export default App;
