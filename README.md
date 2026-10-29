# Hillside General Construction & Electrical Company

Static website (vanilla HTML/CSS/JS) for Hillside General Construction & Electrical Company,
a general construction and electrical contractor serving Pasadena, Glendale, Burbank and
Los Angeles County.

## Structure

- `index.html` — home page
- `construction-services-in-pasadena-ca/` — construction services overview
- `adu-construction-in-pasadena-ca/` — ADU construction
- `retrofit/` — retrofit services
- `contact/` — contact and estimate request
- `assets/css/styles.css` — design system and all page styles
- `assets/js/main.js` — navigation, form handling, scroll reveal
- `images/source/` — images carried over from the previous site

No build step: serve the directory as static files.

## Forms

All forms POST to the LeadrVision endpoint and work without JavaScript. With JavaScript
enabled they submit via `fetch()` to the same URL and confirm inline; without it the
visitor returns to the page with `?submitted=1`, which also shows the confirmation.
