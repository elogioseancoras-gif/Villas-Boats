# Villas Boats

*Villas Boats* is a platform for boat rental, much like the AirBnb for boats.

**Create a complete, responsive, and elegant web app, similar to Click&Boat (<https://www.clickandboat.com>) or Boataround (<https://www.boataround.com>) focused on boat rentals in Portugal and Brazil.**

## ⚙️ General Specifications

* Responsive design for desktop and mobile.
* The design MUST look premium, convey luxury, security, and freedom—with a visual identity inspired by the sea.
* SEO optimization
* Lead generation optimization (forms, CTAs, WhatsApp integration)
* Brand elements: slogan "Sail towards your dreams"; Premium and inspiring look
* Multilingual support: the site must be available in **Brazilian Portuguese, European Portuguese, Spanish, and English**, user-selectable
* Multicurrency support: the site must show prices in **EUR, BRL, GPB or USD**, user-selectable

## 📲 Technical and architectural specifications

### Frontend

* **NextJS** - Latest version
* **TailwindCSS** - CSS framework that allows powerful customization
* **ShadCN** - Component library

### Backend

* Backend in **Java 25** and **Spring Boot** in the latest version available
* **PostgreSQL** database in the latest version available
* Flyway as a database schema migration tool

### General

* The latest Cloud Native standards must be followed
* Unit and integration tests must always be generated and kept up to date
* Use the most powerful and popular linting tools
* The application must run on a Docker Compose stack in Portainer, therefore, it must be built to be Deployed in containers

## ⚙️ Main features

### 🏠 Homepage

The application's homepage should function as a landing page for the website, featuring the following features:

* A navigation bar with
  * a logo icon inspired by ideas related to boats ⛵, anchor ⚓, sea 🌊
  * Platform name - Villas Boats
  * Horizontal menu containing:
    * Boats - takes you to the boat listing and filtering screen
    * Destinations - takes you to the screen listing the locations served by the platform
    * How does it work? - takes you to a screen with a presentation and general explanations about the platform
    * Website language and currency selection
    * Login / Registration
* A Hero section with the platform's slogan, with a beautiful and striking background image of a luxury yacht
* Quick search - location + check-in and check-out dates + number of passengers
* Highlights - an area for boats that the platform wants to draw attention to, such as offers or promoted by owners
* Form with CTA to subscribe to the newsletter
* Footer with contact information, links to main features, copyright, etc.

### ⛴️ Boat List

This is the search results page. It can display all boats if no filters are applied, or it can be filtered by parameters entered in the Homepage Quick Search or by filters that the page itself offers.

* Filters Area The list should allow filtering by: location (Portugal: Porto, Lisbon, Algarve; Brazil: São Paulo, Rio de Janeiro, Santa Catarina), dates, vessel type, price range, maximum passenger capacity, boat size in feet, amenities offered.
* Sorting options: by price, rating, capacity, size, date added to the platform
* The boat listing should display boat details in cards, with a photo, name, price, etc.

### 🛳️ Boat Details

Each vessel's page with a photo gallery, optimized description, technical features, amenities, map location (Google Maps with pins at marinas), and a "Book Now" button.

* Checkout with online payment (Stripe, PayPal, Revolut, MBWay) - future implementation, but there may be an indication on the website that support will be available soon.
* Contact for booking: the user will be directed to a WhatsApp chat, indicating the boat and the requested dates. The reservation is only confirmed after validation by the Villas Boats customer service team.

### 👤 Website administration area / back office

Dashboard intended for the Villas Boats customer service team. It should offer functionality for

* Quick statistics
  * Number of reservations in the month
  * Monthly revenue
  * Occupancy rate
  * Number of pending reservation requests
* Boat management
  * List of boats registered on the platform with a details screen - both similar or identical to those in the public area of ​​the website, but allowing new boats to be registered - a form with predefined fields: boat name, make, model, capacity, type, price, photos, location, amenities, and photo uploads.
* Reservation Management
  * List of pending reservation requests, with the details of the boat and the customer who requested the reservation. This allows you to confirm the reservation, creating a reservation record and permanently blocking the boat's availability.
  * Reservation List - Confirmed, Past, Canceled
* Customer Management
* Customer List, allowing data editing
