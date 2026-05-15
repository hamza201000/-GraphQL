
import { Logout } from "./logout.js";
import { loadProfile } from "./profile.js";

export function ProfilePage() {
    const appContainer = document.getElementById("app")
    appContainer.innerHTML = `
<div id="profile-page">
  <nav>
    <span>Zone01 Profile</span>
    <button id="Logout-button">Logout</button>
  </nav>

  <div class="container">
    <div id="loading">Loading your data…</div>

    <div id="content" style="display:none">

      <!-- Info cards -->
      <div class="cards">
        <div class="card">
          <div class="label">Login</div>
          <div class="value" id="c-login" style="font-size:1.4rem">—</div>
        </div>
        <div class="card">
          <div class="label">Total XP</div>
          <div class="value" id="c-xp">—</div>
          <div class="sub">kB earned</div>
        </div>
        <div class="card">
          <div class="label">Audit Ratio</div>
          <div class="value" id="c-audit">—</div>
          <div class="sub">done / received</div>
        </div>
        
      </div>

      <div  id="chart-skils">
        <h2>📊 Progress </h2>
      </div>

      <div class="section">
        <h2>🎯 Pass / Fail Ratio</h2>
        <svg id="pie-chart" width="100%" height="260" viewBox="0 0 500 260"></svg>
      </div>
    
  
    
  `

    
        const button = document.getElementById("Logout-button")
        button.addEventListener("click", () => {
            Logout()
        })
 
    loadProfile()
}


