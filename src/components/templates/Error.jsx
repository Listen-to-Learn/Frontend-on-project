const Error = (props) => {
    return (
    <div class="modal d-block error-page" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content error-msg p-3">
                <div class="modal-body d-flex flex-column">
                    <h4 class="modal-title fw-bold my-1">Error</h4> 
                    <span>There was a problem processing your request. Sorry about that.</span>
                    <button type="button" className="btn btn-grey text-white align-self-end" onClick={() => props.onClose(false)}>Close</button>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Error
