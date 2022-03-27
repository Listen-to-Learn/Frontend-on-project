import Job from "./Job"

class Conversation {
    constructor(conversationId, client, jobs=[]) {
        this.conversationId = conversationId
        this.client = client
        this.jobs = jobs
        this.endpointUrl = `conversations/${conversationId}/`
    }
    
    async updateMetadata(newMetadata = {}) {
        return await this.client.api.endpoint(this.endpointUrl, "PUT", newMetadata)
    }

    async updateMembers(updatedMember = {}) {
        return await this.client.api.endpoint(this.endpointUrl + "members", "PUT", updatedMember)
    }

    async fetchTranscript(params = { "contentType": "text/markdown" }) {
        const headers = { "Content-Type": "application/json" }
        return await this.client.api.endpoint(this.endpointUrl + "transcript", "POST", JSON.stringify(params), null, headers)
    }

    async fetchConversationData() {
        return await this.client.api.endpoint(this.endpointUrl, "GET")
    }

    async fetchSpeechToText(params = { verbose: true }) {
        return await this.client.api.endpoint(this.endpointUrl + "messages", "GET", null, params)
    }
    
    async fetchTopics(params = { parentRefs: true }) {
        return await this.client.api.endpoint(this.endpointUrl + "topics", "GET", null, params)
    }

    async fetchQuestions() {
        return await this.client.api.endpoint(this.endpointUrl + "questions", "GET")
    }

    async fetchEntities() {
        return await this.client.api.endpoint(this.endpointUrl + "entities", "GET")
    }

    async fetchMembers() {
        return await this.client.api.endpoint(this.endpointUrl + "members", "GET")
    }

    async updateConversationWithAudio(audio, streamLength = 0, params = {}) {
        const { jobId } = await this.client.api.createConversationFromData(audio, "process/audio/:" + this.conversationId, "process/audio/url/:" + this.conversationId, "PUT", streamLength, params)
        this.jobs.push(new Job(jobId, this.client))
        return this
    }

    async updateConversationWithVideo(video, streamLength = 0, params = {}) {
        const { jobId } = await this.client.api.createConversationFromData(video, "process/video/:" + this.conversationId, "process/video/url/:" + this.conversationId, "PUT", streamLength, params)
        this.jobs.push(new Job(jobId, this.client))
        return this
    }
}

export default Conversation