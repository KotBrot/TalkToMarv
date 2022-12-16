require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(demoLogger)

// Use body-parser middleware to parse URL-encoded request bodies
app.use(bodyParser.json())

// Set the view engine to EJS
app.set("view engine", "ejs");
app.use(express.static("public"));

// Respond to the "GET /" route with the index.ejs file
app.get("/", function (req, res) {
    res.render("index");
});

// Apply the body-parser middleware to the /transcription route
app.post("/transcription", bodyParser.urlencoded({ extended: true }), function (req, res) {
    fetchAIResponse(req.body.message).then(resp => {
        return resp.data.choices[0].text
    }).then(resp => res.send(resp))
});

app.get("/healthCheck", (req, res) => {
    res.rend('OK')
})

app.listen(3000, function () {
    console.log("Listening on port 3000");
});

async function fetchAIResponse(req) {
    try {
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "Marv is a chatbot that reluctantly answers questions with sarcastic responses:\n\nYou: How many pounds are in a kilogram?\nMarv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\nYou: What does HTML stand for?\nMarv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\nYou: When did the first airplane fly?\nMarv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\nYou: What is the meaning of life?\nMarv: I’m not sure. I’ll ask my friend Google.\nYou: What time is it?\nMarv:" + req,
            temperature: 0.5,
            max_tokens: 60,
            top_p: 0.3,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        return response
    } catch (error) {
        return 'Bad Request'
    }

}

function getActualRequestDurationInMilliseconds(start) {
    const NS_PER_SEC = 1e9; //  convert to nanoseconds
    const NS_TO_MS = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

function demoLogger(req, res, next) { //middleware function
    let current_datetime = new Date();
    let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    const start = process.hrtime();
    const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
    let log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`;
    console.log(log)
    next();
};
