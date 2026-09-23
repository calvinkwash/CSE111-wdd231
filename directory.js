const directory = document.querySelector("#directory");
const gridButton = document.querySelector("#grid-button");
const listButton = document.querySelector("#list-button");

const menuButton = document.querySelector("#menu-button");
const nav = document.querySelector("#main-nav");

// Mobile menu
menuButton.addEventListener("click", () => {
const isOpen = nav.classList.toggle("open");

```
menuButton.setAttribute("aria-expanded", isOpen);
menuButton.textContent = isOpen ? "✕" : "☰";
```

});

// Load business information
async function loadDirectory() {

```
try {

    const response = await fetch("data/members.json");

    if (!response.ok) {
        throw new Error("Could not load business data.");
    }

    const members = await response.json();

    displayMembers(members);

} catch (error) {

    console.error(error);

    directory.innerHTML =
        "<p>Business information could not be loaded.</p>";
}
```

}

// Display businesses
function displayMembers(members) {

```
directory.innerHTML = "";

members.forEach(member => {

    const card = document.createElement("article");

    card.className = "directory-card";

    let membership = "Member";

    if (member.membership === 3) {
        membership = "Gold";
    } else if (member.membership === 2) {
        membership = "Silver";
    }

    card.innerHTML = `

        <img
            src="images/${member.image}"
            alt="${member.name}"
            loading="lazy"
        >

        <div class="directory-info">

            <h3>${member.name}</h3>

            <p>
                <strong>Address:</strong>
                ${member.address}
            </p>

            <p>
                <strong>Phone:</strong>
                ${member.phone}
            </p>

            <p>
                <strong>Membership:</strong>
                ${membership}
            </p>

            <p>
                ${member.description}
            </p>

            <a
                href="${member.website}"
                target="_blank"
                rel="noopener noreferrer">
                Visit Website
            </a>

        </div>
    `;

    directory.appendChild(card);
});
```

}

// Grid view
gridButton.addEventListener("click", () => {

```
directory.classList.add("directory-grid");
directory.classList.remove("directory-list");

gridButton.classList.add("active");
listButton.classList.remove("active");
```

});

// List view
listButton.addEventListener("click", () => {

```
directory.classList.add("directory-list");
directory.classList.remove("directory-grid");

listButton.classList.add("active");
gridButton.classList.remove("active");
```

});

// Footer
document.querySelector("#current-year").textContent =
new Date().getFullYear();

document.querySelector("#last-modified").textContent =
document.lastModified;

// Start directory
loadDirectory();