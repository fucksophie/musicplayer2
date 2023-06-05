import Bar from './Bar';

import {
  faPalette,
  faCogs
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {useState, useRef, useEffect} from "react";
import { toast } from 'react-hot-toast';

import {colors} from "../colors"

import {
  getUserInfo,
  generateToken,
  lastFmApiKey,
  getSession,
} from '../lib/LastFM';

function Integrations({buttonClass}: {buttonClass:string}) {
  const [lUser, setlUser] = useState<any>();
  const phase = useRef(0);

  const [serverScrobbling, setServerScrobbling] = useState(
    localStorage.serverScrobbling === 'true'
  );
  const [lastfmScrobbling, setLastfmScrobbling] = useState(
    localStorage.lastfmScrobbling === 'true'
  );
  
  const [discordRPCEnabled, setDiscordRPCEnabled] = useState(
    localStorage.discordRPCEnabled === 'true'
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
    <>
      <h2 className='text-2xl'>lastfm</h2>
        <button
          className={buttonClass}
          onClick={async (e) => {
            if (phase.current === 0) {
              const token = await generateToken();
              localStorage.temporaryToken = token;
              //@ts-expect-error
              if(window.__TAURI__) {
                //@ts-expect-error
                window.__TAURI__.shell.open(`https://last.fm/api/auth/?api_key=${lastFmApiKey}&token=${token}`);
              } else {
                window.open(`https://last.fm/api/auth/?api_key=${lastFmApiKey}&token=${token}`, "_blank")
              }
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
          }}>sign in</button>

        {(() => {
          if (lUser) {
            return (
              <>
                <div>
                  signed in as <strong>{lUser.user.name}</strong>, with playcount <strong>{lUser.user.playcount}</strong>
                </div>
                <div>
                  ({lUser.user.playcount > 1000 ? lUser.user.playcount > 10000 ? "wow, that's a lot of plays!" : "nice! a bunch of plays" : "awhh, that's not that many plays"})
                </div>
              </>
            );
          }
          return <br />;
        })()}

        <div className="mt-2">
          scrobble through lastfm natively: <input 
          type="checkbox"
          defaultChecked={lastfmScrobbling}
          onChange={() => {
            localStorage.lastfmScrobbling =
              localStorage.lastfmScrobbling !== 'true';
            setLastfmScrobbling((prev) => !prev);
          }}/>
        </div>
        <div>
          scrobble through subsonic:{" "}
          <input 
            type="checkbox"
            defaultChecked={serverScrobbling}
            onChange={() => {
              localStorage.serverScrobbling =
                localStorage.serverScrobbling !== 'true';
              setServerScrobbling((prev) => !prev);
            }}
          />
        </div>
        {
          (() => {
            //@ts-expect-error
            if(window.__TAURI__) {
              return <>
                <h2 className='text-2xl'>discordRPC</h2>
                <div>
                  enable discordRPC:{" "}
                  <input 
                    type="checkbox"
                    defaultChecked={discordRPCEnabled}
                    onChange={() => {
                      localStorage.discordRPCEnabled =
                        localStorage.discordRPCEnabled !== 'true';
                      setDiscordRPCEnabled((prev) => !prev);
                      setTimeout(() => {
                        window.location.reload();
                      }, 1000);
                    }}
                    
                  />
                </div>
              </>
            }
          })()
        }
      </>
  )
}

function Appearance({buttonClass}: {buttonClass:string}) {
  const [darkSetting, setDarkSetting] = useState(
    localStorage.dark
  );

  const [theme, setTheme] = useState(
    localStorage.theme
  );

  return (
    <>
      <div className="grid grid grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-1 my-2">
        {
          Object.keys(colors).map(z => {
            return <div 
                className={"rounded-sm transition hover:bg-"+z+"-"+(darkSetting=="true"?"800":"100")+" h-20 bg-"+z+"-"+(darkSetting=="true"?"900":"200")}
                onClick={() => {
                  localStorage.theme = z;
                  setTheme(z);
                  setTimeout(() => location.reload(),100);
                }}
              >
              <div className="p-1 ">
            
              <span>{z}</span>
              <br></br>
              {
                new Array(8).fill(1).map((_,i) => {
                  return <span className={"bg-"+z+"-"+(i+(darkSetting=="true"?3:1))+"00 w-4 h-5 inline-block"}></span>;
                })
              }
              </div>
            </div>
          })
        }
      </div>

      Dark style?: {' '}
      <input
        type="checkbox"
        defaultChecked={localStorage.dark == "true"}
        onChange={() => {
          localStorage.dark = localStorage.dark == "true" ? "" : "true"; 
          setDarkSetting((prev: string) => prev == "true" ? "" : "true");
          setTimeout(() => location.reload(),100);
        }}
      />
    </>
  )
}
export default function Settings() {
  let fai = "fa-4x w-9 h-9 rounded border-2 rounded-xl border-innerBorder hover:border-hoverInnerBorder transition p-6 bg-innerInnerBackground";
  let buttonClass = "rounded-xl border-2 border-innerBorder bg-innerInnerBackground hover:border-hoverInnerBorder transition p-2"

  const integrationRef = useRef<HTMLDivElement>(null);
  const appearanceRef = useRef<HTMLDivElement>(null);

  return (
    <div className="text-textColor h-screen bg-innerBackground">
      <Bar />
      <div className="flex h-full">

        <div className="h-full w-24 bg-background p-1">
          <FontAwesomeIcon 
            icon={faCogs}
            className={fai}
            onClick={() => {
              if(!appearanceRef.current!.className.includes("hidden")) 
                appearanceRef.current!.className += " hidden";
              integrationRef.current!.className = integrationRef.current!.className.replace(" hidden", "");
            }}
          />
          <FontAwesomeIcon 
            icon={faPalette}
            className={fai+" mt-2"}
            onClick={() => {
              if(!integrationRef.current!.className.includes("hidden")) 
                integrationRef.current!.className += " hidden";
              appearanceRef.current!.className = integrationRef.current!.className.replace(" hidden", "");
            }}
          />
        </div>
        <div className="m-2 transition" ref={integrationRef}>
          <h1 className='text-4xl'>integrations</h1>
          <Integrations {...{buttonClass}}></Integrations>
        </div>  
        <div className="m-2 hidden" ref={appearanceRef}>
          <h1 className='text-4xl'>appearance</h1>
          <Appearance {...{buttonClass}}></Appearance>
        </div>  
      </div>
    </div>
  );
}
