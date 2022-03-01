# ***Go Ahead Travel***

![]()

## **Content Overview:**

- [***Go Ahead Travel***](#go-ahead-travel)
  - [**Content Overview:**](#content-overview)
    - [**The project main idea:**](#the-project-main-idea)
    - [**Demo:** (click to redirect to youtube demo video)](#demo-click-to-redirect-to-youtube-demo-video)
    - [**Postman APIs:**](#postman-apis)
    - [**Architecture:**](#architecture)
    - [**Error handling:**](#error-handling)
    - [**Data Modeling:**](#data-modeling)
    - [**Stripe Implementation & Stripe webhooks logic:**](#stripe-implementation--stripe-webhooks-logic)
    - [**Technologies & Third services:**](#technologies--third-services)
    - [**coming improvement:**](#coming-improvement)
    - [**LICENSE:**](#license)

<br><br>

### **The project main idea:**
The project is a travel booking web application, where users can purchase travel via bank card, create an account, log in and log out, with the ability to reset their password and update their data (name, photo, and email basically) along with an improved user experience.

<br>

### **Demo:** (click to redirect to youtube demo video)
<br>

[![](https://img.youtube.com/vi/-9r9shBcI8k/0.jpg)](https://www.youtube.com/watch?v=-9r9shBcI8k)

<br><br>

### **Postman APIs:**

Please refer to this <a href="https://documenter.getpostman.com/view/14950888/UVeFNS9W#da0f790e-0ffb-471b-891c-006a08e07150" target="_blank">link</a> to get more details about APIs.

<br>

### **Architecture:**

<br>

**Project Directory structure:**
```
goAheadTravel/
├── app.js
├── controllers
│   ├── authController.js
│   ├── bookingController.js
│   ├── errorController.js
│   ├── factoryHandler.js
│   ├── ratingController.js
│   ├── travelController.js
│   ├── userController.js
│   └── viewsController.js
├── dev-data
│   └── data
│       ├── import-data.js
│       ├── ratings.json
│       ├── travels.json
│       └── users.json
├── LICENSE
├── models
│   ├── bookingModel.js
│   ├── ratingModel.js
│   ├── travelModel.js
│   └── userModel.js
├── package.json
├── public
│   ├── css
│   │   └── styles.css
│   ├── img
│   │   ├── travels
│   │   └── users
│   └── js
│       ├── alerts.js
│       ├── bundle.js
│       ├── bundle.js.map
│       ├── forgotpassword.js
│       ├── index.js
│       ├── login.js
│       ├── resetpassword.js
│       ├── signup.js
│       ├── stripe.js
│       └── updateSettings.js
├── README.md
├── routes
│   ├── bookingRoutes.js
│   ├── ratingRoutes.js
│   ├── travelRoutes.js
│   ├── userRoutes.js
│   └── viewsRoutes.js
├── server.js
├── utilities
│   ├── apiClass.js
│   ├── catchAsyncHandler.js
│   ├── errorHandlingClass.js
│   └── nodemail.js
└── views
    ├── emailTemplates
    │   ├── bookedTravel.pug
    │   ├── emailStyle.pug
    │   ├── goAheadTravelEmail.pug
    │   ├── passwordReset.pug
    │   └── welcome.pug
    ├── Error.pug
    ├── content.pug
    ├── footer.pug
    ├── forgotPassword.pug
    ├── goaheadtravel.pug
    ├── header.pug
    ├── login.pug
    ├── nobooking.pug
    ├── overview.pug
    ├── profile.pug
    ├── resetPassword.pug
    ├── reviewCard.pug
    ├── signup.pug
    └── travel.pug
```

<br><br>

**Application architecture:**

This project builds with NodeJs, MongoDB JavaScript, CSS, PUG and MongoDB.

<br>

![](https://i.imgur.com/khNTpZx.png)

<br><br>

**Node backend with:**

- <ins>ExpressJs:</ins> for design Rest APIs, define middlewares, manage routings, HTTP request, error handling ...
- <ins>Mongoose:</ins> for data modeling, schema building, document middleware, and business logic
- <ins>MongoDB Atlas:</ins> for database hosting
- <ins>Nodemailer:</ins> Node module for sending emails to users (example: reset password)
- <ins>cryptojs:</ins> for encrypt password and token
- <ins>JSON Web Token (JWT):</ins> for authenticate users
- <ins>Stripe:</ins> for online payments via bank card
- <ins>Gmail:</ins> SMTP service provider for emailing users whenever they signed up, attempt to update their passwords, or booked a travel
- <ins>Multer:</ins> for uploading images
- <ins>Sharp:</ins> for converting large images to web friendly jpeg and resizing images

<br>

**Frontend with:**
- <ins>Javascript:</ins> for building APIs, and rendering user interfaces dynamically
- <ins>Axios:</ins> for fetching APIs
- <ins>Parcel-bundler:</ins> for web application bundling
- <ins>CSS:</ins> for styling the web application
- <ins>PUG:</ins> for building templates

<br>

**MVC architecture:**

The MVC architecture used here, is a way to structure the application development in three layers:
- <ins>Business logic layer:</ins> represented in Model folder, with mongoose schema choosing which information and data
represnting to clients and is the layer that the hole application build around.
- <ins>Application logic layer:</ins> represented in Controler folder, build around javascript functions to handle  application's requests interact with models and send back response to clients.
- <ins>Presentation logic layer:</ins> represented in Views folder consists basically of the templates used to generate the view, so the website that we're going to send back to the clients.

<br>

![](https://i.imgur.com/rb1EiP2.png)

<br><br>

### **Error handling:**

<br>

![](https://i.imgur.com/m2xapVA.png)

<br><br>

### **Data Modeling:**

<br>

![](https://i.imgur.com/ppWrzjY.png)

<br><br>

### **Stripe Implementation & Stripe webhooks logic:**

<br>

- **Backend-side:** I set a route to create Stripe checkout session, which will contain informations about the travel to purchase like the name of the travel, the price, the currency,.. etc, along with user details such as the email, name. For that, the stripe secret key must be provided.

- **Frontend-side:** I implemented a function that will call the Stripe checkout session from the server once the user hit the booking button and send it back to client and based on that session Stripe will create the checkout page and redirect the user to it, in order to fill it with the card number, expiration date,.. Then, Stripe will charge the credit card which means that the user data (credit card number, expiration date...) will not reach the web application server and this is very secure. 

- **Stripe Webhook:** Once the travel booking event is successful, I impelemented a function that retrieve data from the event object to create a new booking in the DB and send a confirmation email to user.


<br>

![](https://i.imgur.com/hQDT8E1.png)

<br><br>

### **Technologies & Third services:**

<br>

- Postman
- MongoDB Atlas
- Parcel-bundler
- Stripe
- Mailtrap
- Mapbox
- Gmail (to send emails)

<br><br>

### **coming improvement:**

<br>

- Impelement map along with locations to visit using **Mapbox**
- improve users + admin&lead-guide profile dashbord (booked travels, list of all users, travels, list of users ratings ...)
- Improve the web application responsiveness and design

<br><br>

### **LICENSE:**

```
MIT License

Copyright (c) 2022 Moez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
