
 function AuthorizeSocket(socket , next) {
    const token = socket.handshake.auth.token;

    if (token === "123") {
        console.log('Socket Authorized');
        next()
    }
    else next( (new Error('UnAuhtorized User')))
}

module.exports = AuthorizeSocket;