# Insighta Web Portal

Modern web interface for Insighta profile management with GitHub OAuth authentication, natural language search, and responsive design built with vanilla JavaScript and Tailwind CSS.

## Production Links

**Web Portal:** https://insighta-web-portal-production.up.railway.app  
**API:** https://ubiquitous-chainsaw-production-5f71.up.railway.app

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Configuration](#api-configuration)
- [Development](#development)
- [Deployment](#deployment)

## Features

✅ GitHub OAuth authentication (cookie-based sessions)  
✅ Natural language profile search  
✅ Advanced filtering (gender, age, country, probability scores)  
✅ Theme switching (6 themes: light, dark, cupcake, business, cyberperk, forest)  
✅ Unified drawer navigation  
✅ Toast notifications  
✅ Responsive design (Tailwind CSS + DaisyUI)  
✅ Profile management (browse, filter, view details)

## Tech Stack

**Frontend:** Vanilla JavaScript (ES6 modules), HTML5  
**CSS:** Tailwind CSS + DaisyUI (CDN)  
**Icons:** Lucide Icons  
**Dev Server:** http-server  
**Auth:** Cookie-based JWT with HttpOnly cookies

## Architecture

**Modular Structure:**

- **Layout System**: Unified drawer navigation (`layout.js`)
- **Components**: Reusable UI elements (`components.js`)
- **Page Scripts**: Individual modules in `js/pages/`
- **API Client**: Centralized API wrapper (`api.js`)
- **Auth System**: Cookie-based authentication (`auth.js`)
- **Toast System**: Global notifications (`toast.js`)

**Pages:**

- `dashboard.html` - Statistics and overview
- `profiles.html` - Browse with advanced filters
- `search.html` - Natural language search
- `account.html` - User profile and settings
- `profile-detail.html` - Individual profile view
- `login.html` - GitHub OAuth login

## Installation

```bash
npm install
npm start
```

Access at: `http://localhost:5500`

## Project Structure

```
web-portal/
├── *.html              # Page templates
├── js/
│   ├── api.js          # API client
│   ├── auth.js         # Authentication
│   ├── config.js       # Configuration
│   ├── layout.js       # Drawer layout
│   ├── components.js   # UI components
│   ├── toast.js        # Notifications
│   ├── utils.js        # Utilities
│   └── pages/          # Page scripts
│       ├── dashboard.js
│       ├── profiles.js
│       ├── search.js
│       ├── account.js
│       ├── profile-detail.js
│       └── login.js
├── css/
│   └── styles.css      # Custom styles
└── package.json
```

## Usage

### Authentication Flow

1. Visit `http://localhost:5500` (redirects to dashboard)
2. If not authenticated, redirected to login page
3. Click "Continue with GitHub" → OAuth flow
4. Authorize application on GitHub
5. Redirect to dashboard with HttpOnly cookies set
6. Session persists across page refreshes

### Natural Language Search

Navigate to **Search** page and enter queries:

- "females from Nigeria above 30"
- "male adults from United States"
- "teenagers below 16"
- "adults from Germany with above 40"

Results display in paginated table with "View Details" option.

### Advanced Filtering

Navigate to **Profiles** page, click "Show Filters":

**Filter Options:**

- Gender: male/female
- Age Group: child/teen/adult/senior
- Age Range: min/max age
- Country ID: ISO country code
- Minimum Probabilities: gender/country confidence

**Additional Options:**

- Sorting: Date Added, Age, Gender Probability
- Results per page: 10, 25, 50
- Pagination controls

### Theme Switching

1. Click theme toggle icon in navigation
2. Cycle through 6 themes (Light, Dark, Cupcake, Business, Cyberpunk, Forest)
3. Preference saved in localStorage

### Account Page

View GitHub profile information, role badge, and account details.

## API Configuration

**Base URL:** `http://localhost:3000` (configure in `js/config.js`)

**Required Headers:**

- `X-API-Version: 1`
- `credentials: 'include'` (sends cookies)

**Authentication:**

- Access tokens in HttpOnly cookies (automatic)
- Refresh tokens in HttpOnly cookies
- No manual token management

### Backend Requirements

**1. CORS Configuration:**

```javascript
app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
  }),
);
```

**2. OAuth Redirect:**

- After successful GitHub OAuth, redirect to: `http://localhost:5500/dashboard.html`
- Set access_token and refresh_token as HttpOnly cookies before redirect

**3. API Endpoints:**

- `GET /api/users/me` - Current user info
- `GET /api/profiles` - All profiles (supports filters, pagination, sorting)
- `GET /api/profiles/:id` - Specific profile by ID
- `GET /api/profiles/search` - Natural language search

## Development

### Testing

**1. Start servers:**

```bash
# Terminal 1: Backend
cd ../stage-one && node app.js

# Terminal 2: Frontend
npm start
```

**2. Test authentication:**

- Navigate to `http://localhost:5500`
- Click "Login with GitHub"
- Verify redirect to dashboard

**3. Test features:**

- Search: Natural language queries
- Profiles: Filter combinations, sorting, pagination
- Account: Profile info and role display
- Theme: Switch and verify persistence

### Common Issues

| Issue                       | Solution                                                                    |
| --------------------------- | --------------------------------------------------------------------------- |
| CORS errors                 | Verify backend CORS: `origin: 'http://localhost:5500'`, `credentials: true` |
| Not redirecting after login | Check backend redirects to `http://localhost:5500/dashboard.html`           |
| "No access token" error     | Verify backend sets `access_token` cookie before redirect                   |
| Search/filters not working  | Check backend API supports query parameters                                 |
| Theme not persisting        | Verify localStorage is enabled                                              |
| Navigation drawer broken    | Ensure DaisyUI CSS loaded and Lucide icons initialized                      |

## Deployment

### Railway Deployment (Recommended)

**1. Connect Repository:**

- Go to [railway.app](https://railway.app)
- New Project → Deploy from GitHub repo
- Select repository (auto-detects `railway.json`)

**2. Or via CLI:**

```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

**3. Configuration:**

- Update `API_BASE_URL` in `js/config.js` to backend Railway URL
- Railway auto-assigns public URL for frontend
- `railway.json` configures: `npx http-server -p $PORT --cors`

**4. Update Backend:**

```javascript
// Backend CORS
app.use(
  cors({
    origin: "https://your-frontend.railway.app",
    credentials: true,
  }),
);
```

**5. Update GitHub OAuth:**

- Homepage URL: `https://your-frontend.railway.app`
- Callback URL: Backend's callback endpoint

**Tips:**

- Auto-redeploy on git push
- Check logs in Railway dashboard
- Use environment variables for sensitive config
- Domain mapping available in project settings

### Other Platforms (Vercel, Netlify, Cloudflare Pages)

1. No build required (static files)
2. Configure production API URL in `js/config.js`
3. Update `API_BASE_URL` to production backend
4. Deploy entire directory
5. Start command: `npx http-server -p $PORT --cors`

**Note:** Application uses native ES6 modules - ensure hosting serves correct MIME types.

### Backend Production Config

```env
FRONTEND_URL=https://your-frontend-url.com
REDIRECT_URI=https://your-backend-url.com/auth/github/callback
```

Update GitHub OAuth App with production callback URL.

### Security Checklist

- [ ] Use HTTPS in production
- [ ] Set `secure: true` for cookies
- [ ] Configure CSP headers
- [ ] Enable rate limiting on backend
- [ ] Monitor for suspicious activity

## Browser Support

Chrome/Edge, Firefox, Safari (latest versions)  
Mobile: iOS Safari, Chrome Mobile

## File Structure Details

**HTML Files:** Page templates at root level  
**JS Modules:** ES6 modules in `js/` folder  
**Styles:** Custom CSS in `css/styles.css`  
**Config:** `railway.json` for Railway deployment

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## Troubleshooting

**Backend API logs:** Check for CORS/auth errors  
**Browser console:** Check for JavaScript errors  
**CORS config:** Verify origin and credentials settings  
**OAuth callback:** Verify GitHub App settings match URLs

---

**Part of HNG Internship Program**
