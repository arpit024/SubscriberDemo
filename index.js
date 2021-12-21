const subscriber = require('./Subscriber');
const routingkeys = require('./routingKeys')
const EmailServer = require('./emailServer')
subscriber.startSubscriber(routingkeys, handleMessage);

async function handleMessage(msg){
    let parsedMsg = JSON.parse(msg.content.toString());
    if(parsedMsg.routingKey == "Email_Forgot_Password"){
        await EmailServer.SendEmailForForgotPassword(parsedMsg)
    }else{
        throw new Error("Routing key didn't match")
    }
}