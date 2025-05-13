"use client";

import style from "./Header.module.css";
import { AccountSelection } from "./AccountSelection";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import clickable from "./Clickable.module.css";

const logos = [
  "/logo.png",
  "/logo_israel.png",
  "/logo_usa.png",
  "/logo_palestine.png",
  "/logo_old.png",
  "/logo_gadsden.png",
  "/logo_420.png",
  "/logo_booba.png",
  "/logo_pixel_art.png",
];

export const Header = () => {
  const [selection, setSelection] = useState<number>(4);
  const logo = logos[selection];

  useEffect(() => {
    const buffer = new Uint8Array([0]);
    crypto.getRandomValues(buffer);

    setSelection(buffer[0] % logos.length);
  }, []);

  return (
    <div className={style.header}>
      <div className={style.leftPadder}></div>
      <div className={style.logoSection}>
        <img src={logo} width={156} height={74.883} alt="DubChan logo" />
        <div className={style.headerText}>
          <div className={style.headerTitleLine}>
              <h1><span className="">Dub</span><span>Chan</span></h1>
            <p className={style.betaMarker}>Beta</p>
          </div>
          <p>Anonymous. Unmoderated.</p>
        </div>
      </div>
      <div className={style.rightPadder}></div>
      <div className={style.accounts}>
        <AccountSelection />
        <Link href="/?message_to=" className={clickable.clickable}>
          <Image src="/mail.svg" height={20} width={20} alt="Mail icon." />
        </Link>
      </div>
    </div>
  );
};
