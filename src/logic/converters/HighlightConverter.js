import ArrayUtils from "../utils/ArrayUtils"

class HighlightConverter {
    constructor(messageConverter) {
        this.messageConverter = messageConverter
    }

    convert(selection, erase=false) {
        if (selection.type !== "Range" || selection.rangeCount === 0)
            return null

        const changedElements = []
        for (let i = 0; i < selection.rangeCount; i++) {
            const range = selection.getRangeAt(i)
                
            const ancestor = range.commonAncestorContainer
            const startNode = range.startContainer
            const endNode = range.endContainer

            // get first a tags so we dont need to worry about the stupid mark tags 
            let startElement = startNode.parentElement
            while (startElement.tagName !== "A")
                startElement = startElement.parentElement

            let endElement = endNode.parentElement   
            while (endElement.tagName !== "A")
                endElement = endElement.parentElement

            const transcriptContainer = document.getElementsByClassName("transcription")[0]
            // if there is highlighting out of the transcription
            if (!transcriptContainer.contains(ancestor))
                return null

            // if the end node is part of the space at the end, we have to specially assign it an offset
            let endOffset = -1
            if (endNode.data.trim() === "") {
                endOffset = endElement.textContent.length
            } else {
                // we also need to check if there are any nodes before ours and add their string length to the offsets
                endOffset = range.endOffset
                // loop through child nodes to get the index from now
                for (let i = 0; i < endElement.childNodes.length; i++) {
                    const node = endElement.childNodes[i]
                    
                    if (node.isSameNode(endNode.parentElement) || node.isSameNode(endNode))
                        break
                    endOffset += node.textContent.length
                }
            }

            // do same for beginning 
            let startOffset = -1
            if (startNode.data.trim() === "") {
                startOffset = startElement.textContent.length - 1
            } else {
                // we also need to check if there are any nodes before ours and add their string length to the offsets
                startOffset = range.startOffset
                // loop through child nodes to get the index from now
                for (let i = 0; i < startElement.childNodes.length; i++) {
                    const node = startElement.childNodes[i]
                    
                    if (node.isSameNode(startNode.parentElement) || node.isSameNode(startNode))
                        break
                    startOffset += node.textContent.length
                }
            }

            // get row of end and start nodes
            let startRowContainer = startElement
            while (!startRowContainer.classList.contains("section"))
                startRowContainer = startRowContainer.parentElement

            let endRowContainer = endElement
            while (!endRowContainer.classList.contains("section"))
                endRowContainer = endRowContainer.parentElement
            
            // if all the highlighting is neatly through the same section, then we can just loop using the offsets
            if (endRowContainer.isSameNode(startRowContainer)) {
                // if theyre the same then it's special
                if (startElement.isSameNode(endElement)) {
                    ArrayUtils.pushRangeNoOverlap(this.messageConverter.messagesById[startElement.id].highlights, [ startOffset, endOffset ], erase)
                    changedElements.push(startElement)
                    return changedElements
                }

                // do start one becuase it is special
                ArrayUtils.pushRangeNoOverlap(this.messageConverter.messagesById[startElement.id].highlights, [ startOffset, startElement.textContent.length ], erase)
                changedElements.push(startElement)

                let currentElement = startElement.nextSibling
                while (!currentElement.isSameNode(endElement)) {
                    if (!erase)
                        this.messageConverter.messagesById[currentElement.id].highlights = [ [ 0, currentElement.textContent.length ] ]
                    else
                        this.messageConverter.messagesById[currentElement.id].highlights = [ ]
                    changedElements.push(currentElement)

                    currentElement = currentElement.nextSibling
                }

                // do last becuase it's also special
                ArrayUtils.pushRangeNoOverlap(this.messageConverter.messagesById[endElement.id].highlights, [ 0, endOffset ], erase)
                changedElements.push(endElement)
                return changedElements
            }

            // update the message of the start node first
            ArrayUtils.pushRangeNoOverlap(this.messageConverter.messagesById[startElement.id].highlights, [ startOffset, startElement.textContent.length ], erase)
            changedElements.push(startElement)

            // loop through sibllings till at next row
            let currentElement = startElement.nextSibling
            while (currentElement) {
                if (!erase)
                    this.messageConverter.messagesById[currentElement.id].highlights = [ [ 0, currentElement.textContent.length ] ]
                else
                    this.messageConverter.messagesById[currentElement.id].highlights = [ ]
                changedElements.push(currentElement)

                currentElement = currentElement.nextSibling
            }

            // loop through all the rows between start and end and grab the necessary data
            let currentRowContainer = startRowContainer.nextSibling
            while (!currentRowContainer.isSameNode(endRowContainer)) {
                const phrases = currentRowContainer.getElementsByClassName("transcript-phrase")
                for (let i = 0; i < phrases.length; i++) {
                    if (!erase)
                        this.messageConverter.messagesById[phrases[i].id].highlights = [ [ 0, phrases[i].textContent.length ] ]
                    else
                        this.messageConverter.messagesById[phrases[i].id].highlights = [ ]
                    changedElements.push(phrases[i])
                }

                currentRowContainer = currentRowContainer.nextSibling
            }
                
            // do last element
            ArrayUtils.pushRangeNoOverlap(this.messageConverter.messagesById[endElement.id].highlights, [0, endOffset], erase)
            changedElements.push(endElement)

            // do last row // go backwards so a getElementsByClassName call isn't needed
            currentElement = endElement.previousSibling
            while (currentElement) {
                if (!erase)
                    this.messageConverter.messagesById[currentElement.id].highlights = [ [ 0, currentElement.textContent.length ] ]
                else
                    this.messageConverter.messagesById[currentElement.id].highlights = [ ]
                changedElements.push(currentElement)

                currentElement = currentElement.previousSibling
            }
        }
        return changedElements
    }
}

export default HighlightConverter