const request =  require('supertest');
const {Genre} = require('../../models/genres');
const {User} = require('../../models/users');
const mongoose = require('mongoose');
let server;
let token;
let name;

describe('/api/genres', () =>{
    const exec = async () => {
    
        return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name});
    };
    
    beforeEach(() => {
        server = require('../../index');
        token = new User().generateAuthToken();
        name = 'genre1';
    });
    
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
    describe('PUT /:id', () => {
        let token; 
        let newName; 
        let genre; 
        let id; 
    
        const exec = () => {
          return request(server)
            .put('/api/genres/' + id)
            .set('x-auth-token', token)
            .send({ name: newName });
        }
    
        beforeEach(async () => {
          // Before each test we need to create a genre and 
          // put it in the database.      
          genre = new Genre({ name: 'genre1' });
          await genre.save();
          
          token = new User().generateAuthToken();     
          id = genre._id; 
          newName = 'updatedName'; 
        })

        afterEach(async () => {
          await Genre.remove({});
          server.close();
        })
        
    
        it('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        it('should return 400 if genre is less than 5 characters', async () => {
          newName = '1234'; 
          
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        it('should return 400 if genre is more than 50 characters', async () => {
          newName = new Array(52).join('a');
    
          const res = await exec();
    
          expect(res.status).toBe(400);
        });
    
        it('should return 404 if id is invalid', async () => {
          id = 1;
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should return 404 if genre with the given id was not found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should update the genre if input is valid', async () => {
          await exec();
    
          const updatedGenre = await Genre.findById(genre._id);
    
          expect(updatedGenre.name).toBe(newName);
        });
    
        it('should return the updated genre if it is valid', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id', genre._id.toHexString());
          expect(res.body).toHaveProperty('name', newName);
        });
      })
      describe('DELETE /:id', () => {
        let token; 
        let genre; 
        let id; 

      const exec = async () => {
        return await request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      // Before each test we need to create a genre and 
      // put it in the database.      
      genre = new Genre({ name: 'genre1' });
      await genre.save();
      
      id = genre._id; 
      token = new User({ isAdmin: true }).generateAuthToken();     
    })
    
        it('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        it('should return 403 if the user is not an admin', async () => {
          token = new User({ isAdmin: false }).generateAuthToken(); 
    
          const res = await exec();
    
          expect(res.status).toBe(403);
        });
    
        it('should return 404 if id is invalid', async () => {
          id = 1; 
          
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        
    
        it('should delete the genre if input is valid', async () => {
          await exec();
    
          const genreInDb = await Genre.findById(id);
    
          expect(genreInDb).toBeNull();
        });
    
        it('should return the removed genre', async () => {
          const res = await exec();
    
          expect(res.body).toHaveProperty('_id', genre._id.toHexString());
          expect(res.body).toHaveProperty('name', genre.name);
        });
        it('should return 404 if genre with the given id was not found', async () => {
          id = '5b91111011111xxxa3c20000'
          const res = await exec();
          expect(res.status).toBe(404);
        });
      });  

});