const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");




router.get('/',wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    allListings.forEach((listing) => {
        if (listing.price === null) listing.price = 0;
    });
    res.render('listings/index.ejs',{allListings});
}));

router.get('/new', isLoggedIn, (req,res)=>{
    res.render('listings/new.ejs');
});



router.get('/:id', wrapAsync(async(req,res)=>{
   let { id } = req.params;
   const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
      })
      .populate("owner");

   if(!listing){
       req.flash("error", "Listing not found!");
       return res.redirect("/listings");
   }

   res.render("listings/show.ejs", { listing });
}));

router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res)=>{
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();

        req.flash("success", "New listing created!");
        res.redirect("/listings");
    }));

router.get("/:id/edit", isLoggedIn,isOwner,
  wrapAsync(async (req,res)=>{
    
       let {id}=req.params;
    const listing =await Listing.findById(id);
     if(!listing){
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});   
   
  
}));

router.put("/:id",  isLoggedIn,
    isOwner,

    validateListing,
    wrapAsync(async(req,res) =>{
    
      let {id}=req.params;
     
        await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators: true});
         req.flash("success", "Listing updated successfully!");
        res.redirect(`/listings/${id}`);
}));

router.delete("/:id", isLoggedIn,isOwner,wrapAsync(async(req,res)=> {
let{id}= req.params;
let deletedListing= await Listing.findByIdAndDelete(id)
console.log("deleted");
req.flash("success", "Listing deleted successfully!");
res.redirect("/listings");
}));

module.exports= router;