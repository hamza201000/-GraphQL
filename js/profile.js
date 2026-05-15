
import { Logout } from "./logout.js";
import { formatXP, Skills } from "./helpers.js"
import {drawPieChart} from "./charts.js"


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
    return json.data;
}

export async function loadProfile() {

    try {
        
const userData = await gql(`
  query {
    user {
      id
      login
      auditRatio
      totalUp
      totalDown
      
      success: audits_aggregate(where: { closureType: { _eq: succeeded } }) {
        aggregate { count }
      }
      failed: audits_aggregate(where: { closureType: { _eq: failed } }) {
        aggregate { count }
      }
    }

    skills: transaction(
      where: { type: { _ilike: "%skill%" } }
      order_by: { amount: desc }
    ) {
      type
      amount
    }

    xp_sum: transaction_aggregate(
      where: { 
        type: { _eq: "xp" }, 
        event: { object: { name: { _eq: "Module" } } } 
      }
    ) {
      aggregate {
        sum { amount }
      }
    }
  }
`);

    const user = userData.user[0];
    const transactions = userData.skills || [];
    const results = user.failed.aggregate.count || [];
    const totalXP = formatXP(userData.xp_sum.aggregate.sum.amount);
    const ratio = user.auditRatio ? user.auditRatio.toFixed(1) : '—';
    const passed = user.success.aggregate.count;
    const failed = user.failed.aggregate.count;
    
    console.log(userData);
    
     

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
        Skills(result)



        document.getElementById('c-login').textContent = user.login;
        document.getElementById('c-xp').textContent = totalXP;
        document.getElementById('c-audit').textContent = ratio;
        drawPieChart(passed, failed)
        document.getElementById('loading').style.display = 'none';
        document.getElementById('content').style.display = 'block';

    } catch (e) {
        document.getElementById('loading').textContent = 'Error loading data: ' + e.message;
    }
}

