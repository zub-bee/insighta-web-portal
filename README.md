# Insighta Web Portal

A modern web-based user interface for the Insighta profile management system. Built with vanilla HTML, JavaScript, and Tailwind CSS.

## Features

✅ **GitHub OAuth Authentication** - Secure browser-based OAuth flow  
✅ **Cookie-based Sessions** - Automatic authentication with HttpOnly cookies  
✅ **Natural Language Search** - Search profiles using plain English queries  
✅ **Role-based Access Control** - Admin features visible only to authorized users  
✅ **Responsive Design** - Mobile-friendly interface built with Tailwind CSS  
✅ **Profile Management** - Create, view, search, and export profiles  

## Prerequisites

- Node.js (v14 or higher)
- Backend API server running (stage-one/)
- GitHub OAuth App configured

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
├── public/
│   ├── index.html           # Login page
│   ├── dashboard.html       # Main dashboard
│   ├── profiles.html        # Search and view profiles
│   ├── create.html          # Create new profile (admin only)
│   ├── js/
│   │   ├── api.js          # API client with fetch wrapper
│   │   ├── auth.js         # Authentication logic
│   │   ├── profiles.js     # Profile operations
│   │   └── utils.js        # Utility functions
│   └── css/
│       └── styles.css      # Optional custom styles
├── package.json
└── README.md
```

## Usage

### Authentication Flow

1. Click "Continue with GitHub" on the login page
2. Authorize the application on GitHub
3. You'll be redirected back to the dashboard
4. Session persists across page refreshes (cookie-based)

### Searching Profiles

1. Navigate to **Profiles** page
2. Enter a natural language query:
   - "adult males from nigeria"
   - "female teenagers"
   - "people from kenya"
3. Click **Search** or press Enter
4. Results display in a paginated table
5. Use pagination controls to browse results

### Creating Profiles (Admin Only)

1. Navigate to **Create Profile** page
2. Enter a name (e.g., "John", "Mary", "Ahmed")
3. Click **Create Profile**
4. System fetches gender, age, and country data from external APIs
5. View the created profile details
6. Create another or view all profiles

### Exporting Profiles (Admin Only)

1. Search for profiles on the **Profiles** page
2. Click **Export CSV** button
3. Download starts automatically

**Note:** The backend currently has a bug and exports JSON instead of CSV. This is a known backend issue.

### Role-based Features

**Regular Users can:**
- View dashboard
- Search profiles
- View profile details

**Admin Users can also:**
- Create new profiles
- Export profiles to CSV
- Delete profiles (if implemented)

Admin-only features are automatically hidden from non-admin users.

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
   app.use(cors({
       origin: 'http://localhost:5500',
       credentials: true
   }))
   ```

2. **OAuth Redirect:**
   - After successful GitHub OAuth, redirect to: `http://localhost:5500/dashboard.html`
   - Set access_token and refresh_token as HttpOnly cookies before redirect

3. **API Endpoints:**
   - `GET /api/users/me` - Get current user info
   - `GET /api/profiles` - Get all profiles (paginated)
   - `GET /api/profiles/search` - Search profiles by query
   - `POST /api/profiles` - Create new profile (admin only)
   - `GET /api/profiles/export` - Export profiles (admin only)

## Development

### Testing Authentication

1. Start backend: `cd ../stage-one && node app.js`
2. Start frontend: `npm start`
3. Navigate to `http://localhost:5500`
4. Click "Login with GitHub"
5. Verify redirect to dashboard after authorization

### Testing Profile Operations

1. Log in as a regular user
2. Search for profiles: "adult males from nigeria"
3. Verify results display correctly
4. Verify pagination works
5. Verify "Create Profile" link is hidden
6. Verify "Export CSV" button is hidden

7. Log in as an admin user
8. Verify "Create Profile" link is visible
9. Create a new profile
10. Verify success message and profile details
11. Verify "Export CSV" button is visible on Profiles page

### Common Issues

**Issue: CORS errors**
- Solution: Verify backend CORS is configured with `origin: 'http://localhost:5500'` and `credentials: true`

**Issue: Not redirecting after login**
- Solution: Check backend's `handleGitHubCallback` redirects to `http://localhost:5500/dashboard.html`

**Issue: "No access token" error**
- Solution: Verify backend sets `access_token` cookie before redirecting

**Issue: Role-based features not working**
- Solution: Check `/api/users/me` returns correct role in response

## Production Deployment

### Frontend Deployment

Deploy to static hosting (Vercel, Netlify, Cloudflare Pages):

1. Build is not required (static files)
2. Set environment variable for API URL if needed
3. Update `API_URL` in `js/api.js` to production backend URL

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

- **Frontend:** Vanilla JavaScript (ES6+), HTML5, Tailwind CSS (CDN)
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
