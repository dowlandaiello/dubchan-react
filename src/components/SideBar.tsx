import style from "./SideBar.module.css";
import Image from "next/image";
import Link from "next/link";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
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
  const [{ activeUser }] = useContext(AuthenticationContext);
  const activeRoute =
    typeof window !== "undefined" ? window.location?.pathname ?? "/" : "/";

  const pageButtons = pages.map(({ label, activeIcon, icon, href }) => (
    <Link href={href}>
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

  return (
    <div className={style.section}>
      {pageButtons}
      <div className={style.pageButton}>
        <Image src="/expand.svg" height={25} width={25} alt="Expand icon." />
        <div className={style.loginLabel}>
          <p>Logged in as</p>
          <h3>{activeUser ? `@${activeUser}` : "Anonymous"}</h3>
        </div>
      </div>
    </div>
  );
};
