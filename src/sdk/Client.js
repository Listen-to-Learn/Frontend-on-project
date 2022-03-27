import Api from "./api/Api"
import Auth from "./api/Auth"

class Client {
    constructor () {
        this.api = new Api(this)
        this.auth = new Auth(this)
    }

    async init(options = {}) {
        const { appId, appSecret } = options

        await this.auth.init(appId, appSecret)
    }
}

export default Client