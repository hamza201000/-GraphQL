

export function drawPieChart(passed, failed) {
    const svg = document.getElementById('pie-chart');
    svg.innerHTML = '';

    const total = passed + failed;

    // Guard: no data yet
    if (total === 0) {
        const msg = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        msg.setAttribute('x', '130');
        msg.setAttribute('y', '120');
        msg.setAttribute('text-anchor', 'middle');
        msg.setAttribute('font-size', '14');
        msg.setAttribute('fill', '#888780');
        msg.textContent = 'No result data found';
        svg.appendChild(msg);
        return;  // stop here, no math below
    }



    const cx = 130, cy = 120, R = 100, r = 58;
    const passRatio = passed / total;
    const PASS_COLOR = '#1D9E75';
    const FAIL_COLOR = '#D85A30';

    function polarToXY(cx, cy, radius, angleRad) {
        return {
            x: cx + radius * Math.cos(angleRad - Math.PI / 2),
            y: cy + radius * Math.sin(angleRad - Math.PI / 2)
        };
    }

    function slicePath(cx, cy, R, r, startAngle, endAngle) {
        const s1 = polarToXY(cx, cy, R, startAngle);
        const e1 = polarToXY(cx, cy, R, endAngle);
        const s2 = polarToXY(cx, cy, r, endAngle);
        const e2 = polarToXY(cx, cy, r, startAngle);
        const large = endAngle - startAngle > Math.PI ? 1 : 0;
        return [
            `M ${s1.x} ${s1.y}`,
            `A ${R} ${R} 0 ${large} 1 ${e1.x} ${e1.y}`,
            `L ${s2.x} ${s2.y}`,
            `A ${r} ${r} 0 ${large} 0 ${e2.x} ${e2.y}`,
            'Z'
        ].join(' ');
    }

    // Pass slice (0 → passRatio * 2π)
    const passEnd = passRatio * 2 * Math.PI;
    const passPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    passPath.setAttribute('d', slicePath(cx, cy, R, r, 0, passEnd));
    passPath.setAttribute('fill', PASS_COLOR);
    passPath.setAttribute('opacity', '0.9');
    svg.appendChild(passPath);

    // Fail slice
    if (failed > 0) {
        const failPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        failPath.setAttribute('d', slicePath(cx, cy, R, r, passEnd, 2 * Math.PI));
        failPath.setAttribute('fill', FAIL_COLOR);
        failPath.setAttribute('opacity', '0.9');
        svg.appendChild(failPath);
    }

    // Center text
    const pct = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    pct.setAttribute('x', cx); pct.setAttribute('y', cy - 6);
    pct.setAttribute('text-anchor', 'middle');
    pct.setAttribute('font-size', '24'); pct.setAttribute('font-weight', '500');
    pct.setAttribute('fill', PASS_COLOR);
    pct.textContent = Math.round(passRatio * 100) + '%';
    svg.appendChild(pct);

    const sub = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    sub.setAttribute('x', cx); sub.setAttribute('y', cy + 14);
    sub.setAttribute('text-anchor', 'middle');
    sub.setAttribute('font-size', '11');
    sub.setAttribute('fill', '#888780');
    sub.textContent = 'pass rate';
    svg.appendChild(sub);

    // Legend (right side)
    const legendX = 270;
    [
        { label: 'Passed', count: passed, color: PASS_COLOR },
        { label: 'Failed', count: failed, color: FAIL_COLOR }
    ].forEach(({ label, count, color }, i) => {
        const ly = 90 + i * 40;

        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        dot.setAttribute('x', legendX); dot.setAttribute('y', ly - 8);
        dot.setAttribute('width', '12'); dot.setAttribute('height', '12');
        dot.setAttribute('rx', '3'); dot.setAttribute('fill', color);
        svg.appendChild(dot);

        const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        lbl.setAttribute('x', legendX + 18); lbl.setAttribute('y', ly + 2);
        lbl.setAttribute('font-size', '13'); lbl.setAttribute('fill', '#888780');
        lbl.textContent = label;
        svg.appendChild(lbl);

        const num = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        num.setAttribute('x', legendX + 18); num.setAttribute('y', ly + 18);
        num.setAttribute('font-size', '18'); num.setAttribute('font-weight', '500');
        num.setAttribute('fill', color);
        num.textContent = count + ' projects';
        svg.appendChild(num);
    });
}