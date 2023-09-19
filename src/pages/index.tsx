import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Feed } from "../components/Feed";
import { Header } from "../components/Header";
import { QuickLinks } from "../components/QuickLinks";

export default function Home() {
  return (
    <>
      <Head>
        <title>DubChan: Anonymous. Unmoderated.</title>
        <meta name="description" content="An anonymous image board for UW." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Header />
        <QuickLinks />
        <Feed />
      </main>
    </>
  );
}
