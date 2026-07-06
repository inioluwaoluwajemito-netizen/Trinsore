# Trinsore Events

A premium, highly interactive, and mobile-first bridal and event services website designed with a luxury deep navy and gold aesthetic.

## ✨ Features

- **Luxury Theme:** Gold-accented branding, clean editorial layouts, and smooth hover state transitions.
- **Glassmorphic Navigation:** Sticky navigation bar with custom-crafted SVG monogram logo (`TE`) and responsive mobile menu drawer.
- **Service Inquiries:** Integrated quick CTAs under service cards that automatically prefill the consultation booking form.
- **Filterable Gallery:** High-definition portfolio grid filterable by traditional bridal, makeup, beads, or catering categories.
- **Interactive Lightbox:** Immersive full-screen image viewer supporting slide cycling (Left/Right key navigation).
- **Client Testimonials:** Automatic slider carousel detailing client reviews and wedding event categories.
- **WhatsApp Integration:** A contact inquiry form that validates fields and generates a pre-formatted template redirection to WhatsApp.
- **Scroll Animations:** Native scroll-activated upward fade-in transitions powered by JavaScript `IntersectionObserver`.

## 🛠️ Tech Stack

- **Core Structure:** HTML5 (Semantic & Accessible)
- **Styling:** Custom CSS3 Variables & Flexbox/Grid Systems
- **Functionality:** Vanilla JavaScript (ES6)
- **Icons:** FontAwesome CDN
- **Fonts:** Playfair Display (Luxury serif) & Inter (Modern sans-serif)

## 🚀 How to Run Locally

Since this is a client-side static application, you can view the website directly in any browser.

### Option A: Using the PowerShell Web Server (Recommended on Windows)
If you don't have Node.js or Python installed, you can start the lightweight server included in this repository:
```powershell
powershell -ExecutionPolicy Bypass -File scratch/serve.ps1
```
Then navigate to: [http://localhost:8085](http://localhost:8085)

### Option B: Using Python
If Python is installed on your system:
```bash
python -m http.server 8085
```
Then navigate to: [http://localhost:8085](http://localhost:8085)

### Option C: Using Node.js
If you have Node.js installed:
```bash
npx http-server -p 8085
```
Then navigate to: [http://localhost:8085](http://localhost:8085)
