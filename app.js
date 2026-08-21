const express= require('express');
const app= express();
const mongoose= require('mongoose');
const Listing= require('./models/listing');
const path=require('path');

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

app.get('/',(req,res)=>{
    res.send("kya reh bhik mangiye..!")
});

app.get('/listings',async(req,res)=>{
   const allListings = await Listing.find({});
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

app.post("/listings",async (req, res)=>{
const newListing =new Listing(req.body.Listing);
await newListing.save();
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

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
}
);

