const User = require('../models/user');
const bcrypt=require('bcryptjs');

module.exports.profile = async function(req, res){

    return res.render('user_profile', {
        title: 'User Profile'
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
    try{
        if (req.body.password != req.body.confirm_password){
                console.log("Confirm password does not match");
                req.flash('error','Confirm password does not match');
                return res.redirect('back');
        }
        let user=await User.findOne({email:req.user.email});
        if(!user){
          console.log("User not valid");
          req.flash('error','User not valid');
          return res.redirect('back');
        }
        let result=await bcrypt.compare(req.body.old_password,user.password);
        if(!result){
            console.log("Old password not valid");
            req.flash('error','Invalid old password');
          return res.redirect('back');
        }
        const pwd=req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pwd, salt);
        User.findByIdAndUpdate(user.id, {password:hashedPassword}, function(err, user){
            console.log("Updated password"); 
             req.flash('success','Password updated');      
            return res.redirect('back');
                    });

    }catch(err){
        console.log(err,"****** internal error");
        return res.redirect('back');
    }
   

  }
 



// render the sign up page
module.exports.signUp = async function(req, res){
    if (req.isAuthenticated()){
        
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}




// render the sign in page
module.exports.signIn =async function(req, res){

    if (req.isAuthenticated()){
        // req.flash( "Signed in");
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create =async function(req, res){
try{
    

    // User.findOne({email: req.body.email}, function(err, user){
    //     if(err){console.log('error in finding user in signing up'); return}

    //     if (!user){
    //         User.create(req.body, function(err, user){
    //             if(err){console.log('error in creating user while signing up'); return}

    //             return res.redirect('/users/sign-in');
    //         })
    //     }else{
    //         return res.redirect('back');
    //     }

    // });

    let user=await User.findOne({email:req.body.email});
                if (!user){
                    if (req.body.password != req.body.confirm_password){
                        console.log("Confirm password does not match");
                        req.flash('error','Confirm password does not match');
                        return res.redirect('back');
                    }
                    const pwd=req.body.password;
                    const salt = await bcrypt.genSalt(10);
         			const hashedPassword = await bcrypt.hash(pwd, salt);
                    // const name=req.body.name;
                    // const email=req.body.email;
                    // const password=req.body.password;
              let newUser= await User.create({name:req.body.name,email:req.body.email,password:hashedPassword});
                    // if(err){console.log('error in creating user while signing up'); return}
                    req.flash('success','Account created');
                    return res.redirect('/users/sign-in');
                
            }else{
                req.flash('error','User already exists');
                return res.redirect('back');
            }

}
catch(err){
    console.log(err);
    return res.redirect('back');
}
}


// sign in and create a session for the user
module.exports.createSession = async function(req, res){
    req.flash('success','Logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession =async function(req, res){
    req.logout();
    req.flash('success','Logged out successfully');

    return res.redirect('/');
}