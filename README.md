# Reportly - Complete Setup Guide

## 📱 What is Reportly?

**Reportly** is a time tracking and reporting application where users:
- Create time reports by adding daily hours and tasks
- Auto-generate next day entries when hours are entered (excludes holidays)
- Track total hours worked
- View detailed statistics
- Mobile-first responsive design

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Supabase Project
1. Go to https://supabase.com and sign up
2. Create a new project
3. Wait for it to start, then get your credentials:
   - Settings → API → `Project URL` and `anon public key`

### Step 2: Setup Database
1. Go to SQL Editor in your Supabase dashboard
2. Create new query
3. Paste entire contents of `db/migrations.sql`
4. Click "Run"

### Step 3: Install & Configure
```bash
cd reportly-app
npm install
cp .env.example .env
```

Edit `.env`:
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### Step 4: Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000 and start using Reportly!

---

## 📋 App Workflow

### User Signs Up
- Email + password (no Gmail auth)
- Email verification (Supabase)
- Redirected to dashboard

### Create Report
- Click "+ Create"
- Enter report name
- Redirected to editor

### Log Time
- Add hours for a day
- Add tasks (what you worked on)
- Mark holidays (skips that day)
- **Auto-generates next day** when hours > 0

### View Stats
- Total hours
- Number of days
- Holidays count
- Real-time updates

---

## 🎯 Key Features

### ✅ Auto-Day Generation
When you enter hours (> 0) on a day:
- Next day is automatically created
- Holiday days are **skipped**
- Future dates are **locked** (can't edit)
- Only non-holiday days trigger auto-generation

### ✅ Mobile-First Responsive
- Full mobile optimization
- Touch-friendly buttons (44px minimum)
- Auto-responsive layouts
- Safe area support (notches)

### ✅ Email/Password Auth
- No Gmail required
- Custom account creation
- Email verification
- Secure password handling

### ✅ Real-Time Editing
- Auto-save with debounce (900ms)
- Save status indicator
- Optimistic updates

### ✅ Smart Data Structure
```json
{
  "id": "uuid",
  "title": "Weekly Report",
  "days": [
    {
      "date": "2024-01-15",
      "hours": 8,
      "tasks": "Built auth system",
      "holiday": false,
      "auto_generated": false
    },
    {
      "date": "2024-01-16",
      "hours": 0,
      "tasks": "",
      "holiday": false,
      "auto_generated": true
    }
  ],
  "total_hours": 8,
  "status": "active"
}
```

---

## 📁 Project Structure

```
reportly-app/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Top navigation
│   │   └── DayInput.jsx            # Day entry component (auto-generate)
│   ├── hooks/
│   │   ├── useIsMobile.js          # Mobile detection
│   │   └── useAutoSave.js          # Auto-save with status
│   ├── pages/
│   │   ├── Auth.jsx                # Email/password signup
│   │   ├── Dashboard.jsx           # Reports list
│   │   └── ReportEditor.jsx        # Main editor with auto-generation
│   ├── lib/
│   │   ├── supabase.js             # Client init
│   │   └── db.js                   # Database operations
│   ├── utils/
│   │   └── helpers.js              # Date, formatting, auto-generation logic
│   ├── styles/
│   │   ├── tokens.js               # Design tokens
│   │   └── global.css              # Base styles
│   ├── App.jsx                     # Router
│   └── index.jsx                   # Entry point
├── public/
│   └── index.html                  # HTML template
├── db/
│   └── migrations.sql              # Database schema
├── package.json
├── vite.config.js
├── .env.example
└── README.md
```

---

## 🗄️ Database Schema

### reports table
```sql
id                UUID (Primary Key)
user_id           UUID (Foreign Key → auth.users)
title             TEXT
days              JSONB [{
                    date: string,
                    hours: float,
                    tasks: string,
                    holiday: boolean,
                    auto_generated: boolean
                  }]
status            TEXT (active, archived)
total_hours       NUMERIC
share_id          TEXT (unique, for sharing)
updated_at        TIMESTAMP (auto)
created_at        TIMESTAMP
```

---

## 🔐 Authentication

### Signup Flow
1. User enters email + password (+ confirm password)
2. Password validation:
   - Minimum 6 characters
   - Must match confirmation
3. Email verification sent
4. After verification, user can login

### Security
- Supabase Auth handles all security
- Passwords hashed in PostgreSQL
- Row-Level Security (RLS) policies
- Users can only access their own reports

---

## 💾 Auto-Save & State Management

### Auto-Save Hook
```javascript
// 900ms debounce after last change
// Status: idle → unsaved → saving → saved → idle
const saveStatus = useAutoSave(report, onSave, 900);
```

### When is Next Day Auto-Generated?
✅ Auto-generate if:
- Current day has hours > 0
- Next day doesn't exist
- Current day is not a holiday
- Next day is not in the future

❌ Don't auto-generate if:
- No hours entered
- Next day already exists
- Current day is a holiday
- Next day is in the future

---

## 🎨 Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Bundler | Vite 5 |
| Styling | Inline Styles + Tokens (no CSS framework) |
| Backend | Supabase (Auth + PostgreSQL) |
| Routing | React Router 6 |
| State | React Hooks (useState, useCallback) |
| Package Manager | npm |

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
# Push to GitHub
# Connect Vercel → auto-deploy
```

Set environment variables in Vercel dashboard:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`

### Netlify
```bash
npm run build
# Deploy dist/ folder
# Set env vars in Netlify dashboard
```

### Self-Hosted
```bash
npm run build
# Serve dist/ as static site using nginx/apache
# Ensure .env variables are available at runtime
```

---

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 📱 Mobile Optimization

### Touch Targets
- All buttons: 44px × 44px minimum
- Inputs: 44px height
- Full-width on mobile

### Responsive Breakpoint
- Mobile: < 768px
- Desktop: ≥ 768px

### Auto-Responsive Components
- Single column on mobile → Grid on desktop
- Abbreviated labels → Full labels
- Bottom action bar on mobile
- Full-width cards

---

## 🧪 Testing Locally

### Test Signup
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Enter email + password
4. Check email for verification link (Supabase email)
5. Verify account
6. Sign in

### Test Auto-Generation
1. Create new report
2. Enter hours (e.g., 8)
3. Watch next day auto-generate
4. Check dashboard for updated stats

### Test Mobile
- Chrome DevTools: Toggle device toolbar
- Test on iPhone/Android physical devices
- Check landscape/portrait

---

## 🐛 Troubleshooting

### "Supabase connection failed"
- Check `.env` values
- Verify project URL and anon key
- Restart dev server

### "Email verification not working"
- Check email spam folder
- Verify email in Supabase Auth settings
- Resend verification link

### "Next day not auto-generating"
- Make sure hours > 0
- Check next day doesn't already exist
- Verify current day is not a holiday
- Check future date logic

### "Mobile layout broken"
- Check viewport meta tag
- Clear browser cache
- Test in Chrome DevTools device mode

---

## 📊 Monitoring & Analytics

### Add Analytics (Optional)
```javascript
// Add Google Analytics, Amplitude, etc.
// Track: signup, report creation, hours logged
```

### Monitor Performance
- Supabase dashboard for database performance
- Vite bundle analysis
- Mobile network throttling tests

---

## 🎯 Future Enhancements

- [ ] PDF export of reports
- [ ] CSV export
- [ ] Report sharing/collaboration
- [ ] Time analytics & charts
- [ ] Invoice generation
- [ ] Mobile native app
- [ ] Dark mode
- [ ] Email summaries

---

## 📞 Support

### Common Issues
1. **Slow first load** → Check Supabase cold start
2. **Auth errors** → Verify email in Supabase
3. **Mobile viewport** → Check `<meta>` tags
4. **Auto-save not working** → Check network tab

### Debug Mode
```javascript
// Add to App.jsx
useEffect(() => {
  console.log('Report:', report);
  console.log('Save Status:', saveStatus);
}, [report, saveStatus]);
```

---

## 📄 License

This project is open source. Modify and use as needed!

---

## ✨ Getting Started

1. ✅ Set up Supabase
2. ✅ Run migrations
3. ✅ Configure `.env`
4. ✅ `npm install`
5. ✅ `npm run dev`
6. ✅ Sign up & start tracking time!

**Happy tracking!** 📊
#   r e p o r t l y - a p p  
 