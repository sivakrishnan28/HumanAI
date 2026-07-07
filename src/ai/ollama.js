async function askOllama(message) {

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "qwen2.5:3b",
            prompt: message,
            stream: false
        })
    });

    const data = await response.json();

    return data.response;
}

module.exports = {
    askOllama
};