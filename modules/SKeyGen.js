module.exports = function(){
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-=+!@#$%^&*'
    let skey='SKEY'

    do{
        const randomIndex = alphabet[Math.floor(Math.random() * alphabet.length)]
        if(Math.random()>0.5){
            skey=skey+randomIndex
        }else{
            skey=randomIndex+skey
        }
    }while(skey.length<30)

    return skey
}