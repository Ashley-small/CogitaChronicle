import Image from "next/image";
import Link from "next/link";
import HeroImage from "../public/hero.webp";
import { Logo } from "../components/Logo/Logo";
export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative">
      <Image src={HeroImage} alt="Hero" fill className="absolute" />
      <div className="relative z-10 text-white px-10 py-5 text-center max-w-screen-sm bg-slate-900/90 rounded-md backdrop-blur-sm">
        <Logo />
        <p>
          "Cogito is the Latin word that means "I think" and is famously
          associated with René Descartes' philosophical statement "Cogito, ergo
          sum," which translates to "I think, therefore I am." The Cogita
          Chronicle generates SEO-optimised blog posts in minutes.
        </p>
        <Link href="post/new" className="btn">
          Begin
        </Link>
      </div>
      <Link href="/api/auth/login">Login</Link>
    </div>
  );
}
