
import { login } from "./login.js";
export function LoginPage() {
    const appContainer = document.getElementById("app")
    appContainer.innerHTML = `<div id="login-page">
  <form class="login-card" id="login-form">
    <h1>Zone01 Oujda</h1>
    <p>Sign in to view your profile</p>

    <input 
      type="text" 
      id="username" 
      placeholder="Username or Email" 
      required
    />

    <input 
      type="password" 
      id="password" 
      placeholder="Password" 
      required
    />

    <button type="submit" id="login-button">
      Sign In
    </button>

    <div id="login-error">
      Invalid credentials. Please try again.
    </div>
  </form>
</div>`
    
        const loginForm = document.getElementById("login-form");
        if (!loginForm) {
            console.error("Form #login-form not found");
            return;
        }
        
        loginForm.addEventListener("submit", (event) => {
          event.preventDefault();
          console.log("in");
            login();
        });
    
}