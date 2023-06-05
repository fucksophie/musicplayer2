import { useEffect, useState, useRef, Dispatch, SetStateAction } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import Bar from './Bar';
import Subsonic from '../lib/subsonic';
import { VirtualTable } from '../lib/VirtualTable';

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
  cols: Column[],
  upsideDown = false,
  sortString = ''
) {
  let songs2 = [...songs];

  if (sortString.length !== 0) {
    const sortStrings = sortString.split('&&').map((z) => z.trim());
    songs2 = songs2.filter(
      (z) =>
        cols.some(g => {
          return sortStrings.find((y) =>
            (z[g]+"").toLowerCase().includes(y.toLowerCase())
          )
        })
    );
  }

  songs2.sort((a, b) => {
    if (a[type] > b[type]) return upsideDown ? -1 : 1;
    if (a[type] < b[type]) return upsideDown ? 1 : -1;
    return 0;
  });

  return songs2;
}

function Row(allSongsA: any[], selectedTrackIdA: any[], cols: Column[], { index }: { index: number }) {
  const [allSongs] = allSongsA;
  const [, setSelectedTrackId] = selectedTrackIdA;
  const z = allSongs[index];

  return (
    <tr
      key={z.id}
      className="hover:bg-innerInnerBackground transition rounded cursor-pointer"
      onClick={() => setSelectedTrackId(z.id)}
    >
      {
        cols.map((g,i) => {
          let cn = "";
          let r = z[g];

          if(i == 0) cn = "h-[15px]";
          if(g=="suffix") r = r.toUpperCase();
          return <td className={cn} key={g}>{r}</td>
        })
      }

    </tr>
  );
}

type Column = "title" | "artist" | "album" | "bitRate" | "suffix" | "duration";

export default function ColumnListing({cols, sortedElement, allSongs, selectedTrackId}: {
  cols: Column[],
  sortedElement: Column
  allSongs: [any[], Dispatch<SetStateAction<any[]>>]
  selectedTrackId: [string, Dispatch<SetStateAction<string>>]
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function updateSongList(
    sort = sortedElement,
    upsideDown = false,
    elementToSortBy = ''
  ) {
    allSongs[0] = sortBy(
      await subsonic.getAllSongs(),
      sort,
      cols,
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


  return (
    <>
      <style>{tableStyle}</style>
      <input
        className="w-full bg-innerBackground text-textColor p-2"
        onChange={() => updateSongList(sortedElement, false)}
        ref={inputRef}
        placeholder={"search for a "+sortedElement}
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
                    {
                      cols.map(z => {
                        return <th
                          className="w-[10vw]"
                          key={z}
                          onClick={() => updateSongList(z, false)}
                          onContextMenu={(e) => {
                            e.preventDefault();
                            updateSongList(z, true);
                          }}
                        >
                          {z}
                        </th>
                      })
                    }
                  </tr>
                </thead>
              }
              row={(i: {index: number}) => Row(allSongs, selectedTrackId, cols, i)}
            />
          )}
        </AutoSizer>
      </div>
    </>
  );
}
