import { useEffect, useState, useRef } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import Bar from './Bar';
import Subsonic from '../lib/subsonic';
import { VirtualTable } from '../lib/VirtualTable';
import Player from './player/Player';

const tableStyle = `td {
    max-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}`;

const subsonic = new Subsonic(
  localStorage.http,
  localStorage.username,
  localStorage.password
);

function sortBy(
  songs: any[],
  type: string,
  upsideDown = false,
  sortString = ''
) {
  let songs2 = [...songs];

  if (sortString.length !== 0) {
    const sortStrings = sortString.split('&&').map((z) => z.trim());
    songs2 = songs2.filter(
      (z) =>
        sortStrings.find((y) =>
          z.title.toLowerCase().includes(y.toLowerCase())
        ) ||
        sortStrings.find((y) =>
          z.artist.toLowerCase().includes(y.toLowerCase())
        ) ||
        sortStrings.find((y) =>
          z.album.toLowerCase().includes(y.toLowerCase())
        ) ||
        sortStrings.find((y) =>
          z.suffix.toLowerCase().includes(y.toLowerCase())
        )
    );
  }

  songs2.sort((a, b) => {
    if (a[type] > b[type]) return upsideDown ? -1 : 1;
    if (a[type] < b[type]) return upsideDown ? 1 : -1;
    return 0;
  });

  return songs2;
}

function Row(allSongsA: any[], selectedTrackIdA: any[], { index }: { index: number }) {
  const [allSongs] = allSongsA;
  const [, setSelectedTrackId] = selectedTrackIdA;
  const z = allSongs[index];

  return (
    <tr
      key={z.id}
      className="hover:bg-slate-200 dark:hover:bg-zinc-800 transition rounded cursor-pointer"
      onClick={() => setSelectedTrackId(z.id)}
    >
      <td className="h-[12px]">{z.title}</td>
      <td>{z.artist}</td>
      <td>{z.album}</td>
      <td>{z.bitRate} kbps</td>
      <td>{(z.suffix || '').toUpperCase()}</td>
      <td>{z.duration}s</td>
    </tr>
  );
}

export default function Songs() {
  const allSongs = useState<any[]>([]);
  const selectedTrackId = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function updateSongList(
    sort = 'album',
    upsideDown = false,
    elementToSortBy = ''
  ) {
    allSongs[0] = sortBy(
      await subsonic.getAllSongs(),
      sort,
      upsideDown,
      elementToSortBy || inputRef.current!.value
    );
    allSongs[1](allSongs[0]);
  }

  useEffect(() => {
    async function fetchData() {
      if (allSongs[0].length === 0) {
        await updateSongList();
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function shuffleSongs() {
    allSongs[1](
      allSongs[0]
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '110vh',
      }}
      className="dark:bg-zinc-700 dark:text-zinc-300"
    >
      <style>{tableStyle}</style>
      <Bar />
      <input
        className="w-full bg-slate-200 p-2 dark:bg-zinc-500"
        defaultValue="Joeyy"
        onChange={() => updateSongList('title', false)}
        ref={inputRef}
        placeholder="search for a song"
      />
      <div className="grow-[0.9]">
        <AutoSizer>
          {({ width, height }) => (
            <VirtualTable
              height={+(height||0)}
              width={+(width||0)}
              itemCount={allSongs[0].length}
              itemSize={12}
              header={
                <thead>
                  <tr>
                    <th
                      className="w-[26vw]"
                      onClick={() => updateSongList('title', false)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        updateSongList('title', true);
                      }}
                    >
                      song
                    </th>
                    <th
                      className="w-[26vw]"
                      onClick={() => updateSongList('artist', false)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        updateSongList('artist', true);
                      }}
                    >
                      artists
                    </th>
                    <th
                      className="w-[26vw]"
                      onClick={() => updateSongList('album', false)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        updateSongList('album', true);
                      }}
                    >
                      album
                    </th>
                    <th
                      className="w-[10vw]"
                      onClick={() => updateSongList('bitRate', false)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        updateSongList('bitRate', true);
                      }}
                    >
                      bitrate
                    </th>
                    <th
                      className="w-[10vw]"
                      onClick={() => updateSongList('suffix', false)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        updateSongList('suffix', true);
                      }}
                    >
                      filetype
                    </th>
                    <th
                      className="w-[10vw]"
                      onClick={() => updateSongList('duration', false)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        updateSongList('duration', true);
                      }}
                    >
                      duration
                    </th>
                  </tr>
                </thead>
              }
              row={(i: {index: number}) => Row(allSongs, selectedTrackId, i)}
            />
          )}
        </AutoSizer>
      </div>
      <Player
        tracks={allSongs[0] || []}
        trackForced={selectedTrackId[0]}
        // eslint-disable-next-line react/jsx-no-bind
        shuffle={shuffleSongs}
      />
    </div>
  );
}
