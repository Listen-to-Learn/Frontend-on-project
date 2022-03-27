// root classes
exports.Client = require("./Client").default

// api stuff
exports.Auth = require("./api/Auth").default
exports.Api = require("./api/Api").default

// structures
exports.Conversation = require("./structures/Conversation").default
exports.Job = require("./structures/Job").default

// errors
exports.ApiError = require("./errors/ApiError").default