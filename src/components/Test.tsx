import React, { useEffect, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { VirtualTable } from '../lib/VirtualTable';
import Subsonic from '../lib/subsonic';

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

function Row(g: any[], { index }: { index: number }) {
  const [first] = g;
  const z = first[index];

  return (
    <tr key={z.id} className="hover:bg-slate-200 rounded cursor-pointer">
      <td className="h-[12px]">{z.title}</td>
      <td>{z.artist}</td>
      <td>{z.album}</td>
      <td>{z.bitRate} kbps</td>
      <td>{(z.suffix || '').toUpperCase()}</td>
    </tr>
  );
}

export default function Test() {
  const allSongs = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (allSongs[0].length === 0) {
        allSongs[1](await subsonic.getAllSongs());
      }
    }
    fetchData();
  }, [allSongs]);

  return (
    <>
      <style>{tableStyle}</style>
      <h1>more useless crap</h1>
      <div className="w-full h-full">
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
                    <th className="w-[26vw]">song</th>
                    <th className="w-[26vw]">artists</th>
                    <th className="w-[26vw]">album</th>
                    <th className="w-[10vw]">bitrate</th>
                    <th className="w-[10vw]">filetype</th>
                  </tr>
                </thead>
              }
              row={(i: { index: number }) => Row(allSongs, i)}
            />
          )}
        </AutoSizer>
      </div>
    </>
  );
}
