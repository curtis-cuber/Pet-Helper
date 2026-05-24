# Pet Helper – Product Requirements Document

---

## Who is the site for?
Anyone who has lost a pet or found a stray and wants to alert people nearby.

## What problem does it solve?
Paper flyers blow away and most neighbors never see them. This site gives lost pet alerts a reliable digital home that anyone can check from their phone or computer.

---

## Users

| User Type | What they can do |
|---|---|
| Guest (not logged in) | Browse posts, search, filter, view map, view individual post pages, leave comments, follow posts |
| Logged-in user | Everything a guest can do, plus post alerts, edit/delete own posts, message owners, mark pets as found, manage profile, delete sent messages |
| Admin | Everything a logged-in user can do, plus remove reported posts and ban users |
| Banned user | Can only view a message explaining why they were banned — no other access |

- Login is required to post, edit, delete, or send messages.
- No login is required to browse, comment, or follow a post.
- The site works on both phones and computers.
- The site supports multiple languages (English first; others can be added later).

---

## Pages

### 1. Home Page
- Displays the site logo and site name.
- Shows a **"Welcome back, [name]"** banner for logged-in users.
- Shows a **Pets Reported** and **Pets Reunited** counter.
- Has four buttons: **Browse Lost Pets**, **Report Lost Pet**, **Make Lost Pet Poster**, **View on Map**.
- Has a features section explaining what the site can do.
- Shows a **Trending This Week** section — the posts with the most views or comments in the past 7 days.
- Shows a preview of the most recently reported pets with a "See All Posts" link.
- The hero section greets the visitor with their city name (detected from their **IP address**) — e.g. "Help Find Lost Pets in Chicago."
- Has a **?** button (fixed, bottom-right) that opens the How It Works page.
- First-time visitors see a **Welcome Modal** explaining how the site works before they start browsing.
- After a poster is submitted, a popup appears: *"Your alert is live! If your pet is found you will get notified by email."*

### 2. How It Works Page
- Explains what the site does and how to use it in numbered steps.

### 3. Browse All Posts
- Toggle between **List view** (photo + name cards) and **Map view** (pins on a map).
- List view: sorted newest first, each card shows photo, name, animal type, and color.
- Urgent posts show a red **URGENT** badge on their card.
- Found posts show a green **Found!** badge on their card.
- **Found Pets tab** — a separate tab that shows only reunited pets.
- Map view: shows all missing pets as colored pins; found pets shown as green pins; urgent posts shown as red pins.
- **Near Me** button zooms the map to the user's current GPS location.
- The map and location filter are automatically pre-set to the user's city using their **IP address** — no permission needed.
- **Search** by pet name.
- **Filter** by animal type, time posted (last 24h / 7 days / 30 days), and city or neighborhood.
- Shows a **match count** (e.g. "12 posts found") that updates as the user searches or filters.
- Clicking a card goes to that pet's individual post page.

### 4. Individual Post Page
- Shows all details: pet name, all photo links, description, animal type, color, size, age, last seen location, contact info, reward (if any), urgency level, and date posted.
- Shows **how many days ago** the pet went missing.
- Shows a **map pin** of the last seen location.
- Owner sees a **view count** showing how many people have viewed the post.
- **Copy Link** button so neighbors can share the post.
- **"I Found This Pet"** button — notifies the owner by email and turns the post green.
- **"Mark as Found (I'm the owner)"** button — visible only to the owner.
- **"Edit Post"** and **"Delete Post"** buttons — visible only to the owner.
- **"Follow this Post"** button — any visitor can follow a post and get notified when it is updated or the pet is found.
- **Message Owner** button — opens a chat-style private message thread (logged-in users only).
- **Report Post** button — flags the post for admin review (not shown to the post owner).
- **Comments section** — anyone can leave a tip; each comment shows the commenter's name and profile picture (if they have one). Comments support **Reply** so users can respond to a specific comment. Users can give a **thumbs up** on a comment to show it was helpful.
- Shows a list of **users following this post**.

### 5. Make Lost Pet Poster (Form)
- Requires login.
- Fields: pet name, animal type, pet color, pet age (optional), pet size (optional), date missing, up to 3 photo links, description, last seen location, contact info, urgency level, reward (optional).
- **Preview Poster** button saves the form data and opens a preview page before posting.
- After submitting, the user is taken back to the home page and a success popup appears.
- Owner can return to their post at any time to **add an update** (e.g. "Last spotted near the school on Tuesday"). Updates are visible on the post page.

### 6. Poster Preview Page
- Shows a formatted preview of the poster before it goes live.
- **Edit** button goes back to the form.
- **Post This Alert** button submits the poster.

### 7. Login / Sign Up Page
- Tab to switch between Log In and Sign Up.
- **Log In** with email + password, or with **Google**.
- **Sign Up** with email + password, or with **Google**.
- If a user tries to sign up with an email that already has an account, a clear error message is shown.
- **Forgot Password** link sends a reset email so the user can choose a new password.
- After confirming email, users can log in.
- First-time sign-up leads to a **Welcome Screen** before the home page.

### 8. Welcome Screen (New Users Only)
- Shown once after a user creates a new account.
- Explains what to do first: fill in your profile, or post a lost pet alert.
- Has a **Get Started** button that takes the user to the home page.

### 9. Profile Page
- Visible to everyone.
- Shows the user's profile picture, display name, bio, member since date, and all their posts.
- **Owner only:** edit display name, bio, home neighborhood, profile picture link, change password, delete account.
- The **home neighborhood** set in the profile is used to pre-filter the browse page for that user.

### 10. Terms of Use Page
- Explains the rules of using Pet Helper.
- Linked from the footer on every page.

### 11. Privacy Policy Page
- Explains what data is collected and how it is used.
- Linked from the footer on every page.

---

## Notifications

| Event | Who is notified | How |
|---|---|---|
| Someone clicks "I Found This Pet" | Pet owner | Email + bell |
| Someone comments on your post | Post owner | Bell |
| Someone replies to your comment | Commenter | Bell |
| Someone sends you a private message | Recipient | Bell |
| A post you follow is updated | Follower | Bell |
| A post you follow is marked as found | Follower | Bell |
| Your post is removed by admin | Post owner | Bell |
| Pet is marked as found | All followers | Bell |

- Notifications appear in a **slide-in panel** from the right side when the bell icon is clicked.
- Each notification shows the message and **how long ago** it happened (e.g. "2 hours ago").
- Users can **mark individual notifications as read**.
- Users can **clear all notifications** at once.
- No SMS notifications.
- No option to turn off specific notification types.

---

## Private Messages
- Accessible via the **"Message Owner"** button on any post page.
- Messages appear in a **chat-style thread** (like text messages).
- New messages trigger a **bell notification**.
- Users can **delete a message they sent**.
- No separate inbox page — messages are accessed from the post page.
- No read receipts.

---

## Admin
- Admin can see a list of all **reported posts** and remove ones that break the rules.
- Admin can see a **list of all users** and ban someone if needed.
- When a post is removed, the **owner is notified** via the bell.
- When a user is banned, they see a message explaining why they were banned.
- Admin features are built into the existing pages — no separate admin dashboard.

---

## Navigation & Layout
- Every page has a **navigation bar** at the top with links to Browse, How It Works, Make Poster, My Profile (when logged in), Notifications bell, Dark Mode toggle, Language selector, and Login/Logout.
- Every page has a **footer** with links to Terms of Use and Privacy Policy.

---

## Accessibility
- All images have **alt text** descriptions for users who use screen readers.
- The site supports **multiple languages** (English only at launch; others can be added later).

---

## Design

| Decision | Choice |
|---|---|
| Feel | Serious and professional |
| Color | Friendly and warm (amber/orange tones) |
| Logo | SVG paw print + "Pet Helper" text |
| Responsive | Yes — works on phone and computer |
| Dark Mode | Yes — toggle on every page, preference remembered |
| Language | Language selector in nav (English at launch) |

---

## Tech Stack

| Tool | What it does |
|---|---|
| Vercel | Hosts the website so anyone can visit it |
| Supabase | Stores posts, comments, profiles, notifications, messages, and reports; handles login and Google sign-in |
| ipapi.co | Free IP address geolocation API — returns the visitor's city and coordinates automatically |

---

## Database Tables

| Table | Purpose |
|---|---|
| posts | Lost pet alerts |
| comments | Tips left on posts, with reply support |
| profiles | User display names, bios, avatars, and join dates |
| notifications | In-site alerts for users |
| messages | Private chat messages between users |
| reports | Flagged posts waiting for admin review |
| post_followers | Tracks which users are following which posts |
| post_updates | Owner-written updates added to a post after it goes live |

---

## Can Wait Until Later
- SMS notifications
- Social media sharing buttons
- Print poster button
- QR code on posters
- About page
- Contact page
- Happy Endings page
- Tips page for what to do when you lose a pet
- Translation into languages other than English
- Custom favicon
- Custom Open Graph meta tags per post
- Sort browse page by urgency
