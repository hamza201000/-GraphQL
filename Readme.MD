# Zone01 Profile — GraphQL Dashboard

A personal profile dashboard built for the [Zone01 Oujda](https://learn.zone01oujda.ma) school platform. It queries your learning data through GraphQL and visualizes it with custom SVG charts — all rendered in the browser, no framework required.

🔗 **Live Site:** [https://gilded-torrone-f6ce2e.netlify.app](https://gilded-torrone-f6ce2e.netlify.app/)

---

## Features

- **JWT Authentication** — Login with username or email + password via the Zone01 signin endpoint
- **GraphQL Data Fetching** — Queries user info, XP transactions, results, and skills
- **SVG Statistics Graphs** — Hand-crafted charts with no external libraries:
  - XP progress over time
  - XP earned per project
  - Audit ratio
  - Pass / Fail ratio
- **Skills breakdown** — Animated progress bars for each technology
- **Responsive UI** — Works on desktop and mobile
- **Client-side routing** — Single-page app with no page reloads

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Vanilla JavaScript (ES Modules) |
| Styling | CSS3 (custom properties, grid, animations) |
| Data | GraphQL (fetch API) |
| Auth | JWT via Basic Auth (base64) |
| Charts | SVG (hand-written) |
| Hosting | Netlify |

---

## Getting Started

### Prerequisites

- A Zone01 Oujda student account
- Any modern browser (Chrome, Firefox, Edge)

### Run Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

# Serve with any static file server, for example:
npx serve .
# or
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

> ⚠️ Do **not** open `index.html` directly as a file — ES Modules require a server context.

---

## Project Structure

```
.
├── index.html          # App entry point
├── styles.css          # Global styles
└── js/
    ├── auth.js         #Handles JWT logic and API auth
    ├── charts.js       #SVG chart generators
    ├── Error.js        #Error display handling
    ├── helpers.js      #Shared utility functions
    ├── loginPage.js    #Renders the login form UI
    ├── logout.js       #Clears session and redirects
    ├── profile.js      #Fetches and processes profile data
    ├── profilePage.js  #Renders the full profile layout
    └── router.js       #Client-side routing
```

---

## GraphQL Queries Used

The app uses three query types as required by the project spec:

**Normal query** — fetch authenticated user info:
```graphql
{
  user {
    id
    login
  }
}
```

**Nested query** — fetch results with related object data:
```graphql
{
  result {
    id
    grade
    object {
      name
      type
    }
  }
}
```

**Query with arguments** — fetch XP transactions filtered by type:
```graphql
{
  transaction(where: { type: { _eq: "xp" } }) {
    amount
    createdAt
    path
  }
}
```

---

## Authentication Flow

1. User enters credentials on the login page
2. App sends a `POST` to `https://learn.zone01oujda.ma/api/auth/signin` with `Authorization: Basic <base64(login:password)>`
3. On success, the JWT is stored in `localStorage`
4. All subsequent GraphQL requests include `Authorization: Bearer <token>`
5. The JWT payload is decoded client-side to extract the user ID

---

## Deployment

The project is hosted on **Netlify** with automatic deploys from the main branch.

To deploy your own fork:

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Select your repo, set publish directory to `.` (root)
4. Click **Deploy**

---

## License

This project was built as part of the Zone01 Oujda curriculum. Feel free to use it as reference or inspiration for your own profile.