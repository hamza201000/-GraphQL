



document.getElementById('login-btn').addEventListener('click', login);


async function login() {
    const identifier = document.getElementById('identifier').value;
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');
    const credentials = btoa(identifier + ':' + password);
    const response = await fetch('https://learn.zone01oujda.ma/api/auth/signin', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`
        },

    });
    if (!response.ok) {
        console.error('Error:', error);
        errorMsg.textContent = 'An error occurred. Please try again later';
        errorMsg.style.display = 'block';
        return;
    }
    const jwt = await response.json();
    localStorage.setItem('jwt', jwt);
    errorMsg.textContent = 'login successful';
    errorMsg.style.display = 'block';
    errorMsg.style.color = 'green';
    console.log(jwt);
    const playload = jwt.split('.')[1];
    const decodedPlayload = JSON.parse(atob(playload));
    fetchProfile();
    console.log(decodedPlayload);

}



async function fetchProfile() {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        console.error('No JWT found. Please log in first.');
        return;
    }
    const playload = jwt.split('.')[1];
    const decodedPlayload = JSON.parse(atob(playload));
    const userId = decodedPlayload['https://hasura.io/jwt/claims']['x-hasura-user-id'];

    const query = `{
    transaction(where: {
      userId: { _eq: ${userId} },
      type:   { _eq: "xp" }
    }) {
      id
      amount
      createdAt
      path
      object { name type }
    }
  }`;
    const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({ query })
    });
    if (!response.ok) {
        console.error('Error:', error);
        return;
    }
    const profileData = await response.json();
    const xp= profileData.data.transaction.reduce((total, transaction) => {
        
            return total + transaction.amount;
        
     
    }, 0);
    
    console.log(profileData);
    console.log(xp);
}