const User = require('../models/user');


module.exports.profile = function(req, res){

    return res.render('user_profile', {
        title: 'User Profile'
    })
}

// render the update password page
module.exports.updatePassword=function(req,res){
    return res.render('update_password',{
        title:'Change Password'
    })
}

// update password
module.exports.newPassword= async function(req,res){

          
    
    // if (req.body.password != req.body.confirm_password){
    //     console.log("Confirm password does not match");
    //     return res.redirect('back');
    // }

    // User.findOne({email: req.user.email}, function(err, user){
    //     if(err){console.log('error in finding user in signing up'); return}

    //     if (user){
    //         if (user.password != req.body.old_password){
    //             console.log("Old password does not match");
    //             return res.redirect('back');
    //         }

    //         console.log(req.user.email);
            
    //         console.log(user.id);
            
    //         User.findByIdAndUpdate(user.id, req.body, function(err, user){
    //             return res.redirect('back');
    //         });

    //     }else{
    //         console.log("User Not there");
    //         return res.redirect('back');
    //     }

    // });
   

  }
 



// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}




// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        console.log("Confirm password does not match");
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();

    return res.redirect('/');
}