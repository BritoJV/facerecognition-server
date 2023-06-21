
const handleSignIn =  (req, res, db, bcrypt) => {
    db.select('email','hash').from('login').where({email:req.body.email})
    .then(loginData =>{
        if (bcrypt.compareSync(req.body.password, loginData[0].hash)){
            db.select('*').from('users').where({email:req.body.email})
            .then(user =>{
                res.json(user[0])
            })
            .catch(err => res.status(400).json("Unable to find user"))
        }
        else{
            res.status(400).json("Error logging in 1")
        }
    })
    .catch(err => res.status(400).json("Error logging in 2"))
}

module.exports = { handleSignIn };