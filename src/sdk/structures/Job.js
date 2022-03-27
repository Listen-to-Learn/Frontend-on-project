class Job {
    constructor(jobId, client) {
        this.jobId = jobId
        this.client = client
        this.endpointUrl = `job/${jobId}/`
    }

    async fetchStatus() {
        return await this.client.api.endpoint(this.endpointUrl, "GET")
    }

    onFinish(callback) {
        const wait = async () => {
            const { status } = await this.fetchStatus()
            if (status === "completed")
                callback()
            else    
                setTimeout(wait, 1000);
        }
        setTimeout(wait, 1000);
    }

    waitForFinish() {
        return new Promise((resolve, reject) => {
            try {
                this.onFinish(resolve)
            } catch(error) {
                reject(error)
            }
        })
    }
}

export default Job