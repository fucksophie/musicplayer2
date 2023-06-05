import Bar from "./Bar";
import ColumnListing from "./ColumnListing"
import Player from './player/Player';
import {useState,useEffect} from "react";

export default function Albums() {
    const allSongs = useState<any[]>([]);
    const selectedTrackId = useState('');
    
    function shuffleAlbums() {
        allSongs[1](
          allSongs[0]
            .map((value) => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)
        );
    }

    useEffect(() => {
        let sorted = [...new Map(allSongs[0].map(item =>
            [item.album, item])).values()];
        if(sorted.length !== allSongs[0].length) {
            allSongs[1](sorted)
        }
    }, [allSongs])

    return <>
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '110vh',
            }}
            className="bg-background text-textColor"
            >
                <Bar/>
                <ColumnListing cols={[
                        "artist", 
                        "album", 
                    ]} 
                    sortedElement="title"
                    selectedTrackId={selectedTrackId}
                    allSongs={allSongs}
                ></ColumnListing>
                <Player
                    tracks={allSongs[0] || []}
                    trackForced={selectedTrackId[0]}
                    // eslint-disable-next-line react/jsx-no-bind
                    shuffle={shuffleAlbums}
                />
        </div>
    </>;
}
