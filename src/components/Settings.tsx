/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Bar from './Bar';
import {
  getUserInfo,
  generateToken,
  lastFmApiKey,
  getSession,
} from '../lib/LastFM';

export default function Settings() {
  const [lUser, setlUser] = useState<any>();
  const phase = useRef(0);

  const [serverScrobbling, setServerScrobbling] = useState(
    localStorage.serverScrobbling === 'true'
  );
  const [darkTheme, setDarkTheme] = useState(
    localStorage.theme
  );
  const [lastfmScrobbling, setLastfmScrobbling] = useState(
    localStorage.lastfmScrobbling === 'true'
  );

  useEffect(() => {
    async function fetchData() {
      if (localStorage.lastfmSession && !lUser) {
        setlUser(await getUserInfo(localStorage.lastfmSession));
      }
    }
    fetchData();
  }, [lUser, setlUser]);

  return (
    <div className="dark:text-zinc-300 h-screen dark:bg-zinc-700">
      <Bar />
      <table className="w-full">
        <thead className="border-t-2 border-slate-400 dark:border-zinc-500">
          <th className="border-r-2 border-b-2 border-slate-400 dark:border-zinc-500">appearance</th>
          <th className=" border-b-2 border-slate-400 dark:border-zinc-500">integrations</th>
        </thead>
        <tr className="h-full">
          <td className="border-r-2 border-slate-400 p-1 dark:border-zinc-500">
            <span>themes:</span>
            <br/>
            <label>
              enable dark theme:{' '}
              <input
                id="serverScrobbling"
                type="checkbox"
                defaultChecked={localStorage.dark == "dark"}
                onChange={() => {
                  localStorage.dark = localStorage.dark == "dark" ? "" : "dark"; 
                  setDarkTheme((prev: string) => prev == "dark" ? "" : "dark");
                  setTimeout(() => location.reload(),100);
                }}
              />
            </label>
          </td>
          <td className="border-r-2 border-slate-400 p-1 dark:border-zinc-500">
            <div>lastfm</div>
            <button
              type="button"
              className="mb-2 p-1 rounded border-slate-300  dark:bg-zinc-600 dark:border-zinc-400 dark:hover:border-zinc-500 transition hover:border-slate-400 border-2"
              onClick={async (e) => {
                // TODO: signing out is not yet implemented
                /*if (localStorage.lastfmSession) {
                  toast.error('You are already signed in!');
                  return;
                }*/

                if (phase.current === 0) {
                  const token = await generateToken();
                  localStorage.temporaryToken = token;
                  //@ts-ignore-start
                  window.__TAURI__.shell.open(`https://last.fm/api/auth/?api_key=${lastFmApiKey}&token=${token}`);
                  //@ts-ignore-end
                  phase.current = 1;

                  (e.target as HTMLElement).innerText = 'have you authenicated? click again';
                  return;
                }

                if (phase.current === 1) {
                  const session = await getSession(localStorage.temporaryToken);

                  localStorage.lastfmSession = session.key;
                  localStorage.removeItem('temporaryToken');
                  toast.success('Sucesfully signed in to last.fm!');
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                  (e.target as HTMLElement).innerText = 'sign in';
                  phase.current = 0;
                }
              }}
            >
              sign in
            </button>
            {(() => {
              if (lUser) {
                return (
                  <div>
                    Signed in as {lUser.user.name}, with playcount{' '}
                    {lUser.user.playcount}
                  </div>
                );
              }
              return <br />;
            })()}
            <label>
              enable server scrobbling:{' '}
              <input
                id="serverScrobbling"
                type="checkbox"
                defaultChecked={serverScrobbling}
                onChange={() => {
                  localStorage.serverScrobbling =
                    localStorage.serverScrobbling !== 'true';
                  setServerScrobbling((prev) => !prev);
                }}
              />
            </label>
            <br />
            <label>
              enable lastfm scrobbling:{' '}
              <input
                id="lastfmScrobbling"
                type="checkbox"
                defaultChecked={lastfmScrobbling}
                onChange={() => {
                  localStorage.lastfmScrobbling =
                    localStorage.lastfmScrobbling !== 'true';
                  setLastfmScrobbling((prev) => !prev);
                }}
              />
            </label>
          </td>
        </tr>
      </table>
    </div>
  );
}
