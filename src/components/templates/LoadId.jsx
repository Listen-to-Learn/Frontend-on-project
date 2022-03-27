import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons"

const LoadId = (props) => {
    return (
        <div>
            <div className="load px-5 d-flex justify-content-center">
                <span className="input-group-text text-secondary fw-bold text-center load-text">Enter Page</span>
                <input className="form-control text-center w-75 text-secondary fw-bold" type="number" id="load-number"/>
                <button className="btn btn-grey text-white" onClick={props.onLoad}>Load Transcript <FontAwesomeIcon icon={faFolderOpen} className="ms-2"></FontAwesomeIcon></button>
            </div>                    
        </div>
    )
}

export default LoadId
