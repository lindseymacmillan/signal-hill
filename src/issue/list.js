import { useSelect } from '@wordpress/data';
import { useEffect, useState, useRef } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import Marquee from "react-fast-marquee";
import { FaPlay, FaPause, FaMicrophone, FaFileAlt } from 'react-icons/fa';

const Player = ({murmur}) => {

    const unescapeHTML = (html) => {
        if (!html) return '';
        var escapeEl = document.createElement('textarea');
        escapeEl.innerHTML = html;
        return escapeEl.textContent;
    }

    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        // Use the murmur.content.meta.mediaId to get the media url
        const getMedia = async (mediaId) => {
            const media = await apiFetch({path: `/wp/v2/media/${mediaId}`});
            if (audioRef.current) {
                audioRef.current.src = media.source_url;
                audioRef.current.load();
            }
        }
        if (murmur?.content?.meta?.mediaId) {
            setPlaying(false);
            setProgress(0);
            setDuration(0);
            setCurrentTime(0);
            setLoaded(false);
            getMedia(murmur.content.meta.mediaId);
        }
    }, [murmur, audioRef])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('loadedmetadata', () => {
                setDuration(audioRef.current.duration);
                setLoaded(true);
                setPlaying(true);
            });
            audioRef.current.addEventListener('timeupdate', () => {
                setCurrentTime(audioRef.current.currentTime);
                setProgress(audioRef.current.currentTime / audioRef.current.duration);
            });
            audioRef.current.addEventListener('ended', () => {
                setPlaying(false);
                setCurrentTime(0);
            });
        }
    }, [audioRef]);

    useEffect(() => {
        if (audioRef.current) {
            if (playing) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [playing, audioRef]);

    const zeroPad = (num, places) => String(num).padStart(places, '0')

    const readableTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = zeroPad(Math.floor(time % 60),2);
        return `${minutes}:${seconds}`;
    }

    return (
        <div className="murmurs-player">
                <button style={{pointerEvents: loaded ? 'auto' : 'none'}} onClick={() => setPlaying(!playing)}>{playing ? <FaPause /> : <FaPlay />}</button>
                <div className={`murmurs-player-now-playing`}>
                    <Marquee play={true} delay={2} speed={10} loop={!playing}>
                        {unescapeHTML(murmur?.content?.title?.rendered)}  -  {unescapeHTML(murmur?.content?.meta?.speakers)}
                    </Marquee>
                </div>
            <div className="murmurs-player-time">
                <span>{readableTime(currentTime)}</span>/<span>{readableTime(duration)}</span>
            </div>
            <audio ref={audioRef}/>
        </div>
    )


}

const List = ({murmurs}) => {

    const unescapeHTML = (html) => {
        var escapeEl = document.createElement('textarea');
        escapeEl.innerHTML = html;
        return escapeEl.textContent;
    }

    const [murmursWithContent, setMurmursWithContent] = useState([]);
    const [selectedMurmur, setSelectedMurmur] = useState(null);

    useEffect(() => {
        // Setup event listener for murmurSelected
        const handleMurmurSelected = (e) => {
            const murmur = e.detail.murmur;
            const index = e.detail.index;
            setSelectedMurmur(index);
        }
        document.addEventListener('murmurSelected', handleMurmurSelected);
        return () => {
            document.removeEventListener('murmurSelected', handleMurmurSelected);
        }
    }, []);

    useEffect(() => {
        const getMurmurs = async (murmurs) => {
            const ids = murmurs.reduce((acc, murmur) => {
                if (murmur.id && !acc.includes(Number(murmur.id))) acc.push(Number(murmur.id));
                return acc;
            }, []);
            console.log('ids', ids)
            const data = await Promise.all(ids.map(async id => {
                const response = await apiFetch({path: `/wp/v2/murmur/${id}`});
                return response;
            }));
            const newMurmursWithContent = murmurs.map(murmur => {
                const content = data.find(datum => datum.id === Number(murmur.id));
                return {...murmur, content};
            });
            console.log('newMurmursWithContent', newMurmursWithContent)
            setMurmursWithContent(newMurmursWithContent);
        }
        getMurmurs(murmurs);
    }, [murmurs])

    return (
        <>
            <ul className="murmurs-list">
                {murmursWithContent && murmursWithContent.length ? murmursWithContent.map((murmur, index) => {
                    return <li className={selectedMurmur === index ? 'selected' : ''} key={index} onClick={() => {
                        // Dispatch event to select murmur in map
                        const event = new CustomEvent('murmurSelected', {detail: {murmur, index}});
                        document.dispatchEvent(event);
                    }}>
                        <span>{unescapeHTML(murmur?.content?.title.rendered)}</span>
                        <span>{unescapeHTML(murmur?.content?.meta?.location)}</span>
                    </li>
                }) : null}
            </ul>
            <Player murmur={murmursWithContent[selectedMurmur]}/>
        </>
    )
}

export default List;