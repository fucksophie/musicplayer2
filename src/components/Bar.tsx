export default function Bar() {
  return (
    <div className="w-full dark:text-zinc-300 dark:bg-zinc-600 bg-slate-300 h-10 flex gap-2 p-2 items-center">
      <div>
        <a className="mr-2" href="/">
          musicplayer
        </a>
        <a className="border-l-2 pl-2 border-slate-400 dark:border-zinc-500 mr-2" href="/songs">
          songs
        </a>
      </div>

      <div className="ml-auto">
        <a className="mr-2" href="/settings">
          settings
        </a>
      </div>
    </div>
  );
}
