import fetch from "node-fetch"
import ApiError from "../errors/ApiError"
import Conversation from "../structures/Conversation"
import Job from "../structures/Job"
const apiURL = "https://api.symbl.ai/"
const apiVersion = "v1/"

class Api {
    constructor(client) {
        this.client = client
    }

    async endpoint(endpoint, method, body, params = {}, headers = {}) {
        if (!this.client.auth.accessToken)
            throw new Error("Auth has not been initialized.")

        if (!headers.Authorization)
            headers.Authorization = `Bearer ${this.client.auth.accessToken}`

        const options = {
            method: method,
            body: body,
            headers: headers
        }

        const url = new URL(apiVersion + endpoint, apiURL)
        url.search = new URLSearchParams(params).toString()
        const res = await fetch(url, options)
            .catch((error) => {
                throw new ApiError("Request failed with error: " + error)
            })

        if (!res.ok) 
            throw new ApiError(`Request failed with error: ${res.status}: ${await res.text()}`)

        return await res.json()
    }

    // TODO: make it easier to add params (maybe)
    async createConversationFromAudio(audio, streamLength = 0, params = {}) {
        const { conversationId, jobId } = await this.createConversationFromData(audio, "process/audio", "process/audio/url", "POST", streamLength, params)
        return new Conversation(conversationId, this.client, [ new Job(jobId, this.client) ])
    }

    async createConversationFromVideo(video, streamLength = 0, params = {}) {
        const { conversationId, jobId } = await this.createConversationFromData(video, "process/video", "process/video/url", "POST", streamLength, params, {"Content-Type": "video/mp4"})
        return new Conversation(conversationId, this.client, [ new Job(jobId, this.client) ])
    }

    async createConversationFromData(data, endpoint, urlEndpoint, method, streamLength = 0, params = {}, headers = {}) {
        let res = null
        // if we're given a string it's probably a url
        if (typeof data === "string") {
            if (!params.url)
                params.url = data
            res = await this.endpoint(urlEndpoint, method, JSON.stringify(params), null, {"Content-Type": "application/json"})
        } else {
            headers["Content-Length"] = streamLength
    
            res = await this.endpoint(endpoint, method, data, params, headers)
        }
        return res
    }

    async fetchConversations(params = {}) {
        return await this.endpoint("conversations", "GET", null, params)
    }

    getConversationFromId(conversationId) {
        return new Conversation(conversationId, this.client)
    }
}

export default Api