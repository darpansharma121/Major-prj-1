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
   imageUrl:{
    type: String,
    default:"https://pixabay.com/images/search/copyright/",
    set:(v) => 
        v===""
      ? "https://pixabay.com/images/search/copyright/"
      :v,
   },
   country:{
    type: String,
   
   }
});
module.exports=mongoose.model("listing",listingSchema);