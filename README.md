# ***Go Ahead Travel***

![]()

## **Content Overview:**

- [The project main idea](#the-project-main-idea)
- [Demo](#demo)
- [Architecture](#architecture)
- [Error handling](#error-handling)
- [Data Modeling](#data-modeling)
- [Technologies and Third services](#technologies-and-third-services)
- [Security features](#security-features)
- [Coming improvements](#coming-improvements)

<br><br>

### **The project main idea:**
The project is a travel booking web application, where users can purchase travel via bank card, create an account, log in and log out, with the ability to reset their password and update their data (name, photo, and email basically) along with an improved user experience.

<br>

### **Demo:** (click to redirect to youtube demo video)

<br>

[![](https://img.youtube.com/vi/eAUnlVjOXFw/0.jpg)](https://www.youtube.com/watch?v=eAUnlVjOXFw)

<br><br>

### **Architecture:**

<br>

**Project Directory structure:**
```
├── app.js
├── controllers
│   ├── authController.js
│   ├── errorController.js
│   ├── factoryHandler.js
│   ├── ratingController.js
│   ├── travelController.js
│   ├── userController.js
│   └── viewsController.js
├── data
│   ├── import-data.js
│   ├── ratings.json
│   ├── travels.json
│   └── users.json
├── models
│   ├── ratingModel.js
│   ├── travelModel.js
│   └── userModel.js
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
│       ├── index.js
│       ├── login.js
│       ├── signup.js
│       └── updateSettings.js
├── routes
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
    ├── Error.pug
    ├── footer.pug
    ├── goaheadtravel.pug
    ├── header.pug
    ├── login.pug
    ├── overview.pug
    ├── profile.pug
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

<br><br>

### **Security features:**

<br>

As it represents purchasing via card bank feature, the app provides solid and security features to prevent threats and hackers attacks such as:
- Compromised databases (encrypt password with hash and salt, using SHA256 to encrypt reset password token)
- Brute force attacks (use bcrypt, rate limiting, maximum login attempts)
- Cross-site scripting (XSS) attacks (store JWT in HTTPOnly cookies, set especial HTTP headers using helmet package)
- Denial of service attacks (limit payload data, avoid Evil regular expressions)
- NoSQL queries injection attacks (implement data sanitization, and use mongoose schema to implement well-defined data type)

<br><br>

### **coming improvement:**

<br>

- Implement booking schema
- Upload images
- Send emails to clients
- Impelement map locations to visit
- Implement payment

<br><br>
