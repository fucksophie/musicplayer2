export default function Bar() {
  return (
    <div className="w-full text-textColor bg-innerInnerBackground h-10 flex gap-2 p-2 items-center">
      <div>
        <a className="mr-2" href="/">
          musicplayer
        </a>
        <a className="border-l-2 pl-2 border-innerBorder mr-2" href="/songs">
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
