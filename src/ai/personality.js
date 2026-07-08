function getPersonality(contact) {

    if (contact.includes("9198")) {
        return "Close Friend";
    }

    return "Normal Contact";
}

module.exports = {
    getPersonality
};