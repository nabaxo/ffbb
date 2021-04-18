interface IProps {
    text: string;
    setDetails: (text: string) => void;
}

export default function DetailsOverlay({ text, setDetails }: IProps) {

    return (
        <div className="column overlay">
            <div className="overlay-bg" onClick={() => setDetails('')}></div>
            <div className="column overlay-text">
                <p>{text}</p>
                <div className="close-x" onClick={() => setDetails('')}>🗙</div>
            </div>
        </div>
    );
}
