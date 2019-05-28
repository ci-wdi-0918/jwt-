const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {

    signupAndLogIn: (params) => {


        return new Promise((resolve, reject) => {

            User.findOne({email: params.email})
                .then(user => {

                    if (user) {
                        let errors = {};
                        errors.email = 'Email already exists';
                        errors.status = 400;
                        reject(errors);
                    } else {

                        const newUser = new User({
                                                    email: params.email,
                                                    username: params.username, 
                                                    password: params.password 
                                                });

                        bcrypt.genSalt(10, (err, salt) => {

                            bcrypt.hash(newUser.password, salt, (err, hash) => {

                                if (err) {
                                    reject(err);
                                } else {
                                    newUser.password = hash;

                                    newUser.save()
                                           .then( user => {

                                            const payload = {
                                                id: user._id, 
                                                email: user.email,
                                                username: user.username
                                            }

                                            jwt.sign(payload, process.env.SECRET_KEY, {
                                                expiresIn: 3600
                                            }, (err, token) => {

                                                if (err) {
                                                    reject(err);
                                                } else {
                                                    let success = {};
                                                    success.confirmation = true; 
                                                    success.token = `Bearer ${token}`;
                                                    resolve(success);
                                                }

                                            })

                                           })
                                           .catch( error => {
                                               reject(error);
                                           })
                                    
                                }

                            })

                        });

                    }
                })
                .catch( error => {
                    reject(error);
                })


        });
    }
}