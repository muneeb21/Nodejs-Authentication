const User = require('../models/user');

// for password encrypting and decrypting
const bcrypt=require('bcryptjs'); 

module.exports.profile = async function(req, res){

    return res.render('user_profile', {
        title: 'User Profile'
    })
}



// update password
module.exports.newPassword= async function(req,res){
    
    try{
        if (req.body.password != req.body.confirm_password){
                console.log("Confirm password does not match");
                req.flash('error','Confirm password does not match');
                return res.redirect('back');
        }
        let user=await User.findOne({email:req.user.email});
        // if user does not exists then redirect
        if(!user){
          console.log("User not valid");
          req.flash('error','User not valid');
          return res.redirect('back');
        }

        // if user exists compare the decrypted password and update
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
        
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create =async function(req, res){
try{

    let user=await User.findOne({email:req.body.email});
                if (!user){
                    // if confirm password does not matches then redirect
                    if (req.body.password != req.body.confirm_password){
                        console.log("Confirm password does not match");
                        req.flash('error','Confirm password does not match');
                        return res.redirect('back');
                    }

                    // create a new user with encrypted password
                    const pwd=req.body.password;
                    const salt = await bcrypt.genSalt(10);
         			const hashedPassword = await bcrypt.hash(pwd, salt);
              let newUser= await User.create({name:req.body.name,email:req.body.email,password:hashedPassword});
                   
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
    // req.flash('success','Logged in successfully');
    console.log("createsession");
    return res.redirect('/');
}

// Log out
module.exports.destroySession =async function(req, res){
    req.flash('success','Logged out successfully');
    req.logout();
    

    return res.redirect('/');
}