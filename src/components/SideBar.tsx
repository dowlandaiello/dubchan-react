import style from "./SideBar.module.css";
import Image from "next/image";
import Link from "next/link";
import { ModalContext } from "./ModalDisplay";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { User } from "../model/user";
import { AuthenticationModal, AuthSubmission } from "./AuthenticationModal";

interface Page {
  label: string;
  icon: string;
  activeIcon: string;
  href: string;
}

/// Routable pages.
const pages: Page[] = [
  {
    label: "Home",
    icon: "/home.svg",
    activeIcon: "/home_active.svg",
    href: "/",
  },
];

export interface AuthenticationState {
  users: { [username: string]: User };
  activeUser?: string;
}

export const AuthenticationContext = createContext<
  [AuthenticationState, Dispatch<SetStateAction<AuthenticationState>>]
>([{ users: {} }, () => {}]);

export const SideBar = () => {
  const [{ activeUser, users }] = useContext(AuthenticationContext);
  const activeRoute =
    typeof window !== "undefined" ? window.location?.pathname ?? "/" : "/";
  const [loginDrawerActive, setLoginDrawerActive] = useState<boolean>(false);
  const { setModal } = useContext(ModalContext);

  const pageButtons = pages.map(({ label, activeIcon, icon, href }) => (
    <Link href={href} key={label}>
      {" "}
      <div className={style.pageButton}>
        <Image
          src={activeRoute == href ? activeIcon : icon}
          alt={label}
          height={25}
          width={25}
        />{" "}
        <h3>{label}</h3>{" "}
      </div>
    </Link>
  ));

  const toggleLoginDrawer = () => {
    setLoginDrawerActive(!loginDrawerActive);
  };

  const userButtons = Object.values(users).map(({ username }) => (
    <p key={username}>{username}</p>
  ));

  const login = (sub: AuthSubmission) => {};

  const signup = (sub: AuthSubmission) => {};

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
    <div className={style.section}>
      {pageButtons}
      <div className={style.loginDrawer}>
        <div
          className={`${style.loginActions} ${
            loginDrawerActive ? style.active : ""
          }`}
        >
          <div className={style.pageButton} onClick={openLoginModal}>
            <Image src="/login.svg" height={25} width={25} alt="Log in icon" />
            <h3>Log In</h3>
          </div>
          <div className={style.pageButton} onClick={openSignupModal}>
            <Image
              src="/create_account.svg"
              height={25}
              width={25}
              alt="Create account icon"
            />
            <h3>Sign Up</h3>
          </div>
          {userButtons}
        </div>
        <div className={style.pageButton} onClick={toggleLoginDrawer}>
          <Image src="/expand.svg" height={25} width={25} alt="Expand icon." />
          <div className={style.loginLabel}>
            <p>Logged in as</p>
            <h3>{activeUser ? `@${activeUser}` : "Anonymous"}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
