const moment = require('moment');
const request = require('supertest');
const {Rental} = require('../../models/rentals');
const {Movie} = require('../../models/movies');
const {User} = require('../../models/users');
const mongoose = require('mongoose');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    
    const exec = ()=>{
        return request(server)
        .post('/api/returns')
        .set('x-auth-token',token)
        .send({customerId, movieId});
    };

    beforeEach(async() => {
        server = require('../../index');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: {name:'123456'},
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer:{
                _id: customerId,
                name: '12345',
                phone:'12345'
            },
            movie:{
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });

    afterEach( async () => { 
        await Rental.remove({});
        await Movie.remove({});
        await server.close();        
    });

    it('should return 401 if the client is not logged in', async ()=> {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('should return 400 if the customerId is not provided', async ()=> {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 400 if the movieId is not provided', async ()=> {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 404 if no rental found for given movieId/customerId', async ()=> {
        await Rental.remove({});
        const res = await exec();
        expect(res.status).toBe(404);
    });
    it('should return 400 if return processed', async ()=> {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 200 if the request is valid', async ()=> {
        const res = await exec();
        expect(res.status).toBe(200);
    });
    it('should set the dateReturned property if input is valid', async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;

        expect(diff).toBeLessThan(10*1000);
    });
    it('should set the rental fee => (numDays*dailyRate)', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();  
        
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10*1000);
    });
    it('should increase the stock', async () => {
        const res = await exec();
        const movieInDb = await Movie.findById(movie._id);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });
    it('should return the rental in the response body', async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        expect(res.body).toHaveProperty('dateOut');
        expect(res.body).toHaveProperty('dateReturned');
        expect(res.body).toHaveProperty('rentalFee');
        expect(res.body).toHaveProperty('customer');
        expect(res.body).toHaveProperty('movie');

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut','dateReturned','rentalFee','customer','movie']
            ));
    });    
});