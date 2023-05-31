import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from 'react-router-dom';
import { error, info, attachConsole } from "tauri-plugin-log-api";

(async ()=> {
  await attachConsole();
})();

import { install } from '@twind/core';
import { Toaster } from 'react-hot-toast';

import Subsonic from './lib/subsonic';

import Index from './components/Index';
import Settings from './components/Settings';
import Songs from './components/Songs';

import config from './twind.config';

install(config);

async function verifySubsonicAuthenication() {
  const subsonic = new Subsonic(
    localStorage.http,
    localStorage.username,
    localStorage.password
  );
  if (!(await subsonic.test())) {
    return redirect('/');
  }
  return null;
}

const errorElement = <h1 className="font-2xl m-5">MP2 has either failed to connect to Subsonic or there could be another issue. Please check your terminal. <a href="/" className="text-red-400">Return to Index?</a></h1>;

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Index />,
      errorElement,
      loader: () => {info("loader - settings"); return null;}
    },
    {
      path: '/settings',
      element: <Settings />,
      errorElement,
      loader: () => {info("loader - settings"); return null;}
    },
    {
      path: '/songs',
      element: <Songs />,
      errorElement,
      loader: () => {info("loader - songs"); return verifySubsonicAuthenication()}
    },
  ]
);

window.addEventListener( "error" , (e) => { 
  error(e.toString());
})

createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
    <Toaster />
  </>
);
