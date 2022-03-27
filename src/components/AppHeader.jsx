import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFile, faFolderOpen, faSave } from "@fortawesome/free-solid-svg-icons"
import logo from "../images/logo.png";

const AppHeader = (props) => {
    return (
        <div id="header" className="header d-flex justify-content-center position-relative">
            <div className="header-button-container d-flex flex-row start-0 mx-2 position-absolute w-25">
                <div className="newButton mx-2">
                    <button className="btn btn-grey text-white" type="button" onClick={() => props.changePage("input")}>
                        <FontAwesomeIcon icon={faFile} />
                        <span className="ps-2">New</span>
                    </button>
                </div>
                <div className="saveButton mx-2">
                    <button className="btn btn-grey text-white" type="button" onClick={props.onSave}>
                        <FontAwesomeIcon icon={faSave} />
                        <span className="ps-2">Save</span>
                    </button>
                </div>
                <div className="loadButton mx-2">
                    <button className="btn btn-grey text-white" type="button" onClick={() => props.changePage("load")} data-bs-target="#load-input">
                        <FontAwesomeIcon icon={faFolderOpen} />
                        <span className="ps-2">Load</span>
                    </button>
                </div>
            </div>
            <div className="title mx-auto text-center">
                <img className="image logo" alt="logo" src={logo}></img>
            </div>
        </div>
    )
}

export default AppHeader
