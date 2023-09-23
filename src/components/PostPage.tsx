import style from "./PostPage.module.css";
import Image from "next/image";
import clickable from "./Clickable.module.css";
import { useRouter } from "next/router";

export const PostPage = ({ postId }: { postId: number }) => {
  const router = useRouter();

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
            onClick={router.back}
          />
        </div>
      </div>
    </div>
  );
};
