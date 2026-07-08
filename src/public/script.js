async function loadDashboard() {

    const response = await fetch("/api/dashboard");

    const data = await response.json();

    document.getElementById("messages").innerText = data.totalMessages;

    document.getElementById("contacts").innerText = data.contacts;

    document.getElementById("ai").innerText = data.ai;

    document.getElementById("database").innerText = data.database;

}

loadDashboard();

setInterval(loadDashboard,5000);