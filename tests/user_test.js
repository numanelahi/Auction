var should = require('should');
var io = require('socket.io-client');

var socketUrl = 'http://localhost:3000/';

var client = io.connect(socketUrl);
var username = "Numan";

describe("User socket server", function(){
    /**
     * Test to ensure it returns user object and containes required properties.
     */
    it("should return a user object that contain username and coins a its properies", function (done) {
        client.emit('login', username);
        client.on('login-user',function(user){
            user.should.be.an.Object().and.not.empty();
            user.should.have.property('username').which.is.a.String();
            user.should.have.property('coins').which.is.a.Number();
            done();
        });
    });
});