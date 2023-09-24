import style from "./Header.module.css";
import Image from "next/image";
import { AccountSelection } from "./AccountSelection";

export const Header = () => {
  return (
    <div className={style.header}>
      <div></div>
      <div className={style.logoSection}>
        <Image src="/logo.png" width={156} height={74.883} alt="DubChan logo" />
        <div className={style.headerText}>
          <div className={style.headerTitleLine}>
            <h1>DubChan</h1>
            <p className={style.betaMarker}>Beta</p>
          </div>
          <p>Anonymous. Unmoderated.</p>
        </div>
      </div>
      <div></div>
      <div className={style.accounts}>
        <AccountSelection />
      </div>
    </div>
  );
};
