import app from "./app.js";
import dbconnect from "./db.js";

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server started on port ${process.env.PORT || 3000}`);
});
