import style from "./AccountSelection.module.css";
import Image from "next/image";
import { addIdentity, removeIdentity } from "../util/cookie";
import { ModalContext } from "./ModalDisplay";
import clickable from "./Clickable.module.css";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { User } from "../model/user";
import { AuthenticationModal, AuthSubmission } from "./AuthenticationModal";
import { route } from "../util/http";

export interface AuthenticationState {
  users: { [username: string]: User };
  activeUser?: string;
}

export const AuthenticationContext = createContext<
  [AuthenticationState, Dispatch<SetStateAction<AuthenticationState>>]
>([{ users: {} }, () => {}]);

export const AccountSelection = () => {
  const [{ activeUser, users }, setAuthState] = useContext(
    AuthenticationContext
  );
  const [loginDrawerActive, setLoginDrawerActive] = useState<boolean>(false);
  const { setModal } = useContext(ModalContext);

  const toggleLoginDrawer = () => {
    setLoginDrawerActive(!loginDrawerActive);
  };

  const removeUser = (username: string) => {
    setAuthState((state) => {
      delete state.users[username];
      return {
        ...state,
        users: { ...state.users },
      };
    });
    removeIdentity(username);
  };

  const userButtons = Object.values(users).map(({ username }) => (
    <div key={username} className={style.userButtonContainer}>
      <div
        className={`${style.pageButton} ${style.userButton} ${
          activeUser === username ? style.active : ""
        }`}
        key={username}
        onClick={() => {
          setLoginDrawerActive(false);
          setAuthState((state) => {
            return { ...state, activeUser: username };
          });
        }}
      >
        <p>@{username}</p>
      </div>
      <Image
        className={clickable.clickable}
        src="/close.svg"
        height={20}
        width={20}
        onClick={() => removeUser(username)}
        alt="Close icon."
      />
    </div>
  ));

  const registerIdentity = (username: string, token: [number]) => {
    setAuthState((state) => {
      return {
        activeUser: username,
        users: {
          ...state.users,
          [username]: { username: username, token: JSON.stringify(token) },
        },
      };
    });
    addIdentity(username, JSON.stringify(token));
  };

  const login = async (sub: AuthSubmission) => {
    setModal({
      title: "Log In",
      children: [<AuthenticationModal onSubmit={login} key="login" />],
      onClose: closeModal,
      active: true,
    });

    const resp = await fetch(route("/users/login"), {
      method: "POST",
      body: JSON.stringify(sub),
      headers: { "Content-Type": "application/json" },
    });

    if (resp.status === 200) {
      registerIdentity(sub.username, await resp.json());
      setModal({ children: [], onClose: () => {}, active: false });
      setLoginDrawerActive(false);
    } else {
      setModal({
        title: "Log In",
        children: [
          <AuthenticationModal
            errorMsg={await resp.text()}
            onSubmit={login}
            key="login"
          />,
        ],
        onClose: closeModal,
        active: true,
      });
    }
  };

  const goAnon = () => {
    setAuthState((state) => {
      return { ...state, activeUser: undefined };
    });
    setLoginDrawerActive(false);
  };

  const signup = async (sub: AuthSubmission) => {
    setModal({
      title: "Sign Up",
      children: [<AuthenticationModal onSubmit={signup} key="signup" />],
      onClose: closeModal,
      active: true,
    });

    const resp = await fetch(route("/users"), {
      method: "POST",
      body: JSON.stringify(sub),
      headers: { "Content-Type": "application/json" },
    });

    if (resp.status === 200) {
      registerIdentity(sub.username, await resp.json());
      setModal({ children: [], onClose: () => {}, active: false });
      setLoginDrawerActive(false);
    } else {
      setModal({
        title: "Sign Up",
        children: [
          <AuthenticationModal
            errorMsg={await resp.text()}
            onSubmit={signup}
            key="signup"
          />,
        ],
        onClose: closeModal,
        active: true,
      });
    }
  };

  const closeModal = () => {
    setModal({ children: [], onClose: () => {}, active: false });
  };

  const openLoginModal = () => {
    setModal({
      title: "Log In",
      children: [<AuthenticationModal onSubmit={login} key="login" />],
      onClose: closeModal,
      active: true,
    });
  };

  const openSignupModal = () => {
    setModal({
      title: "Sign Up",
      children: [<AuthenticationModal onSubmit={signup} key="signup" />],
      onClose: closeModal,
      active: true,
    });
  };

  return (
    <div
      className={`${style.drawerContainer} ${
        loginDrawerActive ? style.active : ""
      }`}
    >
      <div className={style.loginButton} onClick={toggleLoginDrawer}>
        <Image src="/expand.svg" height={20} width={20} alt="Expand icon." />
        <div className={style.loginLabel}>
          <p>Logged in as</p>
          <h3>{activeUser ? `@${activeUser}` : "Anonymous"}</h3>
        </div>
      </div>
      <div className={style.loginDrawer}>
        <div
          className={`${style.loginActions} ${
            loginDrawerActive ? style.active : ""
          }`}
        >
          {userButtons}
          <div
            className={`${style.pageButton} ${style.userButton} ${
              !activeUser ? style.active : ""
            }`}
            onClick={goAnon}
          >
            <p>Anonymous</p>
          </div>
          <div className={style.pageButton} onClick={openLoginModal}>
            <h4>Log In</h4>
            <Image src="/login.svg" height={20} width={20} alt="Log in icon" />
          </div>
          <div className={style.pageButton} onClick={openSignupModal}>
            <h4>Sign Up</h4>
            <Image
              src="/create_account.svg"
              height={25}
              width={25}
              alt="Create account icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
