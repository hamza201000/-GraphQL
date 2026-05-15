
import { LoginPage } from "./loginPage.js"
import {ProfilePage} from "./profilePage.js"
import {login} from "./login.js"
// Auto-login if JWT stored
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('jwt')) {
        ProfilePage()
    } else {
        LoginPage()
    }
});



