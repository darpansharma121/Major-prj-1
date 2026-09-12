const Listing = require("../models/listing");

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    allListings.forEach((listing) => {
        if (listing.price === null) listing.price = 0;
    });
    res.render('listings/index.ejs',{allListings});
};

module.exports.renderNewForm =(req,res)=>{
    res.render('listings/new.ejs');
};

module.exports.showListing =async(req,res)=>{
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
};
module.export.createListing=async (req, res)=>{
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        await newListing.save();

        req.flash("success", "New listing created!");
        res.redirect("/listings");
    };

    module.export.renderEditForm=async (req,res)=>{
        
           let {id}=req.params;
        const listing =await Listing.findById(id);
         if(!listing){
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs",{listing});   
       
      
    };

    module.export.updateListing=async(req,res) =>{
        
          let {id}=req.params;
         
            await Listing.findByIdAndUpdate(id,{...req.body.listing},{runValidators: true});
             req.flash("success", "Listing updated successfully!");
            res.redirect(`/listings/${id}`);
    };


    module.export.destroyListing=async(req,res)=> {
let{id}= req.params;
let deletedListing= await Listing.findByIdAndDelete(id)
console.log("deleted");
req.flash("success", "Listing deleted successfully!");
res.redirect("/listings");
}
