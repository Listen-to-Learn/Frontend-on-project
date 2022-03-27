import MessageConverter from "./MessageConverter"
import TopicAndQuestionConverter from "./TopicAndQuestionConverter"

class ConversationConverter {
    constructor() {
        this.messageConverter = new MessageConverter()
        this.topicAndQuestionConverter = new TopicAndQuestionConverter()
    }

    async convert(conversation) {
        const messages = await conversation.fetchSpeechToText({ verbose: false })
        const topics = await conversation.fetchTopics({ parentRefs: false })
        const questions = await conversation.fetchQuestions()

        if (!messages)
            return
        this.messageConverter.convert(messages.messages)

        if (!topics || !questions)
            return 
        this.topicAndQuestionConverter.convert(topics.topics, questions.questions, messages.messages)
    }

    clear() {
        this.messageConverter.messages = []
        this.messageConverter.messagesById = {}
        this.topicAndQuestionConverter.topicsAndQuestions = []
    }
}

export default ConversationConverter