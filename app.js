const express= require('express');
const app= express();
const mongoose= require('mongoose');
const path=require('path');
const methodOverride=require("method-override")
const ejsMate=require('ejs-mate');
const ExpressError= require("./utils/ExpressError.js")
const session=require("express-session");
const flash=require("connect-flash");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

main()
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err) => {
 console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/dreamila");
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions ={
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000, // 7 days in milliseconds
        maxAge: 7*24*60*60*1000, // 7 days in milliseconds
        httpOnly: true, 
    },
}

// Root route
app.get('/',(req,res)=>{
    res.send("kya reh bhik mangiye..!")
});


app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});


// Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)



// Error handling middleware
app.all("/{*splat}", (req,res,next)=>{
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message)
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
}
);

