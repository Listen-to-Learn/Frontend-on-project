import DateFormatter from "../utils/DateFormatter"

class TopicAndQuestionConverter {
    constructor() {
        this.topicsAndQuestions = []
    }

    convert(topics, questions, messages) {
        if (!topics || !questions || !messages)
            return

        // get message in a dict of id: message
        const messageById = {}
        messages.forEach((message) => messageById[message.id] = message)

        const clipStartTime = new Date(messages[0].startTime)

        // add all occurances of each topic and question to an array
        const sortedArray = []
        topics.forEach((topic) => {
            topic.messageIds.forEach((messageId) => {
                const message = messageById[messageId]
                const topicObject = {
                    type: "topic",
                    text: topic.text,
                    timestamp: new Date(message.startTime) - clipStartTime
                }
                sortedArray.push(topicObject)
            })
        })

        questions.forEach((questions) => {
            questions.messageIds.forEach((messageId) => {
                const message = messageById[messageId]
                const questionObject = {
                    type: "question",
                    text: questions.text,
                    timestamp: new Date(message.startTime) - clipStartTime
                }
                sortedArray.push(questionObject)
            })
        })

        // sort the array by timestamp of each obj
        sortedArray.sort((obj1, obj2) => obj1.timestamp - obj2.timestamp)

        // loop through the array and if the topic/question changes from the previous, add it to our final array, else continue
        let lastTopicOrQuestion = { text: "" }
        sortedArray.forEach((topicOrQuestion) => {
            if (topicOrQuestion.text !== lastTopicOrQuestion.text) {
                if (lastTopicOrQuestion.timestamp === topicOrQuestion.timestamp && lastTopicOrQuestion.type === topicOrQuestion.type) {
                    const lastObject = this.topicsAndQuestions[this.topicsAndQuestions.length - 1]
                    lastObject.text += ", " + topicOrQuestion.text
                    
                    if (this.topicsAndQuestions.length > 1 && this.topicsAndQuestions[this.topicsAndQuestions.length - 2].text === lastObject.text)
                        this.topicsAndQuestions.splice(this.topicsAndQuestions.length - 1, 1)
                } else {
                    const topicOrQuestionObject = {
                        type: topicOrQuestion.type,
                        text: topicOrQuestion.text.charAt(0).toUpperCase() + topicOrQuestion.text.slice(1),
                        timestamp: DateFormatter.toMinutesAndHours(new Date(topicOrQuestion.timestamp))
                    }
                    this.topicsAndQuestions.push(topicOrQuestionObject)
                }
            }
            lastTopicOrQuestion = topicOrQuestion
        })
    }
}

export default TopicAndQuestionConverter