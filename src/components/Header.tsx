"use client";

import style from "./Header.module.css";
import { AccountSelection } from "./AccountSelection";
import { useRef } from "react";

const logos = [
  "/logo.png",
  "/logo_israel.png",
  "/logo_usa.png",
  "/logo_palestine.png",
  "/logo_old.png",
];

export const Header = () => {
  const logo = useRef<string>(logos[Math.floor(Math.random() * logos.length)]);

  return (
    <div className={style.header}>
      <div className={style.leftPadder}></div>
      <div className={style.logoSection}>
        <img
          src={logo.current}
          width={156}
          height={74.883}
          alt="DubChan logo"
        />
        <div className={style.headerText}>
          <div className={style.headerTitleLine}>
            <h1>DubChan</h1>
            <p className={style.betaMarker}>Beta</p>
          </div>
          <p>Anonymous. Unmoderated.</p>
        </div>
      </div>
      <div className={style.rightPadder}></div>
      <div className={style.accounts}>
        <AccountSelection />
      </div>
    </div>
  );
};
