import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import crypto from "crypto";   // ✅ dodaj ovo
const PORT = process.env.PORT || 5000;


const startserver=async ()=>{


await connectDB();

app.listen(PORT, () => {



  console.log(`Server running on port ${PORT}`);
});

}


startserver();