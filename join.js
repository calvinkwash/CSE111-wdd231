// ========================================
// CURRENT DATE AND TIME
// ========================================

const timestamp = document.querySelector("#timestamp");

if (timestamp) {
    timestamp.value = new Date().toISOString();
}


// ========================================
// MOBILE NAVIGATION
// ========================================

const menuButton = document.querySelector("#menu-button");
const mainNav = document.querySelector("#main-nav");

if (menuButton && mainNav) {

    menuButton.addEventListener("click", () => {

        const isOpen = mainNav.classList.toggle("open");

        menuButton.setAttribute(
            "aria-expanded",
            isOpen
        );

    });

}


// ========================================
// MEMBERSHIP MODALS
// ========================================

const modalButtons =
    document.querySelectorAll(".modal-button");

const closeButtons =
    document.querySelectorAll(".close-modal");


modalButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const modalId =
            button.getAttribute("data-modal");

        const modal =
            document.querySelector(`#${modalId}`);

        if (modal) {
            modal.showModal();
        }

    });

});


closeButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const modal = button.closest("dialog");

        if (modal) {
            modal.close();
        }

    });

});


// ========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ========================================

document.querySelectorAll("dialog").forEach((dialog) => {

    dialog.addEventListener("click", (event) => {

        const rectangle =
            dialog.getBoundingClientRect();

        const clickedInside =
            event.clientX >= rectangle.left &&
            event.clientX <= rectangle.right &&
            event.clientY >= rectangle.top &&
            event.clientY <= rectangle.bottom;

        if (!clickedInside) {
            dialog.close();
        }

    });

});


// ========================================
// THANK YOU PAGE
// ========================================

const params =
    new URLSearchParams(window.location.search);


const firstName =
    document.querySelector("#display-first-name");

const lastName =
    document.querySelector("#display-last-name");

const email =
    document.querySelector("#display-email");

const phone =
    document.querySelector("#display-phone");

const organization =
    document.querySelector("#display-organization");

const submittedTimestamp =
    document.querySelector("#display-timestamp");


if (firstName) {
    firstName.textContent =
        params.get("first-name") || "Not provided";
}


if (lastName) {
    lastName.textContent =
        params.get("last-name") || "Not provided";
}


if (email) {
    email.textContent =
        params.get("email") || "Not provided";
}


if (phone) {
    phone.textContent =
        params.get("phone") || "Not provided";
}


if (organization) {
    organization.textContent =
        params.get("organization") || "Not provided";
}


if (submittedTimestamp) {

    const value =
        params.get("timestamp");

    if (value) {

        const date =
            new Date(value);

        submittedTimestamp.textContent =
            date.toLocaleString();

    } else {

        submittedTimestamp.textContent =
            "Not provided";

    }

}