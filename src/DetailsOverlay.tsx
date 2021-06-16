import { useEffect, useRef } from "react";

interface IProps {
    text: string;
    setDetails: (text: string) => void;
}

export default function DetailsOverlay({ text, setDetails }: IProps) {
    const ref = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.focus();
        }
    }, []);

    return (
        <div className="column overlay">
            <div className="overlay-bg" onClick={() => setDetails('')}></div>
            <div className="column overlay-container">
                <p tabIndex={0} ref={ref} className="overlay-text preserve-whitespace">{text}</p>
                <div className="close-x" onClick={() => setDetails('')}>🗙</div>
            </div>
        </div>
    );
}
