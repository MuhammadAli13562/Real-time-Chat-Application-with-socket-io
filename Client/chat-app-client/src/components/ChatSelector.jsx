import "../styles/custom.css";
import { RoomsState, SelectedUserState } from "../utils/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Image from "../assets/chatselector.svg";
import { JoinRoom } from "./JoinRoom";

export default function ChatSelector() {
  const Rooms = useRecoilValue(RoomsState);
  const setselectedUser = useSetRecoilState(SelectedUserState);

  console.log("ROOMS AT SELECTOR : ", Rooms);
  return (
    <div className="chat-selector-wrapper">
      <div className="chat-selector-header">Chat Groups</div>
      <div className="selector-buttons-wrapper">
        {Rooms.map((friend) => {
          return (
            <div className="chat-selector-inner-wrapper">
              <div className="image-wrapper">
                <img className="chat-selector-image" src={Image} />
              </div>
              <button
                className="chat-selector-button"
                onClick={() => setselectedUser(friend)}
              >
                <div className="chat-selector-button-inner">
                  <div className="button-inner-header">{friend}</div>
                  <div className="button-inner-content">....</div>
                </div>
              </button>
            </div>
          );
        })}
      </div>
      <div className="chat-selector-header">Join Room</div>
      <JoinRoom />
    </div>
  );
}
