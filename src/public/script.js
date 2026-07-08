async function loadDashboard() {

    const response = await fetch("/api/dashboard");

    const data = await response.json();

    document.getElementById("messages").innerText =
        data.totalMessages;

    document.getElementById("contacts").innerText =
        data.contacts;

    document.getElementById("ai").innerText =
        data.ai;

    document.getElementById("database").innerText =
        data.database;

}

async function loadMessages(){

    const response =
        await fetch("/api/messages");

    const messages =
        await response.json();

    const container =
        document.getElementById("latestMessages");

    container.innerHTML="";

    messages.forEach(msg=>{

        container.innerHTML+=`

        <div class="message">

            <strong>${msg.sender}</strong>

            <p>${msg.message}</p>

            <small>${msg.created_at}</small>

        </div>

        `;

    });

}

async function loadReplies(){

    const response = await fetch("/api/replies");

    const replies = await response.json();

    const container = document.getElementById("latestReplies");

    container.innerHTML = "";

    replies.forEach(item => {

        container.innerHTML += `
            <div class="reply">
                <strong>💬 ${item.message}</strong>
                <p>🤖 ${item.reply}</p>
                <small>${item.created_at}</small>
            </div>
        `;

    });

}

async function searchMessages() {

    const keyword = document
        .getElementById("searchInput")
        .value;

    if (!keyword) {

        document.getElementById("searchResults").innerHTML = "";
        return;

    }

    const response = await fetch(`/api/search?q=${encodeURIComponent(keyword)}`);

    const data = await response.json();

    const container = document.getElementById("searchResults");

    container.innerHTML = "";

    data.forEach(msg => {

        container.innerHTML += `
            <div class="message">
                <strong>${msg.sender}</strong>
                <p>${msg.message}</p>
                <small>${msg.created_at}</small>
            </div>
        `;

    });

}

async function loadContacts() {

    const response = await fetch("/api/contacts");

    const contacts = await response.json();

    const container = document.getElementById("contactsList");

    container.innerHTML = "";

    contacts.forEach(contact => {

        container.innerHTML += `
            <div class="contact">
                <strong>${contact.sender}</strong>
                <p>${contact.total} Messages</p>
                <small>${contact.lastMessage}</small>
            </div>
        `;

    });

}

document
.getElementById("searchInput")
.addEventListener("input", searchMessages);

loadDashboard();
loadMessages();
loadReplies();

setInterval(() => {

    loadDashboard();
    loadMessages();
    loadReplies();
    loadContacts();

}, 5000);