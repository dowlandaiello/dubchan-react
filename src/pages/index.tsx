import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Feed, FeedContext, ThreadingContext } from "../components/Feed";
import { Header } from "../components/Header";
import { ModalInput } from "../components/ModalInput";
import { PostPage } from "../components/PostPage";
import { MessagesPage } from "../components/MessagesPage";
import { ModalContext, ModalProps } from "../components/ModalInput";
import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import {
  ModalContext as GeneralModalContext,
  ModalProps as GeneralModalProps,
  ModalDisplay,
} from "../components/ModalDisplay";
import { SkeletonTheme } from "react-loading-skeleton";

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
  const feedContext = useState<number>(0);
  const threadingContext = useState<boolean>(true);

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
          <FeedContext.Provider value={feedContext}>
            <ThreadingContext.Provider value={threadingContext}>
              <SkeletonTheme baseColor="#1a1837" highlightColor="#272452">
                <main className={styles.main}>
                  <Script
                    src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                    async={true}
                    defer={true}
                  />
                  <Script
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3830685811224190"
                    async
                  />
                  <ModalInput {...modalProps} />
                  <ModalDisplay {...generalModalProps} />
                  <PostPage
                    key={
                      router.query?.post && !Array.isArray(router.query.post)
                        ? parseInt(router.query.post)
                        : undefined
                    }
                    className={`${
                      router.query?.post ? styles.activePostViewer : ""
                    } ${styles.postViewer}`}
                    postId={
                      router.query?.post && !Array.isArray(router.query.post)
                        ? parseInt(router.query.post)
                        : undefined
                    }
                  />
                  {router.query?.message_to !== undefined &&
                    !Array.isArray(router.query.message_to) && (
                      <MessagesPage to={router.query.message_to} />
                    )}
                  <div className={styles.foreground}>
                    <div className={styles.workspace}>
                      <Header />
                      <Feed />
                    </div>
                  </div>
                </main>
              </SkeletonTheme>
            </ThreadingContext.Provider>
          </FeedContext.Provider>
        </GeneralModalContext.Provider>
      </ModalContext.Provider>
    </>
  );
}
