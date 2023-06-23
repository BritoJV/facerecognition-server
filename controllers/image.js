
const clarifaiRequestOptions = (imageURL) =>{
    const PAT = 'a334ec27669d4da7bf225dfe3037d0c1';
    const USER_ID = 'pih18w73x5wx';       
    const APP_ID = 'test';
    const IMAGE_URL = imageURL;
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
    return requestOptions;
}

const handleApiCall = (req,res) =>{
    const options = clarifaiRequestOptions(req.body.input);
    fetch(`https://api.clarifai.com/v2/models/face-detection/outputs`, options)
    .then((response) => response.json())
    .then((response => res.json(response.outputs[0].data.regions)))
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