import { faEraser, faHighlighter } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Toolbar = (props) => {
    return (
        <div className="toolbar p-4 my-0 d-flex justify-content-left">
            <button id="highlightButton" className="btn text-white me-2" onClick={() => props.toggleHighlight(!props.highlightToggle)}>
                <FontAwesomeIcon icon={faHighlighter}></FontAwesomeIcon>
                <span className="ps-2">Highlight</span>
            </button>
            <button id="eraseButton" className="btn text-white mx-2" onClick={() => props.toggleErase(!props.eraseToggle)}>
                <FontAwesomeIcon icon={faEraser}></FontAwesomeIcon>
                <span className="ps-2">Erase</span>
            </button>
            <button className="btn btn-grey text-white mx-2" onClick={props.toggleTranscript}>{props.isFullTranscript ? "View Highlighted Sections" : "View Full Transcript"}</button>
        </div>
    )
}

export default Toolbar
