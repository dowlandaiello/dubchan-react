import style from "./MessagesPage.module.css";
import { useRouter } from "next/router";
import Image from "next/image";
import clickable from "./Clickable.module.css";
import { useState, useEffect, useContext } from "react";
import { AuthenticationContext } from "../components/AccountSelection";
import { AuthSubmission } from "./AuthenticationModal";
import { Inbox, Message } from "../model/message";
import { useKeypair } from "../model/key_pair";
import { route } from "../util/http";
import { Button } from "./Button";
import Skeleton from "react-loading-skeleton";
import { ModalContext } from "./ModalDisplay";
import { TripcodeModal } from "./TripcodeModal";
import { addIdentity } from "../util/cookie";
import { useServerStartTime, useSocket } from "../util/hooks";
import { decrypt } from "../util/crypto";
import { NewMessage } from "./NewMessage";
import { MessageDisplay, Node } from "./MessageDisplay";
import nacl from "tweetnacl";
import util from "tweetnacl-util";

export const MessagesPage = ({ to }: { to?: string }) => {
  const router = useRouter();
  const [inboxes, setInboxes] = useState<Inbox[] | null>(null);
  const [messages, setMessages] = useState<{
    [username: string]: { [id: number]: Node };
  }>({});
  const [{ activeUser, users }, setAuthState] = useContext(
    AuthenticationContext
  );
  const activeKeypair = useKeypair(activeUser);
  const { setModal } = useContext(ModalContext);
  const serverStartTime = useServerStartTime();
  const [activeDm, setActiveDm] = useState<string | undefined>(undefined);
  const otherKeypair = useKeypair(activeDm);
  const [selectingUser, setSelectingUser] = useState<string>(to ?? "");
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [currentlyReplying, setCurrentlyReplying] = useState<number | null>(
    null
  );
  const sock = useSocket();

  const back = () => {
    router.back();
    router.push("/");
  };

  const loadMessages = async () => {
    let kp = otherKeypair;

    if (!activeUser) return;
    if (!activeDm) return;
    if (!activeKeypair) return;
    if (!otherKeypair) {
      try {
        const kpJson = await (
          await fetch(route(`/users/${activeDm}/keypair`))
        ).json();
        kp = kpJson;
      } catch (e) {
        console.warn(e);
      }
    }
    if (!kp) return;

    try {
      const newMessages = await (
        await fetch(route(`/inboxes/${activeUser}/${activeDm}`), {
          headers: {
            "Content-Type": "application/json",
            Authorization: users[activeUser].token,
          },
        })
      ).json();

      const decrypted = newMessages.map((msg: Message) => {
        if (msg.sender === activeUser) {
          const dec = decrypt(
            msg.text_sender,
            msg.message_id,
            activeKeypair,
            activeKeypair
          );

          return {
            ...msg,
            text: dec,
            text_sender: dec,
          };
        }

        if (!kp) return { ...msg };

        const dec = decrypt(msg.text, msg.message_id, activeKeypair, kp);

        return {
          ...msg,
          text: dec,
          text_sender: dec,
        };
      });

      const messageTree = decrypted.reduce(
        (accum: { [id: number]: Node }, curr: Message) => {
          return {
            ...accum,
            [curr.message_id]: {
              id: curr.message_id,
              parent: curr.parent_message,
              time: curr.sent_at,
              text: curr.text,
              src: curr.src,
              user_id: curr.sender,
            },
          };
        },
        {}
      );

      setMessages((messages) => {
        return { ...messages, [activeDm]: messageTree };
      });
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (!activeDm || !sock) return;

    setTimeout(() => {
      // Subscribe to this room
      const members = [activeDm, activeUser].sort();
      sock.send(`join_dm ${members[0]} ${members[1]}`);

      setTimeout(() => {
        sock.send(`join_dm ${members[0]} ${members[1]}`);
      }, 1000);

      // Listen for new messages
      sock.addEventListener("message", async (e) => {
        if (e.data.includes("error")) {
          console.error(e);

          return;
        }

        loadMessages();
      });
    }, 500);
  }, [activeDm, sock]);

  useEffect(() => {
    loadMessages();
  }, [activeDm]);

  const getInboxes = async () => {
    if (!activeUser) return;

    try {
      const inboxes = await (
        await fetch(route(`/inboxes/${activeUser}`), {
          headers: {
            Authorization: users[activeUser].token,
          },
        })
      ).json();
      setInboxes(inboxes);
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (!activeUser) return;

    getInboxes();

    (async () => {
      try {
        const allInboxes = await (await fetch(route("/users/keypairs"))).json();
        setAllUsers(allInboxes);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, [to, activeUser]);

  const registerIdentity = (
    username: string,
    password: string,
    token: [number]
  ) => {
    setAuthState((state) => {
      return {
        activeUser: username,
        users: {
          ...state.users,
          [username]: {
            username: username,
            password,
            token: JSON.stringify(token),
          },
        },
      };
    });
    addIdentity(serverStartTime, username, password, JSON.stringify(token));

    // Registers a keypair for the user
    (async () => {
      const keyPair = nacl.box.keyPair();

      const msg = {
        pub_key: util.encodeBase64(keyPair.publicKey),
        priv_key: util.encodeBase64(keyPair.secretKey),
      };

      await fetch(route(`/users/${username}/keypair`), {
        method: "POST",
        body: JSON.stringify(msg),
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.stringify(token),
        },
      });
    })();
  };

  const signup = async (sub: AuthSubmission) => {
    setModal({
      title: "Generate Tripcode",
      children: [<TripcodeModal onSubmit={signup} key="signup" />],
      onClose: closeModal,
      active: true,
    });

    const resp = await fetch(route("/users"), {
      method: "POST",
      body: JSON.stringify(sub),
      headers: { "Content-Type": "application/json" },
    });

    if (resp.status === 200) {
      registerIdentity(sub.username, sub.password, await resp.json());
      setModal({ children: [], onClose: () => {}, active: false });
    } else {
      setModal({
        title: "Generate Tripcode",
        children: [
          <TripcodeModal
            errorMsg={await resp.text()}
            onSubmit={signup}
            key="tripcode"
          />,
        ],
        onClose: closeModal,
        active: true,
      });
    }
  };

  const closeModal = () => {
    setModal({ children: [], onClose: () => {}, active: false });
  };

  const openTripcodeModal = () => {
    setModal({
      title: "Generate Tripcode",
      children: [<TripcodeModal onSubmit={signup} key="tripcode" />],
      onClose: closeModal,
      active: true,
    });
  };

  const createDm = async () => {
    if (!inboxes) return;
    if (!activeUser) return;

    const selected = selectingUser;

    await fetch(route(`/inboxes/${activeUser}/${selected}`), {
      method: "POST",
      headers: { Authorization: users[activeUser].token },
    });

    setActiveDm(selected);
    setSelectingUser("");

    for (const inbox of inboxes) {
      if (inbox.user_id == selected) {
        return;
      }
    }

    setInboxes((inboxes: Inbox[] | null) => {
      if (!activeUser) return null;
      if (inboxes == null) return [{ user_id: selected, sender: activeUser }];

      return [...inboxes, { user_id: selected, sender: activeUser }];
    });
  };

  const newDraft = () => {
    setActiveDm(undefined);
    setSelectingUser("");
  };

  const inboxLabels =
    inboxes !== null
      ? inboxes
          .map((inbox) => {
            const other =
              inbox.sender === activeUser ? inbox.user_id : inbox.sender;
            return { ...inbox, other: other };
          })
          .filter(
            (inbox, index, array) =>
              array.findIndex(
                (currInbox) => currInbox.other === inbox.other
              ) === index
          )
          .map((inbox) => {
            return (
              <div
                className={`${clickable.clickable} ${style.inboxLabel} ${
                  activeDm === inbox.other ? style.active : ""
                }`}
                key={inbox.other}
                onClick={() => setActiveDm(inbox.other)}
              >
                <p>{inbox.other}</p>
              </div>
            );
          })
      : [];

  const suggestedUsers = allUsers
    .filter((user) => user[0].includes(selectingUser))
    .map((user) => (
      <p
        className={`${style.suggestedUser} ${clickable.clickable}`}
        key={user[0]}
        onClick={() => setSelectingUser(user[0])}
      >
        {user[0]}
      </p>
    ));

  const currMessages =
    activeDm && messages[activeDm]
      ? Object.values(messages[activeDm]).map((msg) => {
          return (
            <MessageDisplay
              comment={msg}
              key={msg.id}
              tree={messages[activeDm]}
              onReply={(id) => setCurrentlyReplying(id)}
              deletable={false}
              onClickDelete={() => {}}
            />
          );
        })
      : [];

  return (
    <div className={style.container}>
      <div className={style.section}>
        <div className={style.navSection}>
          <Image
            className={clickable.clickable}
            src="/back.svg"
            height={30}
            width={30}
            alt="Back button."
            onClick={back}
          />
          {inboxes !== null ? (
            <div className={style.inboxes}>
              <Image
                className={`${style.refreshIcon} ${clickable.clickable}`}
                src="/refresh.svg"
                height={20}
                width={20}
                alt="Refresh icon."
                onClick={getInboxes}
              />
              <div
                className={`${style.inboxLabel} ${style.createDm} ${
                  clickable.clickable
                } ${activeDm == null ? style.active : ""}`}
                onClick={newDraft}
              >
                <p>Draft</p>
              </div>
              {inboxLabels}
            </div>
          ) : (
            <div className={style.inboxes}>
              <Skeleton key="1" containerClassName={style.inboxLoader} />
              <Skeleton key="2" containerClassName={style.inboxLoader} />{" "}
              <Skeleton key="3" containerClassName={style.inboxLoader} />{" "}
              <Skeleton key="4" containerClassName={style.inboxLoader} />
            </div>
          )}
        </div>
        {(activeUser && (
          <div className={style.content}>
            {activeDm === undefined && (
              <>
                <div className={style.userInput}>
                  <p>To:</p>
                  <input
                    placeholder="username"
                    value={selectingUser}
                    onChange={(e) => setSelectingUser(e.target.value)}
                  ></input>
                </div>
                <div className={style.suggestedUsersLine}>
                  <p>Suggested Users:</p>
                  <div className={style.suggestedUsers}>{suggestedUsers}</div>
                </div>
                {selectingUser !== "" && (
                  <div
                    className={`${style.createDmButton} ${clickable.clickable}`}
                    onClick={createDm}
                  >
                    <p>Create Direct Message</p>
                    <Image
                      src="/down_arrow.svg"
                      height={15}
                      width={15}
                      alt="Create DM button."
                    />
                  </div>
                )}
              </>
            )}
            {activeDm && (
              <>
                {currMessages && currMessages.length > 0 ? (
                  <div className={style.log}>{currMessages}</div>
                ) : (
                  <div className={style.encryptionDisclaimer}>
                    <Image
                      src="/lock.svg"
                      height={30}
                      width={30}
                      alt="Lock icon."
                    />
                    <p>
                      This chat is secured with end-to-end military-grade
                      encryption.
                    </p>
                  </div>
                )}
                {currentlyReplying && activeDm && (
                  <p>
                    Replying to{" "}
                    <b>{messages[activeDm][currentlyReplying].text}</b>
                  </p>
                )}
                <NewMessage
                  user_id={activeDm}
                  parentMessage={currentlyReplying ?? undefined}
                  className={style.messageInput}
                  onClear={() => setCurrentlyReplying(null)}
                  onSubmitted={() => setCurrentlyReplying(null)}
                />
              </>
            )}
          </div>
        )) || (
          <div className={style.tripWarning}>
            <p>
              In order to continue, please <b>login</b>, or
            </p>
            <Button
              onClick={openTripcodeModal}
              text="Create a tripcode"
              className={style.createTripButton}
            />
          </div>
        )}
      </div>
      <div className={style.backdrop} onClick={back} />
      <div className={style.backdropL} onClick={back} />
    </div>
  );
};
