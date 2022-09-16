import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";

function App() {

  const [currentMessage, setCurrentMessage] = useState("");
  const [chats, setChats] = useState(['first hardcoded message'])

  useEffect(() => {
    window.ActionCable.onopen = () => {
      subscribeToChatChannel()
    }

    window.ActionCable.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "ping") { return; } // Ignores webhook pings.
      if (!data?.identifier) {return; }

      const identifier = JSON.parse(data.identifier)

      if (identifier?.channel !== "ChatChannel") {return; }
      if (data?.message?.action !== 'speak') { return; }
      if (!data?.message.hasOwnProperty('content')) { return;}

      const content = data.message.content;

      setChats(prevState => [...prevState, content.toString()])

    }
  }, [])


  function subscribeToChatChannel() {
    const id_test = { channel: 'ChatChannel' };
    const stream_id = {
      command: 'subscribe',
      identifier: JSON.stringify(id_test),
    }
    window.ActionCable.send(JSON.stringify(stream_id));
  }

  function sendMessage(message) {
    const id_test = { channel: 'ChatChannel' };
    const stream_id = {
      command: 'message',
      identifier: JSON.stringify(id_test),
      data: JSON.stringify({action: "speak",  content: `${message}`})
    }
    window.ActionCable.send(JSON.stringify(stream_id));
  }

  function formSubmitHandler(event) {
    event.preventDefault();
    sendMessage(currentMessage)
    setCurrentMessage("")
  }

  return (
    <div className="App">
      <form onSubmit={formSubmitHandler}>
        <input value={currentMessage} onChange={(event) => setCurrentMessage(event.target.value)} />
        <button type="submit">Click</button>
      </form>

      <div>
        {chats.map((chat, index) => <p key={index}>{chat}</p>)}
      </div>
    </div>
  );
}

export default App;
