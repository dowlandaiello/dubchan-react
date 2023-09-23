import style from "./SideBar.module.css";
import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { User } from "../model/user";

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

  return (
    <div className={style.section}>
      {pageButtons}
      <div className={style.loginDrawer}>
        <div
          className={`${style.loginActions} ${
            loginDrawerActive ? style.active : ""
          }`}
        >
          <div className={style.pageButton}>
            <Image src="/login.svg" height={25} width={25} alt="Log in icon" />
            <h3>Log In</h3>
          </div>
          <div className={style.pageButton}>
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
