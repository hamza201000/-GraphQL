import { showError } from "./Error.js";
import { loadProfile } from "./profile.js";
import { ProfilePage } from "./profilePage.js";



/* ════════════════ AUTH ════════════════ */
export async function login() {

    const userInput = document.getElementById("username");
    const passInput = document.getElementById("password");

    const user = userInput.value.trim();
    const pass = passInput.value;

    if (!user || !pass) {
        showError("Please fill in all fields.");
        return;
    }
    
    const creds = btoa(`${user}:${pass}`);
    
    try {
        
        const res = await fetch("https://learn.zone01oujda.ma/api/auth/signin", {
            method: "POST",
            headers: {
                Authorization: `Basic ${creds}`
            }
        });
        
        if (!res.ok) {
            console.log(res);
            showError("Invalid credentials. Please try again.");
            return;
        }
        
        const data = await res.json();
        
        // token may be string or object
        const token =
            typeof data === "string"
                ? data
                : data.token || data;

        localStorage.setItem("jwt", token);

        ProfilePage()
        console.log("hi");
        
        // load profile
       loadProfile();

    } catch (error) {

        console.error(error);

        showError("Network error. Please try again.");
    }
}

/* ════════════════ EVENTS ════════════════ */
// document.addEventListener("DOMContentLoaded", () => {

    

// });