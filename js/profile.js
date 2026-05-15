
import { Logout } from "./logout.js";
import { formatXP, Skills } from "./helpers.js"
/* ════════════════ GRAPHQL ════════════════ */
export async function gql(query) {
    const res = await fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({ query })

    });
    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);
    console.log('this issssss the data-------------------------', json.data);

    return json.data;
}

/* ════════════════ LOAD PROFILE ════════════════ */
export async function loadProfile() {

    try {
        // 1. Basic user info
        const userData = await gql(`query { user { id login 
             
            success: audits_aggregate(where: { closureType: { _eq: succeeded } }) {
      aggregate { count }
    }

    failed: audits_aggregate(where: { closureType: { _eq: failed } }) {
      aggregate { count }
    }
    
    
            }
      skils: transaction(
    where: { type: { _ilike: "%skill%" } }
    order_by: { amount: desc }
  ) {
    type
    amount
  }
            }
    
            `);

        const user = userData.user[0];
        console.log(user);
        //2. XP transactions (only div-01 path, type xp)
        const xpData = await gql(`{
     transaction_aggregate(
    where: { type: { _eq: "xp" }, event: { object: { name: { _eq: "Module" } } } }
  ) {
    aggregate { sum { amount } }
  }
    }`);


        // 3. Audit data
        const auditData = await gql(`{
      user { auditRatio totalUp totalDown }
    }`);
        // ── Process ──
        console.log("tran", userData.skils);
        const transactions = userData.skils || [];
        const auditUser = auditData.user[0] || {};
        const results = user.failed.aggregate.count || [];

        // Total XP
        const totalXP = formatXP(xpData.transaction_aggregate.aggregate.sum.amount);

        // Audit ratio
        const ratio = auditUser.auditRatio ? auditUser.auditRatio.toFixed(1) : '—';

        // Pass / Fail
        const passed = user.success.aggregate.count;
        const failed = user.failed.aggregate.count;

        // Top 10 projects by XP
        // const projectMap = {};
        // transactions.forEach(t => {
        //     const name = t.object?.name || t.path.split('/').pop();
        //     projectMap[name] = (projectMap[name] || 0) + t.amount;
        // });
        // const top10 = Object.entries(projectMap)
        //     .sort((a, b) => b[1] - a[1])
        //     .slice(0, 10);

        const result = Object.values(
            transactions.reduce((acc, item) => {
                const type = item.type.replace("skill_", "");
                // keep only the biggest amount
                if (!acc[type] || item.amount > acc[type].amount) {
                    acc[type] = {
                        type,
                        amount: item.amount,
                    };
                }

                return acc;
            }, {})
        );

        console.log(result);
        Skills(result)



        // ── Render ──
        document.getElementById('c-login').textContent = user.login;
        document.getElementById('c-xp').textContent = totalXP;
        document.getElementById('c-audit').textContent = ratio;
        // drawBarChart(top10);
        // drawPieChart(passed, failed);
        drawPieChart(passed, failed)
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';

    } catch (e) {
        document.getElementById('loading').textContent = 'Error loading data: ' + e.message;
    }
}


export function drawPieChart(passed, failed) {
    console.log(passed);
    console.log(failed);


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