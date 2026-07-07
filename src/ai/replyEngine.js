function generateReply(text) {

    const lower = text.toLowerCase();

    if (lower.includes("hi") || lower.includes("hello"))
        return "Hey da 👋";

    if (lower.includes("saptiya"))
        return "Innum illa da 😅";

    if (lower.includes("bye"))
        return "Bye da 👋";

    return "Seri da, konjam nerathula reply panren 🙂";
}

module.exports = {
    generateReply
};