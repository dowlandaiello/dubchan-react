import style from "./SideBar.module.css";
import Image from "next/image";
import Link from "next/link";

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

export const SideBar = () => {
  const activeRoute =
    typeof window !== "undefined" ? window.location?.pathname ?? "/" : "/";

  const pageButtons = pages.map(({ label, activeIcon, icon, href }) => (
    <Link href={href} key={label}>
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

  return <div className={style.section}>{pageButtons}</div>;
};
