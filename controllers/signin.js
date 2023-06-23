
const handleSignIn =  (req, res, db, bcrypt) => {
    const {email, password} = req.body;
    if ( !email || !password){
        return res.status(400).json("Incorrect form submission")
    }
    db.select('email','hash').from('login').where({email:email})
    .then(loginData =>{
        if (bcrypt.compareSync(password, loginData[0].hash)){
            db.select('*').from('users').where({email:email})
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