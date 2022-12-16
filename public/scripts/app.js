const convertBtn = document.getElementById('click_to_convert')
const sendBtn = document.getElementById('send_message')
const textField = document.getElementById('convert_text')
const messageHistory = document.getElementById('history')
var messageQuery = ''
var synth = window.speechSynthesis;


convertBtn.addEventListener('click', () => {
    var speech = true;
    window.SpeechRecognition = window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.interimResults = true
    recognition.lang = 'en-US';

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)

        textField.innerHTML = transcript
    })

    if (speech = true) {
        recognition.start()
    }
})

sendBtn.addEventListener('click', () => {
    messageQuery += 'You:' + textField.value + '\n'
    messageHistory.value = messageQuery
    messageHistory.scrollTop = messageHistory.scrollHeight;
    fetch('/transcription', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ message: messageHistory.value })
    }).then(res => { return res.text() }).then(res => {
        messageQuery += res + '\n'
        messageHistory.value = messageQuery
        messageHistory.scrollTop = messageHistory.scrollHeight;
        res = res.split('Marv:')[1]
        var utterance = new SpeechSynthesisUtterance(res);
        utterance.lang = 'en-US';
        utterance.voice = synth.getVoices()[6];
        utterance.rate = 1.1
        console.log(synth.getVoices());
        synth.speak(utterance);
    })
})
