const apiUrl = "https://sini2500-dt207g-2-1.onrender.com/api/workexperience";

const params = new URLSearchParams(window.location.search);
const updatingId = params.get("id");

// Hämta alla
async function getWorkExperience() {

    const response = await fetch(apiUrl);
    const data = await response.json();

    const container = document.getElementById("work-list");
    container.innerHTML = "";

    data.forEach(work => {

        container.innerHTML += `
        <article class="work-card row">

            <div class="work-card-header">
                <h2>${work.companyname}</h2>
                <p class="job-title">${work.jobtitle}</p>
            </div>

            <div class="work-card-body">
                <p><strong>Plats:</strong>${work.location}</p>
                <p><strong>Period:</strong>${work.startdate} - ${work.enddate}</p>
                <p class="description">${work.description}</p>
            </div>

            <div class="work-card-buttons row">
                <a class="updateBtn" href="update.html?id=${work.id}"> Uppdatera </a>
                <button class="deleteBtn" onclick="deleteWork(${work.id})">
                    Radera
                </button>
            </div>

        </article>
        `;

    });

}

// Radera
async function deleteWork(id) {

    await fetch(`${apiUrl}/${id}`, {
        method: "DELETE"
    });

    getWorkExperience();
}

// Lägg till

async function addWorkExperience(e) {

    e.preventDefault();

    const companyname = document.getElementById("companyname").value.trim();
    const jobtitle = document.getElementById("jobtitle").value.trim();
    const location = document.getElementById("location").value.trim();
    const startdate = document.getElementById("startdate").value;
    const enddate = document.getElementById("enddate").value;
    const description = document.getElementById("description").value.trim();

    if (!companyname || !jobtitle || !location || !startdate || !enddate || !description) {
        document.getElementById("message").innerText = "Alla fält måste fyllas i";
        return;
    }

    const work = { companyname, jobtitle, location, startdate, enddate, description };

    const response = await fetch(apiUrl, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(work)

    });

    const data = await response.json();

    document.getElementById("message").innerText = data.message;

}

// Hämta existerande data från en post som ska uppdateras
async function loadWorkExperience(id) {

    const response = await fetch(`${apiUrl}/${id}`);
    const work = await response.json();

    document.getElementById("companyname").value = work.companyname;
    document.getElementById("jobtitle").value = work.jobtitle;
    document.getElementById("location").value = work.location;
    document.getElementById("startdate").value = work.startdate;
    document.getElementById("enddate").value = work.enddate;
    document.getElementById("description").value = work.description;

}

// Uppdatera

async function updateWorkExperience(e) {

    e.preventDefault();

    const work = {
        companyname: document.getElementById("companyname").value.trim(),
        jobtitle: document.getElementById("jobtitle").value.trim(),
        location: document.getElementById("location").value.trim(),
        startdate: document.getElementById("startdate").value,
        enddate: document.getElementById("enddate").value,
        description: document.getElementById("description").value.trim()
    };

    if (!work.companyname || !work.jobtitle || !work.location || !work.startdate || !work.enddate || !work.description) {
        document.getElementById("message").innerText = "Alla fält måste fyllas i";
        return;
    }

    const response = await fetch(`${apiUrl}/${updatingId}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(work)

    });

    const data = await response.json();

    document.getElementById("message").innerText = data.message;

}

// om listan finns
if (document.getElementById("work-list")) {
    getWorkExperience();
}

// om lägg-till formuläret finns
if (document.getElementById("workForm")) {
    document.getElementById("workForm").addEventListener("submit", addWorkExperience);
}

// om uppdatera formuläret finns
if (document.getElementById("updateForm")) {

    if (!updatingId) {
        document.getElementById("message").innerText = "Inget ID hittades";
    } else {
        loadWorkExperience(updatingId);
    }

    document.getElementById("updateForm").addEventListener("submit", updateWorkExperience);
}