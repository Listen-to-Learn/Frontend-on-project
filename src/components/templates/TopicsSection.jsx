const TopicsSection = (props) => {
    return (
        <div className="timestamped-topic d-flex mb-2">
            <time className="timestamp fw-bold me-3">
                <button title={props.topic.timestamp} onClick={() => (props.currentPage === 'transcript' ? props.skipAudio(props.topic.timestamp) : null)} className="btn btn-grey text-white p-1">
                    {props.topic.timestamp}
                </button>
            </time>
            <div className={`description mt-1 ${ props.topic.type === 'question' ? "fw-bold": ""}`} >
                {props.topic.text}
            </div>
        </div>
    )
}

export default TopicsSection
