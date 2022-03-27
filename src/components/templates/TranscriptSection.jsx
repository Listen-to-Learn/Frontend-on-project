
const TranscriptSection = (props) => {
    return (
        <div className="section d-flex flex-row align-items-start mb-3">
            <button onClick={() => props.skipAudio(props.timestamp)} className="btn btn-grey time text-white">{props.timestamp}</button>
            <div className="transcript-section">
                { props.message.map((phrase) => (
                    <a id={phrase.id} href="#" title={phrase.timestamp} onClick={() => props.skipAudio(phrase.timestamp)} className="text-decoration-none text-dark transcript-phrase py-0 my-1">{phrase.text}&nbsp;</a>
                ))}
            </div>
        </div>
    )
}

export default TranscriptSection
