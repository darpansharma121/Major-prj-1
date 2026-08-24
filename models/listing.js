const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
   title:{
    type: String,
    required: true
   },
   description:{
    type: String,
   
   },
   price:{
    type: Number,
    
   },
   location:{
    type: String,
   
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
   
   }
});
module.exports=mongoose.model("listing",listingSchema);