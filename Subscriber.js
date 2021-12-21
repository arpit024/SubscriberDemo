var amqp = require('amqp-connection-manager');
var exchange = 'Subscriber';
let options = {
    reconnectTimeInSeconds: 5
}
const bindToQueue=async(queue,routingkeys,channel)=>{
    for(let i=0;i<routingkeys.length;i++){
        await channel.bindQueue(queue,exchange,routingkeys[i]);
    }
}
exports.startSubscriber = (routingkeys,handlerFunction) => {
    let url = 'amqp://' + 'guest' + ":" + 'guest' + '@' + 'localhost' + ":" + 5672
    const connection = amqp.connect(url, options)
    connection.on('connect', () => { console.log('Subscriber Connected to Rabbitmq') })
    connection.on('disconnect',err=>{console.log('Disconnected...',err)})
    let channelWrapper = connection.createChannel({
        json: true,
        setup: async (channel) => {
            await channel.assertExchange(exchange, 'topic', { durable: true });
            await channel.assertQueue('email',{durable:true})
            await bindToQueue('email',routingkeys,channel);
            await channel.consume('email', async(msg)=>{
                try{
                await handlerFunction(msg)
                await channel.ack(msg)
                }catch(err){console.log(err)
                    await channel.nack(msg,false,false)
                }
            })
        }
    });
    channelWrapper.waitForConnect().then(() => console.log('Listening for messages'))
}