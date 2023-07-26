import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { socket } from "./utils/socket";
import { MessagesState, RoomsState, IsConnectedState } from "./utils/atoms";
import AppRouter from "./Router/AppRouter";

function App() {
  const setMessages = useSetRecoilState(MessagesState);
  const setRooms = useSetRecoilState(RoomsState);
  const setIsConnected = useSetRecoilState(IsConnectedState);

  useEffect(() => {
    console.log("at top of useEffect Socket io");

    function onConnect() {
      console.log("socket connected now");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("socket disconnected now");
      setIsConnected(false);
    }

    function onDefaultMessages(value) {
      console.log("Default Message Received : ", value);
      setMessages([...value]);
    }

    function onDefaultRooms(value) {
      console.log("Default Rooms Received : ", value);
      setRooms([...value]);
    }

    function onRoomMessage(value) {
      console.log("Room-message Received : ", value);
      setMessages((previous) => [...previous, value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("default_messages", onDefaultMessages);
    socket.on("default_rooms", onDefaultRooms);
    socket.on("room_message", onRoomMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("default_messages");
      socket.off("default_rooms");
      socket.off("room_message");
    };
  }, []);

  return (
    <div>
      <AppRouter />
    </div>
  );
}

export default App;
