var should = require('should');
var io = require('socket.io-client');

var socketUrl = 'http://localhost:3000/';

var client = io.connect(socketUrl);
/**
 * Unit test to assure that an auction is initiated and a bid is made successfully.
 */
describe("Auctions socket server", function(){
    /**
     * Test to ensure proper auction data is returned
     */
    it("should return an object containing data related to started auction and should contain property time", function(done){
        var data = { id: 3,
                    item_name: 'Diamond',
                    image: 'http://pngimg.com/upload/diamond_PNG6683.png',
                    quantity: 1,
                    username: 'Numan',
                    createdAt: '2016-08-15T04:12:08.000Z',
                    updatedAt: '2016-08-15T10:01:07.000Z',
                    '$$hashKey': 'object:29',
                    aucQty: 1,
                    minBid: 40 };
        client.emit('start-auction', data);
        client.on('emit-auction', function(res){
            res.should.be.an.Object().and.not.empty();
        });
        done();
    });

    it("should return an object containing data related to started auction and it should contain properties time, winner and winning bid",function(done){
        var data = {
            name : 'Hilal',
            amount : 50
        };
        client.emit('place-bid', data);
        client.on('test-emit-auction', function(res){
            res.should.be.an.Object().and.not.empty();
            res.should.have.property('time').which.is.a.Number();
            res.should.have.property('winner').which.is.a.String();
            res.should.have.property('winningBid').which.is.a.Number();
            done();
        });
    });
});