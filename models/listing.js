const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");
const User = require("./user.js");
const listingSchema = new Schema({
   title:{
    type: String,
    required: true
   },
   description:{
    type: String,
      required: true
   },
   price:{
    type: Number,
      required: true,
      min: 0,
      default: 0
   },
   location:{
    type: String,
      required: true
   },
    image:{
      type: String,
      default:"https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=60",
      set:(v) => {
         if (v && typeof v === "object") return v.url;
         return v === "" ? "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=60" : v;
      },
    },
      imageurl: String,
   country:{
    type: String,
      required: true
   },
   reviews: [
      {
         type: Schema.Types.ObjectId,
         ref: "Review",
      },
   ],


   owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
   }
});

listingSchema.post("findOneAndDelete", async (listing) => {
   if (listing) {
      await Review.deleteMany({
         _id: {
            $in: listing.reviews,
         },
      });
   }
})

module.exports=mongoose.model("listing",listingSchema);