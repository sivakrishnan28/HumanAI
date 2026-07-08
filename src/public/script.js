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

loadDashboard();

loadMessages();

setInterval(()=>{

    loadDashboard();

    loadMessages();

},5000);