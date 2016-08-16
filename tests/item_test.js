var should = require('should');
var io = require('socket.io-client');

var socketUrl = 'http://localhost:3000/';

var client = io.connect(socketUrl);
var username = "Numan";

describe("Item socket server", function(){
    /**
     * Test to assure that items array is returned.
     */
    it("should return an array of items.", function(done){
        client.emit('get-items', username);
        client.on('render-items', function(data){
            data.should.be.an.Array().and.not.empty();
            done();
        });
    });
});