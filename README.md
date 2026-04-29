# Insighta Web Portal

A modern web-based user interface for the Insighta profile management system. Built with vanilla HTML, JavaScript, and Tailwind CSS.

## Features

✅ **GitHub OAuth Authentication** - Secure browser-based OAuth flow  
✅ **Cookie-based Sessions** - Automatic authentication with HttpOnly cookies  
✅ **Natural Language Search** - Search profiles using plain English queries  
✅ **Advanced Filtering** - Filter profiles by gender, age group, country, and probability scores  
✅ **Theme Switching** - Choose from 6 different themes (light, dark, cupcake, business, cyberpunk, forest)  
✅ **Unified Navigation** - Drawer-based layout with consistent navigation across all pages  
✅ **Toast Notifications** - Real-time feedback for user actions  
✅ **Responsive Design** - Mobile-friendly interface built with DaisyUI and Tailwind CSS  
✅ **Profile Management** - Browse, filter, and view detailed profile information

## Prerequisites

- Node.js (v14 or higher)
- Backend API server running (stage-one/)
- GitHub OAuth App configured

## Tech Stack

- **Frontend Framework**: Vanilla JavaScript (ES Modules)
- **CSS Framework**: Tailwind CSS + DaisyUI
- **Icons**: Lucide Icons
- **Development Server**: http-server
- **Module System**: Native ES6 modules

## Architecture

The application follows a modular architecture:

- **Layout System**: Unified drawer navigation across all pages (`layout.js`)
- **Component Library**: Reusable UI components for tables, pagination, etc. (`components.js`)
- **Page Scripts**: Each page has its own module in `js/pages/`
- **API Client**: Centralized API wrapper with error handling (`api.js`)
- **Auth System**: Cookie-based authentication with automatic token management (`auth.js`)
- **Toast Notifications**: Global notification system (`toast.js`)

## Installation

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm start
   ```

3. **Access the portal:**
   Open your browser and navigate to `http://localhost:5500`

## Project Structure

```
web-portal/
├── index.html               # Redirects to dashboard
├── login.html               # Login page with GitHub OAuth
├── dashboard.html           # Main dashboard with statistics
├── profiles.html            # Browse profiles with advanced filters
├── search.html              # Natural language profile search
├── account.html             # User account/profile page
├── profile-detail.html      # Individual profile detail view
├── 404.html                 # Error page
├── js/
│   ├── api.js              # API client with fetch wrapper
│   ├── auth.js             # Authentication logic
│   ├── config.js           # Configuration constants
│   ├── layout.js           # Drawer layout system
│   ├── components.js       # Reusable UI components
│   ├── toast.js            # Toast notification system
│   ├── utils.js            # Utility functions
│   └── pages/              # Page-specific scripts
│       ├── dashboard.js    # Dashboard page logic
│       ├── profiles.js     # Profiles page with filters
│       ├── search.js       # Search page logic
│       ├── account.js      # Account page logic
│       ├── profile-detail.js  # Profile detail view
│       └── login.js        # Login page logic
├── css/
│   └── styles.css          # Custom styles
├── package.json
├── railway.json            # Railway deployment configuration
└── README.md
```

## Usage

### Authentication Flow

1. Visit the portal at `http://localhost:5500` (redirects to dashboard)
2. If not authenticated, you'll be redirected to the login page
3. Click "Continue with GitHub" to start OAuth flow
4. Authorize the application on GitHub
5. You'll be redirected back to the dashboard
6. Session persists across page refreshes (cookie-based)

### Navigation

The portal features a unified drawer layout with four main pages:

- **Dashboard** - View statistics and profile overview
- **Profiles** - Browse all profiles with advanced filtering options
- **Search** - Natural language search for profiles
- **Account** - View your GitHub profile information and role

### Searching Profiles (Natural Language)

1. Navigate to the **Search** page
2. Enter a natural language query:
   - "females from Nigeria above 30"
   - "male adults from United States"
   - "teenagers below 16"
   - "adults from Germany with above 40"
3. Click **Search** or press Enter
4. Results display in a paginated table
5. Use pagination controls to browse results
6. Click "View Details" to see individual profile information

### Browsing Profiles (Advanced Filters)

1. Navigate to the **Profiles** page
2. Click "Show Filters" to reveal filter options:
   - **Gender**: Filter by male or female
   - **Age Group**: Filter by child, teen, adult, or senior
   - **Age Range**: Set minimum and maximum age
   - **Country ID**: Filter by specific country
   - **Minimum Probabilities**: Filter by gender or country confidence scores
3. Adjust sorting (Date Added, Age, Gender Probability)
4. Change results per page (10, 25, or 50)
5. Browse results with pagination controls
6. Click "View Details" to see individual profile information

### Theme Switching

1. Click the theme toggle icon in the navigation bar
2. Cycle through available themes:
   - Light
   - Dark
   - Cupcake
   - Business
   - Cyberpunk
   - Forest
3. Your theme preference is saved in local storage

## API Configuration

The web portal communicates with the backend API at `http://localhost:3000` by default.

### Required Headers

All API requests include:

- `X-API-Version: 1` - Required by backend
- `credentials: 'include'` - Sends authentication cookies

### Authentication

- **Access tokens** are stored in HttpOnly cookies (secure, automatic)
- **Refresh tokens** are also in HttpOnly cookies
- No manual token management needed
- Sessions persist across browser sessions

## Backend Requirements

The backend API must:

1. **CORS Configuration:**

   ```javascript
   app.use(
     cors({
       origin: "http://localhost:5500",
       credentials: true,
     }),
   );
   ```

2. **OAuth Redirect:**
   - After successful GitHub OAuth, redirect to: `http://localhost:5500/dashboard.html`
   - Set access_token and refresh_token as HttpOnly cookies before redirect

3. **API Endpoints:**
   - `GET /api/users/me` - Get current user info
   - `GET /api/profiles` - Get all profiles (supports filters, pagination, and sorting)
   - `GET /api/profiles/:id` - Get specific profile by ID
   - `GET /api/profiles/search` - Search profiles with natural language query

## Development

### Testing Authentication

1. Start backend: `cd ../stage-one && node app.js`
2. Start frontend: `npm start`
3. Navigate to `http://localhost:5500`
4. Click "Login with GitHub"
5. Verify redirect to dashboard after authorization

### Testing Profile Operations

1. Log in and access the dashboard
2. Navigate to **Search** page
3. Test natural language queries:
   - "females from Nigeria above 30"
   - "male adults from United States"
   - "teenagers below 16"
4. Verify results display correctly with pagination
5. Click "View Details" on a profile to see detailed information

6. Navigate to **Profiles** page
7. Click "Show Filters" and test various filter combinations:
   - Filter by gender
   - Filter by age group
   - Set age range
   - Adjust minimum probabilities
8. Test sorting options (Date Added, Age, Gender Probability)
9. Test different results per page (10, 25, 50)
10. Verify pagination works correctly

11. Navigate to **Account** page
12. Verify your GitHub profile information displays correctly
13. Verify your role badge is shown

14. Test theme switching
15. Click the theme toggle icon in navigation
16. Verify themes cycle through and persist on page reload

### Common Issues

**Issue: CORS errors**

- Solution: Verify backend CORS is configured with `origin: 'http://localhost:5500'` and `credentials: true`

**Issue: Not redirecting after login**

- Solution: Check backend's `handleGitHubCallback` redirects to `http://localhost:5500/dashboard.html`

**Issue: "No access token" error**

- Solution: Verify backend sets `access_token` cookie before redirecting

**Issue: Search or filters not working**

- Solution: Check that backend API endpoints support query parameters for filtering and searching

**Issue: Theme not persisting**

- Solution: Check browser localStorage is enabled (theme preference is stored locally)

**Issue: Navigation drawer not working**

- Solution: Ensure DaisyUI CSS is loaded and Lucide icons are initialized properly

## Production Deployment

### Deploy to Railway (Recommended)

Railway makes it easy to deploy this static application:

1. **Install Railway CLI** (optional):

   ```bash
   npm i -g @railway/cli
   ```

2. **Connect your GitHub repository to Railway:**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect the configuration from `railway.json`

3. **Or deploy via Railway CLI:**

   ```bash
   railway login
   railway init
   railway up
   ```

4. **Configure environment (important):**
   - Update `API_BASE_URL` in [js/config.js](js/config.js) to your backend Railway URL
   - Railway will automatically assign a public URL for your frontend

5. **Railway Configuration:**
   The project includes a `railway.json` file that configures:
   - Start command: `npx http-server -p $PORT --cors`
   - Automatic port binding to Railway's `$PORT` variable
   - CORS enabled for API communication

6. **Update Backend CORS:**
   After deployment, update your backend's CORS configuration to allow your Railway frontend URL:

   ```javascript
   app.use(
     cors({
       origin: "https://your-frontend.railway.app",
       credentials: true,
     }),
   );
   ```

7. **Update GitHub OAuth:**
   Update your GitHub OAuth App settings with the new Railway URL:
   - Homepage URL: `https://your-frontend.railway.app`
   - Authorization callback URL: Should point to your backend's callback endpoint

**Deployment Tips:**

- Railway automatically redeploys on git push
- Check logs in Railway dashboard if deployment fails
- Use Railway's environment variables for sensitive config
- Domain mapping is available in Railway project settings

### Deploy to Other Platforms

Deploy to static hosting (Vercel, Netlify, Cloudflare Pages):

1. Build is not required (static files only)
2. Configure production API URL in `js/config.js`
3. Update `API_BASE_URL` to point to production backend
4. Ensure all HTML files are at the root level
5. Deploy the entire directory
6. Set the start command to: `npx http-server -p $PORT --cors`

**Note**: The application uses native ES6 modules, so ensure your hosting provider serves files with correct MIME types.

### Backend Configuration

Update backend environment variables:

- `FRONTEND_URL` - Your production frontend URL
- `REDIRECT_URI` - GitHub OAuth callback URL for production
- Configure GitHub OAuth App with production callback URL

### Security Considerations

- Use HTTPS in production
- Set `secure: true` for cookies in production
- Configure CSP headers
- Enable rate limiting on backend
- Monitor for suspicious activity

## Technologies Used

- **Frontend:** Vanilla JavaScript (ES6+), HTML5
- **CSS Framework:** Tailwind CSS (CDN), DaisyUI
- **Icons:** Lucide Icons
- **Build Tool:** http-server (simple static file server)
- **Authentication:** Cookie-based JWT authentication
- **API Client:** Fetch API with credential support

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is part of the HNG internship program.

## Support

For issues or questions:

1. Check the backend API logs
2. Check browser console for errors
3. Verify CORS configuration
4. Verify OAuth callback URL configuration
