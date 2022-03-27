import fetch from "node-fetch"

class Auth {
    constructor(client) {
        this.client = client
        this.accessToken = ""
        this.appId = ""
        this.appSecret = ""
    }

    async init(appId, appSecret) {
        this.appId = appId
        this.appSecret = appSecret

        const data = {
            "appId": appId,
            "appSecret": appSecret,
            "type": "application"
        }
        
        const res = await fetch("https://api.symbl.ai/oauth2/token:generate", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        })
        const { accessToken, expiresIn } = await res.json()

        this.accessToken = accessToken

        setTimeout(() => {
            this.init(this.appId, this.appSecret)
        }, (expiresIn - 1000) * 1000) // add a bit of time before it actually expires before getting a new one
    }
}

export default Auth