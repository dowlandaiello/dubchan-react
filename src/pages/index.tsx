import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Feed } from "../components/Feed";
import { Header } from "../components/Header";
import { ModalInput } from "../components/ModalInput";
import { ModalContext, ModalProps } from "../components/ModalInput";
import { useState } from "react";
import Script from "next/script";
import {
  ModalContext as GeneralModalContext,
  ModalProps as GeneralModalProps,
  ModalDisplay,
} from "../components/ModalDisplay";

export default function Home() {
  const [modalProps, setProps] = useState<ModalProps>({
    title: "",
    description: "",
    placeholder: "",
    onSubmit: () => {},
    onClose: () => {},
    active: false,
  });
  const [generalModalProps, setGeneralModalProps] = useState<GeneralModalProps>(
    { children: [], onClose: () => {}, active: false }
  );

  return (
    <>
      <Head>
        <title>DubChan: Anonymous. Unmoderated.</title>
        <meta name="description" content="An anonymous image board for UW." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ModalContext.Provider value={{ modal: modalProps, setModal: setProps }}>
        <GeneralModalContext.Provider
          value={{ modal: generalModalProps, setModal: setGeneralModalProps }}
        >
          <main className={styles.main}>
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              async={true}
              defer={true}
            />
            <ModalInput {...modalProps} />
            <ModalDisplay {...generalModalProps} />
            <div className={styles.foreground}>
              <Header />
              <Feed />
            </div>
          </main>
        </GeneralModalContext.Provider>
      </ModalContext.Provider>
    </>
  );
}
