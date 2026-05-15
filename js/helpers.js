export function formatXP(bytes) {
  if (bytes >= 1000000) {
    return (bytes / 1000000).toFixed(1) + " MB";
  } else {
    return (bytes / 1000).toFixed(1) + " KB";
  }
}

export function Skills(skills) {    
    const skillsType = {};
    const svgNS = "http://www.w3.org/2000/svg";
    const skillsChart = document.getElementById("chart-skils");

    for (let skill of skills) {
        if (!skillsType[skill.type] || skill.amount > skillsType[skill.type]) {
            skillsType[skill.type] = skill.amount;
        }
    }

    for (let skill in skillsType) {
        const skillDiv = document.createElement("div");
        skillDiv.classList.add("chart");

        const skillName = document.createElement("span");
        skillName.classList.add("skill-name");
        skillName.textContent = skill + ": " + `${skillsType[skill]}%`;

        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("height", "100%");
        svg.setAttribute("width", "100%");

        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("x", 0);
        rect.setAttribute("y", 0);
        rect.setAttribute("height", "100%");
        rect.setAttribute("width", `${skillsType[skill]}%`);
        rect.setAttribute("rx", 4);
        rect.setAttribute("fill", "#7c83fd");
        
        rect.style.setProperty("--bar-width", `${skillsType[skill]}%`);

        svg.appendChild(rect);
        skillDiv.appendChild(skillName);
        skillDiv.appendChild(svg);
        skillsChart.appendChild(skillDiv);
    }
}