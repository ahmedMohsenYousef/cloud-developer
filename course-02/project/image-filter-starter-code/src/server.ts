import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Image filtering endpoint 
  app.get("/filteredimage", async ( req, res ) => {

    let {image_url} = req.query

    if (!image_url) {
      return res.status(400).send({ message: 'image_url is required or malformed' });
    }

    console.log("Filtering image...");
    
    filterImageFromURL(image_url)
    .then((filterOutput) => {
      
      console.log("Finished filtering image, sending file...");
      res.sendFile(filterOutput, (error)=>{
      
        console.log("Finished sending, deleting local tmp files...");

        if(error)
          console.log("Finished sending with error: ", error);
          
        deleteLocalFiles([filterOutput]);
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(422).send({ message: 'unable to process image url' });
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();