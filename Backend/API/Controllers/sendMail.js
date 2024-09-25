var nodejsmailer  = require('nodemailer'); 

var mailOptions ={
    from:'copiousteams@gmail.com',
    cc:'deodhemanthan10@gmail.com',
    to:'kendreparth8@gmail.com',
    subject:"Sending Email to parth",
    text:"Welcome to NodeMailer, It's Working",
    html: '<h1>Welcome</h1><p>That was easy!</p>',
}   

var transporter = nodejsmailer.createTransport({
    service:'gmail',
    auth:{
        user:'copiousteams@gmail.com',
        pass:'ypmhjjkslacxrgou'    
    }
});

//send the mail
transporter.sendMail(mailOptions,function(error,info){

     if(error){
         console.log(error);
     }else{
         console.log('Email Send ' + info.response);
     }
});