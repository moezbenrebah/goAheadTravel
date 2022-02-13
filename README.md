# ***Go Ahead Travel***

![]()

## **Content Overview:**

- [The project main idea](#the)
- [Demo](#demo)
- [Architecture](#architecture)
- [APIs](#apis)
- [Error handling](#Error)
- [Data Modeling](#Data)
- [Technologies & Third services](#technologies)
- [coming improvement](#coming)
- [LICENSE](#license)

<br><br>

### **The project main idea:**
The project is a travel booking web application, where users can purchase travel via bank card, create an account, log in and log out, with the ability to reset their password and update their data (name, photo, and email basically) along with an improved user experience.

<br>

### **Demo:** (click to redirect to youtube demo video)
<br>

[![](https://img.youtube.com/vi/eAUnlVjOXFw/0.jpg)](https://www.youtube.com/watch?v=eAUnlVjOXFw)

<br><br>

### **APIs:**

Please refer to this <a href="https://documenter.getpostman.com/view/14950888/UVeFNS9W#da0f790e-0ffb-471b-891c-006a08e07150" target="_blank">link</a> to get more details about APIs.

<br>

### **Architecture:**

<br>

**Project Directory structure:**
```
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
    ├── content.pug
    ├── emailTemplates
    │   ├── emailStyle.pug
    │   ├── goAheadTravelEmail.pug
    │   ├── passwordReset.pug
    │   └── welcome.pug
    ├── Error.pug
    ├── footer.pug
    ├── forgotPassword.pug
    ├── goaheadtravel.pug
    ├── header.pug
    ├── login.pug
    ├── overview.pug
    ├── profile.pug
    ├── resetPassword.pug
    ├── reviewCard.pug
    ├── signup.pug
    └── travel.pug
```

<br><br>

**Application architecture:**

This project builds with NodeJs, MongoDB, JavaScript, CSS, and PUG.

<br>

![](https://i.imgur.com/khNTpZx.png)

<br><br>

**Node backend with:**

- <ins>ExpressJs:</ins> for design Rest APIs, define middlewares, manage routings, HTTP request, error handling ...
- <ins>Mongoose:</ins> for data modeling, schema building, document middleware, and business logic
- <ins>MongoDB Atlas:</ins> for database hosting
- <ins>Nodemailer:</ins> for sending emails to user (example: reset password)
- <ins>cryptojs:</ins> for encrypt password and token
- <ins>JSON Web Token (JWT):</ins> for authenticate users
- <ins>Stripe:</ins> for online payments via bank card
- <ins>Mailgun:</ins> for emailing users whenver they signed up or attempt to update their passwords

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

### **Technologies & Third services:**

<br>

- Postman
- MongoDB Atlas
- Parcel-bundler
- Strip
- Mailtrap
- Mapbox
- Mailgun

<br><br>

### **coming improvement:**

<br>

- Impelement map along with locations to visit
- improve users + admin&lead-guide profile dashbord (booked travels, list of all users, travels, list of users ratings ...)
- Improve the web application responsiveness and design
