const request =  require('supertest');
const {Genre} = require('../../models/genres');
const {User} = require('../../models/users');
const mongoose = require('mongoose');
let server;
let token;
let name;

const exec = async () => {
    
    return await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name});
};

beforeEach(() => {
    token = new User().generateAuthToken();
    name = 'genre1';
});



describe('/api/genres', () =>{
    beforeEach(() => { server = require('../../index') })
    afterEach( async () => { 
        server.close();
        await Genre.remove({});
    });
    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name:"genre1" },
                { name:"genre2" },
                { name:"genre3" }
            ])
            const res = await request(server).get('/api/genres'); 
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(g => g.name === 'genre3')).toBeTruthy(); 
        });
    }); 
    describe('GET /:id', () => {
        it('should return a genre if a valid id is given', async () => {
            const genre = new Genre({name: 'genre1'});
            await genre.save();

            const res = await request(server).get('/api/genres/'+genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
        it('should return a 404 if an invalid id is given', async () => {
            
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
             
        });
        it('should return a 404 if an invalid id is given', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get('/api/genres/'+id);
            expect(res.status).toBe(404);
             
        });
        
    });
    describe('POST /', () => {
        it('should return a 401 if client not logged in', async () =>{
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);

        });

        it('should return a 400 if the genre is invalid less than 5 char\'s', async () =>{
            name = 'abc';
            const res = await exec();
            expect(res.status).toBe(400);

        });

        it('should return a 400 if the genre is invalid greater than 50 char\'s', async () =>{
            name = new Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);

        });

        it('should return a 200 and save the genre if it is valid', async () =>{
            const res = await exec();
            const genre = await Genre.find({name:'genre1'});
            expect(res.status).not.toBeNull();

        });

        it('should return the genre if it is valid', async () =>{
            
            const res = await exec();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');

        });
    });

});