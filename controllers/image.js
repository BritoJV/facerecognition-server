// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'a334ec27669d4da7bf225dfe3037d0c1';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'pih18w73x5wx';
const APP_ID = 'test';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
// const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';

///////////////////////////////////////////////////////////////////////////////////
// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
///////////////////////////////////////////////////////////////////////////////////

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);


const handleApiCall = (req,res) =>{
    const IMAGE_URL = req.body.input;
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
            inputs: [
                { data: { image: { url: IMAGE_URL, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }

            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }

            // Since we have one input, one output will exist here
            const output = response.outputs[0].data.regions;

            res.json(output)
        }

    );
}

const handleImage =  (req, res, db) => {
    const {id} = req.body;
    db('users').where({id:id})
    .increment('entries',1)
    .returning('entries')
    .then(response =>{
        res.json(response[0].entries)
    })
    .catch(err => res.status(400).json("Unable to update entries count"))
}

module.exports = { handleImage, handleApiCall };