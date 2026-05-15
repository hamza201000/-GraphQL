
import { LoginPage } from "./loginPage.js";

export function Logout() {
        localStorage.removeItem('jwt');
        LoginPage()
}