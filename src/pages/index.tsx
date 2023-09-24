import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Feed, FeedContext } from "../components/Feed";
import { Header } from "../components/Header";
import { ModalInput } from "../components/ModalInput";
import { loadIdentities } from "../util/cookie";
import { PostPage } from "../components/PostPage";
import { ModalContext, ModalProps } from "../components/ModalInput";
import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import {
  ModalContext as GeneralModalContext,
  ModalProps as GeneralModalProps,
  ModalDisplay,
} from "../components/ModalDisplay";
import { SkeletonTheme } from "react-loading-skeleton";
import {
  AuthenticationContext,
  AuthenticationState,
} from "../components/AccountSelection";

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
  const [authState, setAuthState] = useState<AuthenticationState>({
    users: {},
  });
  const feedContext = useState<number>(0);

  useEffect(() => {
    const identities = loadIdentities();
    setAuthState(identities);
  }, []);

  const router = useRouter();

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
          <AuthenticationContext.Provider value={[authState, setAuthState]}>
            <FeedContext.Provider value={feedContext}>
              <SkeletonTheme baseColor="#1a1837" highlightColor="#272452">
                <main className={styles.main}>
                  <Script
                    src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                    async={true}
                    defer={true}
                  />
                  <ModalInput {...modalProps} />
                  <ModalDisplay {...generalModalProps} />
                  <PostPage
                    className={`${
                      router.query?.post ? styles.activePostViewer : ""
                    } ${styles.postViewer}`}
                    postId={
                      router.query?.post && !Array.isArray(router.query.post)
                        ? parseInt(router.query.post)
                        : undefined
                    }
                  />
                  <div className={styles.foreground}>
                    <div className={styles.workspace}>
                      <Header />
                      <Feed />
                    </div>
                  </div>
                </main>
              </SkeletonTheme>
            </FeedContext.Provider>
          </AuthenticationContext.Provider>
        </GeneralModalContext.Provider>
      </ModalContext.Provider>
    </>
  );
}
