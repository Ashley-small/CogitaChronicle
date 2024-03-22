import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../Logo/Logo";
export const AppLayout = ({ children, availableTokens, posts, postId }) => {
  const { user } = useUser();

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <nav className="flex flex-col text-white overflow-hidden">
        <section className="bg-slate-800 px-2 ">
          <Logo />
          <Link className="btn" href="/post/new">
            New Post
          </Link>
          <Link className="block mt-2 text-center " href="/token-topup">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">{availableTokens} tokens available</span>
          </Link>
        </section>
        <section className="px-4 flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post._id}`}
              className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm${
                postId === post._id ? "bg-white/20 border-white" : ""
              }`}
            >
              {post.topic}
            </Link>
          ))}
        </section>
        <section className="bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2 ">
          {!!user ? (
            <>
              <div className="min-w-[40px]">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={40}
                  width={40}
                  className="rounded-full"
                />
              </div>
              <div className="flex-1">
                <p className="font-bold text-xs">{user.name}</p>
                <Link className="font-bold text-xs" href="/api/auth/logout">
                  Logout
                </Link>
              </div>
            </>
          ) : (
            <Link href="/api/auth/login">Login</Link>
          )}
        </section>
      </nav>
      {children}
    </div>
  );
};
