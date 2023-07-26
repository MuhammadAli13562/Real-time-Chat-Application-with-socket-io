import "../styles/custom.css";
import { RoomsState, SelectedUserState } from "../utils/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";

export default function ChatSelector() {
  console.log("at top of ChatSelector");
  const Rooms = useRecoilValue(RoomsState);
  const setselectedUser = useSetRecoilState(SelectedUserState);

  console.log("ROOMS AT SELECTOR : ", Rooms);
  return (
    <div className="chat-selector-wrapper">
      {Rooms.map((friend) => {
        return (
          <button
            className="chat-selector-button"
            onClick={() => setselectedUser(friend)}
          >
            {friend}
          </button>
        );
      })}
    </div>
  );
}
