import { useRef, useState } from "react";
import QuestionTimer from "./QuestionTimer";

interface HeaderProps {
  title: string;
  user: any;
  showTimer: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, user, showTimer }) => {
  return (
    <div className="flex flex-row justify-between items-center px-4 md:px-8 py-4 border-b border-gray-700">
      <div className="flex flex-col">
        <h1 className="font-bold text-gray-300">{title}</h1>
      </div>
      <div className="self-end flex flex-row items-center justify-between gap-4">
        {showTimer &&  <QuestionTimer time={10} />}
        <LoggedInUser user={user} />
      </div>
    </div>
  );
};

export default Header;


type LoggedInUserProps = {
  user: any;
};

const LoggedInUser: React.FC<LoggedInUserProps> = ({ user }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  // // check when the user clicks outside the menu and close it
  // const handleClickOutside = (event: any) => {
  //   document.addEventListener("mousedown", (event) => {
  //     // user click on the menu button
  //     if (
  //       menuButtonRef.current &&
  //       menuButtonRef.current.contains(event.target as Node)
  //     ) {
  //       // setShowMenu(!showMenu);
  //     } else {
  //       // user click outside the menu
  //       setShowMenu(false);
  //     }
  //   });
  // };

  return (
    <div className="relative">
      {
        user && (
          <button
          ref={menuButtonRef}
          onClick={() => setShowMenu(!showMenu)}
          className="flex flex-row items-center justify-center w-10 h-10 rounded-full bg-gray-700 focus:outline-none"
        >
          <img
            className="w-8 h-8 rounded-full"
            src={user.user.user_metadata.avatar_url}
            alt={user.user.user_metadata.full_name}
            loading="lazy"
          />
        </button>
        )
      }
      {/* {showMenu && (
        <div
          onClick={handleClickOutside}
          className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl"
          style={{ zIndex: 10 }}
        >
          <button
            onClick={() => supabaseClient.auth?.signOut()}
            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-teal-600 hover:text-white"
          >
            Sign out
          </button>
        </div>
      )} */}
    </div>
  );
};
