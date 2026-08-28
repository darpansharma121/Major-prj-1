const express= require('express');
const app= express();
const mongoose= require('mongoose');
const Listing= require('./models/listing');
const path=require('path');
const methodOverride=require("method-override")
const ejsMate=require('ejs-mate');
const wrapAsync = require("./utils/wrapAsync.js")



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

app.get('/',(req,res)=>{
    res.send("kya reh bhik mangiye..!")
});

app.get('/listings',async(req,res)=>{
    const allListings = await Listing.find({});
    allListings.forEach((listing) => {
        if (listing.price === null) listing.price = 0;
    });
    res.render('listings/index.ejs',{allListings});
});

app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs")
})

app.get('/listings/:id',async(req,res)=>{
   let {id}=req.params;
    const listing =await Listing.findById(id);
    res.render("listings/show.ejs",{ listing });
}); 

app.post("/listings", wrapAsync(async (req, res)=>{
  
      const newListing =new Listing(req.body.Listing);
await newListing.save();
res.redirect("/listings");  
    
}));

app.get("/listings/:id/edit",async (req,res)=>{
    
       let {id}=req.params;
    const listing =await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});   
   
  
});

app.put("/listings/:id", async(req,res) =>{
      let {id}=req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators: true});
   res.redirect(`/listings/${id}`);
});

app.delete("/listings/:id",async(req,res)=> {
let{id}= req.params;
let deletedListing= await Listing.findByIdAndDelete(id)
console.log("deleted");
res.redirect("/listings");
});

//  app.get('/listings', async (req, res)=>{
//     let sampleListing= new Listing({
//         title:"Sample Listing",
//         description:"This is a sample listing",
//         location:"Assam,Tezpur",
//         country:"India",
//         price:10000
       
//     });
//     await sampleListing.save();
//     console.log("saved successfully");
//     res.send("Listing saved successfully");
        
//  });

app.use((err,req,res, next) => {
res.send("Something went wrong!")
});

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
}
);

