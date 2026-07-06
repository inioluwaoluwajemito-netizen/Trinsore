# Product Requirements Document (PRD)
## Trinsore Events — Website

**Version:** 1.0
**Date:** July 2026
**Prepared for:** Trinsore Events
**Prepared by:** Inioluwa (Izzy Techub)

---

## 1. Overview

Trinsore Events is a bridal and event services brand offering: Bridals and Events, Bridal Beads, Makeup and Gele, Aso Ofi and Embellishments, Fascinators, Catering Services, and Event Planning, Coordination and Management.

The website's purpose is to establish a professional online presence, showcase the brand's work, and convert visitors into inquiries/bookings via WhatsApp, phone, or a contact form.

**Assumption:** This PRD targets a portfolio-and-inquiry site (not e-commerce or a full booking/payment system). This can be expanded later if needed.

---

## 2. Goals & Objectives

- Present Trinsore Events as a premium, trustworthy bridal/events brand
- Clearly communicate the full range of services offered
- Make it effortless for a potential client to reach out (WhatsApp, call, Instagram, form)
- Build a visual portfolio/gallery that showcases past work across each service line
- Be mobile-first, since most inquiries will come from phones/social media referrals

---

## 3. Target Audience

- Brides and grooms planning weddings
- Event hosts (birthdays, owambe, corporate/social events)
- Clients seeking bridal beads, makeup/gele, or aso-ofi styling
- Referrals from Instagram (@trinsore_events) and word of mouth

---

## 4. Brand Assets

- **Logo:** Gold "TE" monogram with ornate flourish (available, from signage)
- **Colors:** Deep navy/blue background with gold/yellow accents, white body text
- **Fonts:** Bold display font for headings (as seen in signage), clean sans-serif for body
- **Photos/testimonials:** Placeholder for now — recommend client provide real event photography before launch

---

## 5. Site Structure / Pages

### 5.1 Home
- Hero section with logo, tagline, and strong CTA ("Book a Consultation" / "Chat on WhatsApp")
- Brief intro to the brand
- Services overview (icons/cards linking to Services page)
- Featured gallery preview (3–6 images)
- Testimonials preview
- Contact strip (phone numbers, WhatsApp, Instagram)

### 5.2 About
- Brand story, mission, and what sets Trinsore Events apart
- Team/founder note (optional)

### 5.3 Services
Dedicated sections or sub-pages for each offering:
1. Bridals and Events
2. Bridal Beads
3. Makeup and Gele
4. Aso Ofi and Embellishments
5. Fascinators
6. Catering Services
7. Event Planning, Coordination and Management

Each with: short description, image gallery, and inquiry CTA.

### 5.4 Gallery/Portfolio
- Filterable by category (matching services above)
- Lightbox image viewer

### 5.5 Testimonials
- Client quotes/reviews (photo + name + event type where possible)

### 5.6 Contact
- Click-to-call and click-to-WhatsApp buttons for both numbers (08137270255 & 08125031078)
- Instagram link (@trinsore_events)
- Simple contact form: Name, Phone, Event Type, Event Date, Message
- Embedded map (optional, if there's a physical location/studio)

---

## 6. Functional Requirements

| Feature | Priority |
|---|---|
| Responsive design (mobile-first) | Must-have |
| Click-to-call / click-to-WhatsApp buttons | Must-have |
| Contact form (submits to email/WhatsApp) | Must-have |
| Service pages with galleries | Must-have |
| Instagram feed embed or link | Should-have |
| Testimonials section | Should-have |
| Blog/News (tips, past events) | Nice-to-have |
| Online booking/calendar | Future phase |
| E-commerce for beads/accessories | Future phase |

---

## 7. Non-Functional Requirements

- Fast load time (< 3s on mobile 4G)
- SEO-friendly (meta titles/descriptions, alt text on images, local SEO for Nigeria-based searches)
- Secure (HTTPS)
- Easy for a non-technical person to update photos/text later
- Accessible color contrast despite the dark navy/gold theme

---

## 8. Design Direction

- Carry over the navy + gold luxury aesthetic from existing signage/branding
- Elegant, editorial feel — generous white space, large imagery, minimal clutter
- Consistent use of the gold monogram as a recurring visual anchor (favicon, section dividers)

---

## 9. Recommended Tech Approach

**Recommended:** No-code builder (Framer, Webflow, or WordPress + Elementor) — enables fast launch, easy content updates by the client, and good built-in SEO/hosting.

**Alternative:** Custom-coded (React/Next.js or static HTML) — more control and customization, better if the site will later integrate booking, CRM (e.g. GoHighLevel), or automation workflows (e.g. n8n-driven lead routing).

Given Trinsore Events may eventually want automated lead capture/follow-up (WhatsApp/CRM), a hybrid path is worth considering: no-code front end + n8n/GHL automation on the backend for inquiry routing.

---

## 10. Success Metrics

- Number of inquiries generated per month (form + WhatsApp clicks)
- Bounce rate / average session duration
- Mobile vs desktop traffic split
- Conversion rate from visit → inquiry

---

## 11. Open Questions

- Does the client want a booking calendar or payment integration in a future phase?
- Is there a physical studio/location to feature on a map?
- Will real event photography/testimonials be provided before launch, or should placeholders go live first?
- Any preference for domain name / existing domain already purchased?

---

*This PRD can be adjusted once real photography, testimonials, and final scope decisions are confirmed.*
