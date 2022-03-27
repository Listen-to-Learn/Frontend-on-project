import AppHeader from './AppHeader'
import InputPage from './InputPage';
import TranscriptSection from './templates/TranscriptSection';
import TopicsSection from './templates/TopicsSection';
import Toolbar from './templates/Toolbar';
import Buffer from './Buffer';
import LoadId from './templates/LoadId';
import Error from './templates/Error';
import { useState, useEffect, useRef } from 'react';
import logic from '../logic';
import sdk from '../sdk'

const TranscriptPage = (props) => {
    const client = useRef(new sdk.Client())
    const conversationConverter = useRef(new logic.ConversationConverter())
    const highlightConverter = useRef(new logic.HighlightConverter(conversationConverter.current.messageConverter))
    const onFileUpload = async (file) => {
        let conversation = null
        
        setCurrentPage("buffer")

        if (client.current.auth.accessToken === "") {
            await client.current.init({
                appId: "554d7a6d71387749336f69344c327671734d62553169663231635245394c3849",
                // i swear i know what secret means my finger just slipped
                appSecret: "666e76544141647162717a76733267765536767333725545424967434b6e47663767466a3642676467764545537a386c5446584b4f58553778694263592d5546"
            })
        }

        try {
            if (file.type.startsWith("audio"))
                conversation = await client.current.api.createConversationFromAudio(file, file.size)
            else
                conversation = await client.current.api.createConversationFromVideo(file, file.size)
        } catch(error) {
            console.log(error)
            toggleError(true)
        }

        await conversation.jobs[0].waitForFinish()

        conversationConverter.current.clear()
        await conversationConverter.current.convert(conversation)
        setCurrentTranscript(conversationConverter.current.messageConverter.messages)
        setCurrentTopicsAndQuestions(conversationConverter.current.topicAndQuestionConverter.topicsAndQuestions)
        
        setFile(file)
    }

    const setFile = (file) => {
        setCurrentPage("transcript")
        toggleFullTranscript(true)
           
        const audio = document.getElementById("audioPlayer")
        audio.src = URL.createObjectURL(file)
    }

    const backendUrl = "https://lecture-listener.herokuapp.com/"
    const onLoad = async () => { 
        try {
            setCurrentPage("buffer")      
            const page = document.getElementById("load-number").value; // get page number somehow
            const res = await fetch(backendUrl + "transcription/" + page) 
            const jsonRes = await res.json()
            const json = JSON.parse(jsonRes.response)

            console.log(json)
            setCurrentTopicsAndQuestions(json.topicsAndQuestions)
            setCurrentTranscript(json.transcript)
            setCurrentPage('transcript');           
        } catch(error) {
            console.log(error)
            toggleError(true)
        }
    }

    const onSave = async () => {

        if (currentTranscript === 0)
            return
        try {
            setCurrentPage('buffer')
            const options = {
                method: "POST",
                body: JSON.stringify({
                    transcription: JSON.stringify({
                        transcript: currentTranscript,
                        topicsAndQuestions: currentTopicsAndQuestions,
                    })
                }),
                headers: {
                    "Content-Type": "application/json"
                },
            }
            const res = await fetch(backendUrl + "transcription", options)
            const { page } = await res.json()
            console.log(page)
            setCurrentPage('save')
            setPageNumber(page)            
        } catch(error) {
            console.log(error)
            toggleError(true)
        }
    }

    const [currentTopicsAndQuestions, setCurrentTopicsAndQuestions] = useState([])

    const [currentTranscript, setCurrentTranscript] = useState([])
  
    const [currentTimestamp, setTimestamp] = useState(0);
    
    const [fullTranscript, toggleFullTranscript] = useState(true);

    const [highlightToggle, toggleHighlight] = useState(false)

    const [eraseToggle, toggleErase] = useState(false)
    const [errorToggle, toggleError] = useState(false);

    const [pageNumber, setPageNumber] = useState(0);

    const [currentPage, setCurrentPage] = useState("input");

    const skipAudio = (timestamp) => {
        let timestampArgs = timestamp.split(":");
        let numSecs = 0;
        for (let i = 1; i <= timestampArgs.length; i++){
            numSecs += parseInt(timestampArgs[timestampArgs.length - i]) * (Math.pow(60, i - 1));
        }
        setTimestamp(numSecs);
    }

    useEffect(() => {
        if (currentPage !== 'transcript') return
        const audioPlayer = document.getElementById("audioPlayer")
        audioPlayer.currentTime = currentTimestamp;
        audioPlayer.play()
    }, [currentTimestamp]);

    useEffect(() => {
        if (currentPage === 'input') return
        setCurrentPage("transcript")
    }, [fullTranscript])

    const appStylesheet = useRef(null)
    useEffect(() => {
        if (appStylesheet.current === null) {
            const style = document.createElement("style");
            document.head.appendChild(style); 
            appStylesheet.current = style.sheet;
        }

        if (highlightToggle || eraseToggle) {
            // disable dragging, and turn a tags into regular text
            if (appStylesheet.current.cssRules.item(0) === null)
                appStylesheet.current.insertRule("a { pointer-events: none; cursor: default; user-drag: none; -webkit-user-drag: none; }")
        } else {
            if (appStylesheet.current.cssRules.item(0) !== null && appStylesheet.current.cssRules.item(0).selectorText === "a")
                appStylesheet.current.deleteRule(0)
        }
    }, [highlightToggle, eraseToggle])

    useEffect(() => {
        const button = document.getElementById("highlightButton")
        if (highlightToggle) {
            toggleErase(false)
            button.style.backgroundColor = "rgb(167, 58, 63)"
        } else {
            button.style.backgroundColor = "darkgrey"
        }
    }, [highlightToggle])

    useEffect(() => {
        const button = document.getElementById("eraseButton")
        if (eraseToggle) {
            toggleHighlight(false)
            button.style.backgroundColor = "rgb(167, 58, 63)"
        } else {
            button.style.backgroundColor = "darkgrey"
        }
    }, [eraseToggle])

    useEffect(() => {
        window.addEventListener("beforeunload", (event) => {
            const confirmationMessage = 'It looks like you have been editing something. '
            + 'If you leave before saving, your changes will be lost.';

            (event || window.event).returnValue = confirmationMessage;
            return confirmationMessage; 
        }) 

        const parseHighlight = () => {
            if (!highlightToggle && !eraseToggle)
                return

            const changedMessages = highlightConverter.current.convert(window.getSelection(), eraseToggle)
            if (changedMessages === null)
                return

            window.getSelection().removeAllRanges()
            changedMessages.forEach((element) => {
                const highlights = highlightConverter.current.messageConverter.messagesById[element.id].highlights
                let text = element.textContent
                for (let i = 0; i < highlights.length; i++) {
                    const range = highlights[i]
                    text = text.substring(0, range[0]) + "<mark>" + text.substring(range[0], range[1]) + "</mark>" + text.substring(range[1]);
                }
                element.innerHTML = text
            })
        }

        document.onmouseup = parseHighlight
        document.onkeyup = parseHighlight
    })

    return (
        <div className="container-fluid vw-100 vh-100">
            {errorToggle ? <Error onClose={toggleError} /> : null }
            <AppHeader currentPage={currentPage} changePage={setCurrentPage} onSave={onSave} onLoad={onLoad}></AppHeader>
            <div className="interface d-flex flex-column">
                <div className="playbar h-25 py-4">
                    {(() => {
                        switch (currentPage) {
                            case 'transcript': return <audio id="audioPlayer" className="d-block mx-auto w-75" controls></audio>
                            case 'input': return <InputPage onFileUpload={onFileUpload}/>
                            case 'load' : return <LoadId onLoad={onLoad}/>
                            case 'buffer' : return <Buffer/>
                            case 'save' : return <h3 className="text-secondary text-center fw-bold">Your page number is {pageNumber}</h3>
                        }
                    }) ()
                    }
                </div>
                <div className="info w-100 d-flex justify-content-between align-items-start">
                    <div className="caption-info w-75 d-flex flex-column">
                        <Toolbar eraseToggle={eraseToggle} toggleErase={toggleErase} highlightToggle={highlightToggle} toggleHighlight={toggleHighlight} isFullTranscript={fullTranscript} currentPage={currentPage} toggleTranscript={() => toggleFullTranscript(!fullTranscript)} onComment={() => toggleError(true)}></Toolbar>
                        <div className="transcription p-4 d-block d-flex flex-column overflow-scroll">
                            {(() => { 
                                if (fullTranscript) {
                                    return currentTranscript.map((section) => (
                                        <TranscriptSection skipAudio={skipAudio} timestamp={section.timestamp} message={section.message}/>
                                    ))
                                } else {
                                    const sections = []
                                    currentTranscript.forEach((section) => {
                                        if (section.message.some((message) => message.highlights.length > 0))
                                            sections.push( <TranscriptSection skipAudio={skipAudio} timestamp={section.timestamp} message={section.message}/> )
                                    }) 
                                    return sections
                                }
                            }) ()                
                            }
                        </div>
                    </div>
                    <div className="topics w-25 mt-0 p-4 overflow-scroll">
                        <h4 className="text-center mb-3">Topics and Questions</h4>
                        { currentTopicsAndQuestions.map((section) => (
                            <TopicsSection skipAudio={skipAudio} topic={section} currentPage={currentPage}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TranscriptPage
