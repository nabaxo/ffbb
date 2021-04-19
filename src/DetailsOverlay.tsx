interface IProps {
    text: string;
    setDetails: (text: string) => void;
}

export default function DetailsOverlay({ text, setDetails }: IProps) {

    return (
        <div className="column overlay">
            <div className="overlay-bg" onClick={() => setDetails('')}></div>
            <div className="column overlay-container">
                <p className="overlay-text preserve-whitespace">{text}</p>
                <div className="close-x" onClick={() => setDetails('')}>🗙</div>
            </div>
        </div>
    );
}
