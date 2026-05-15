

function drawBarChart(data) {
    const svg = document.getElementById('bar-chart');
    const W = 900, H = 320;
    const pad = { top: 20, right: 20, bottom: 80, left: 60 };
    const chartW = W - pad.left - pad.right;
    const chartH = H - pad.top - pad.bottom;

    if (!data.length) { svg.innerHTML = '<text x="450" y="160" text-anchor="middle" fill="#8892b0">No data</text>'; return; }

    const maxVal = Math.max(...data.map(d => d[1]));
    const barW = chartW / data.length;

    let html = '';

    data.forEach(([name, val], i) => {
        const x = pad.left + i * barW + barW * 0.1;
        const bw = barW * 0.8;
        const bh = (val / maxVal) * chartH;
        const y = pad.top + chartH - bh;

        // Background bar
        html += `<rect class="bar-bg" x="${x}" y="${pad.top}" width="${bw}" height="${chartH}" rx="4"/>`;
        // Value bar
        html += `<rect class="bar-fill" x="${x}" y="${y}" width="${bw}" height="${bh}" rx="4">
               <title>${name}: ${(val / 1000).toFixed(1)} kB XP</title></rect>`;
        // Value label
        html += `<text class="value-text" x="${x + bw / 2}" y="${y - 5}" text-anchor="middle">${(val / 1000).toFixed(0)}k</text>`;
        // X-axis label (rotated)
        const label = name.length > 12 ? name.slice(0, 12) + '…' : name;
        html += `<text class="axis-text" 
               x="${x + bw / 2}" y="${pad.top + chartH + 16}"
               text-anchor="end"
               transform="rotate(-35, ${x + bw / 2}, ${pad.top + chartH + 16})">${label}</text>`;
    });

    // Y-axis
    for (let i = 0; i <= 4; i++) {
        const yPos = pad.top + chartH - (i / 4) * chartH;
        const val = ((i / 4) * maxVal / 1000).toFixed(0);
        html += `<line x1="${pad.left - 6}" y1="${yPos}" x2="${pad.left + chartW}" y2="${yPos}" stroke="#2d3148" stroke-width="1"/>`;
        html += `<text class="axis-text" x="${pad.left - 10}" y="${yPos + 4}" text-anchor="end">${val}k</text>`;
    }

    svg.innerHTML = html;
}

function drawPieChart(passed, failed) {
    const svg = document.getElementById('pie-chart');
    const total = passed + failed;

    if (total === 0) {
        svg.innerHTML = '<text x="250" y="130" text-anchor="middle" fill="#8892b0">No results data</text>';
        return;
    }

    const cx = 160, cy = 130, r = 100;
    const passAngle = (passed / total) * 2 * Math.PI;

    // Arc helper
    function arc(startAngle, endAngle, color, label, percent) {
        const x1 = cx + r * Math.cos(startAngle - Math.PI / 2);
        const y1 = cy + r * Math.sin(startAngle - Math.PI / 2);
        const x2 = cx + r * Math.cos(endAngle - Math.PI / 2);
        const y2 = cy + r * Math.sin(endAngle - Math.PI / 2);
        const lg = endAngle - startAngle > Math.PI ? 1 : 0;

        return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${lg} 1 ${x2} ${y2} Z"
                  fill="${color}" opacity="0.85">
              <title>${label}: ${percent}%</title>
            </path>`;
    }

    const passPercent = ((passed / total) * 100).toFixed(1);
    const failPercent = (100 - passPercent).toFixed(1);

    let html = '';
    if (passed > 0) html += arc(0, passAngle, '#7c83fd', 'Pass', passPercent);
    if (failed > 0) html += arc(passAngle, 2 * Math.PI, '#f87171', 'Fail', failPercent);

    // Center hole (donut)
    html += `<circle cx="${cx}" cy="${cy}" r="${r * 0.5}" fill="#1a1d2e"/>`;
    html += `<text x="${cx}" y="${cy - 8}"  text-anchor="middle" fill="#e2e8f0" font-size="18" font-weight="700">${passPercent}%</text>`;
    html += `<text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="#8892b0" font-size="12">Pass Rate</text>`;

    // Legend
    html += `<rect x="300" y="80"  width="14" height="14" fill="#7c83fd" rx="3"/>`;
    html += `<text class="pie-label" x="322" y="92">Pass — ${passed} (${passPercent}%)</text>`;
    html += `<rect x="300" y="110" width="14" height="14" fill="#f87171" rx="3"/>`;
    html += `<text class="pie-label" x="322" y="122">Fail — ${failed} (${failPercent}%)</text>`;
    html += `<text x="322" y="155" fill="#8892b0" font-size="11">Total results: ${total}</text>`;

    svg.innerHTML = html;
}