import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { socket } from "./utils/socket";
import {
  MessagesState,
  RoomsState,
  IsConnectedState,
  ParticipantsState,
} from "./utils/atoms";
import AppRouter from "./Router/AppRouter";

function App() {
  const setMessages = useSetRecoilState(MessagesState);
  const setRooms = useSetRecoilState(RoomsState);
  const setIsConnected = useSetRecoilState(IsConnectedState);
  const setParticipants = useSetRecoilState(ParticipantsState);

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

    function onDefaultParticipants(value) {
      console.log("Default Participants : ", value);
      setParticipants([...value]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("default_messages", onDefaultMessages);
    socket.on("default_rooms", onDefaultRooms);
    socket.on("room_message", onRoomMessage);
    socket.on("default_participants", onDefaultParticipants);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("default_messages");
      socket.off("default_rooms");
      socket.off("room_message");
      socket.off("default_participants");
    };
  }, []);

  return (
    <div>
      <AppRouter />
    </div>
  );
}

export default App;
