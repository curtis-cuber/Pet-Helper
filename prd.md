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
| Visitor | Browse posts, search, filter, view map, view individual post pages, leave comments, report a lost pet |
| Admin | Remove reported posts |

- No login or account is required for any feature.
- The site works on both phones and computers.
- The site supports multiple languages (English first; others can be added later).

---

## Pages

### 1. Home Page
- Displays the site logo and site name.
- Shows a **Pets Reported** and **Pets Reunited** counter.
- Has three buttons: **Browse Lost Pets**, **Report Lost Pet**, **View on Map**.
- The hero section greets the visitor with their city name (detected from their **IP address**) — e.g. "Help Find Lost Pets in Chicago."
- Has a features section explaining what the site can do.
- Shows a **Trending This Week** section — the posts with the most views in the past 7 days.
- Shows a preview of the most recently reported pets with a "See All Posts" link.
- Has a **?** button (fixed, bottom-right) that opens the How It Works page.
- First-time visitors see a **Welcome Modal** explaining how the site works before they start browsing.
- After a poster is submitted, a popup appears: *"Your alert is live! If your pet is found you will get notified by email."*

### 2. How It Works Page
- Explains what the site does and how to use it in numbered steps.
- No account needed — just fill out a form and your alert goes live immediately.

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
- Shows all details: pet name, photo, description, animal type, color, size, age, last seen location, contact info, reward (if any), urgency level, and date posted.
- Shows **how many days ago** the pet went missing.
- Shows a **map pin** of the last seen location.
- Shows a **view count** showing how many people have viewed the post.
- **Copy Link** button so neighbors can share the post.
- **"I Found This Pet"** button — notifies the owner by email and turns the post green.
- **"Mark as Found"** button — marks the post as found.
- **Report Post** button — flags the post for admin review.
- **Comments section** — anyone can leave a tip. Comments support **Reply** and **thumbs up**.

### 5. Report a Lost Pet (Form)
- No login required — anyone can fill out the form.
- Fields: pet name, animal type, pet color, pet age (optional), pet size (optional), date missing, photo link, description, last seen location, contact info, urgency level, reward (optional).
- **Preview Poster** button shows a formatted preview before posting.
- After submitting, the user is taken back to the home page and a success popup appears.

### 6. Poster Preview Page
- Shows a formatted preview of the poster before it goes live.
- **Cancel** button goes back to home.
- **Post This Alert** button submits the poster directly to the database.

### 7. Profile Page
- Visible to everyone.
- Shows posts tied to a name/contact info.

### 8. Terms of Use Page
- Explains the rules of using Pet Helper.
- Linked from the footer on every page.

### 9. Privacy Policy Page
- Explains what data is collected and how it is used.
- Linked from the footer on every page.

---

## Comments
- Anyone can leave a tip on any post.
- Each comment shows the commenter's name.
- Comments support **Reply** so users can respond to a specific comment.
- Users can give a **thumbs up** on a comment to show it was helpful.

---

## Admin
- Admin can see a list of all **reported posts** and remove ones that break the rules.
- Admin features are built into the existing pages — no separate admin dashboard.

---

## Navigation & Layout
- Every page has a **navigation bar** at the top with links to Browse, How It Works, Dark Mode toggle, and Language selector.
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
| Supabase | Stores posts and comments (no login required) |
| ipapi.co | Free IP address geolocation API — returns the visitor's city and coordinates automatically |

---

## Database Tables

| Table | Purpose |
|---|---|
| posts | Lost pet alerts |
| comments | Tips left on posts, with reply support |
| reports | Flagged posts waiting for admin review |

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
