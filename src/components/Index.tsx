import { useRef } from 'react';
import { toast } from 'react-hot-toast';

import localforage from 'localforage';

export default function Index() {
  const http = useRef<HTMLInputElement>(null);
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);

  function login() {
    if(!http && !username && !password) return;
    if(!http.current || !username.current || !password.current) return;

    if (
      !http.current.value ||
      !username.current.value ||
      !password.current.value
    ) {
      toast.error('Missing HTTP url, username or password :(');
      return;
    }

    localStorage.http = http.current.value;
    localStorage.username = username.current.value;
    localStorage.password = password.current.value;
    window.location.pathname = window.webos 
      ? window.location.pathname.replace("index.html", "songs.html")
      : "/songs";
  }

  return (
    <div className="bg-background flex items-center justify-center h-screen">
      <div className="bg-innerBackground p-2 rounded border-2 border-containerBorder text-textColor">
        <div className="text-xl mb-1">login:</div>
        <input
          type="text"
          className="mb-1 p-1 rounded border-innerBorder border-2 text-textColor"
          placeholder="http"
          ref={http}
          defaultValue={localStorage.http}
        />
        <br />
        <input
          type="text"
          className="mb-1 p-1 rounded border-innerBorder border-2 text-textColor"
          placeholder="username"
          ref={username}
          defaultValue={localStorage.username}
        />
        <br />
        <input
          type="password"
          className="mb-2 p-1 rounded border-innerBorder border-2 text-textColor"
          placeholder="password"
          ref={password}
          defaultValue={localStorage.password}
        />
        <br />

        <button
          className="p-1 rounded border-innerBorder hover:border-hoverInnerBorder border-2 transition"
          onClick={login}
          type="button"
        >
          login
        </button>
        <br/>
        <button
          className="mt-2 p-1 rounded border-innerBorder hover:border-hoverInnerBorder border-2 transition"
          onClick={async () => {
            await localforage.removeItem("songs");
          }}
          type="button"
        >
          clear all cache
        </button>
      </div>
    </div>
  );
}
