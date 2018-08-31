const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const genres = [
        {id: 1, name:'genre1'},
        {id: 2, name:'genre2'},
        {id: 3, name:'genre3'},
        {id: 4, name:'genre4'}
];

//Display all genres endpoint
app.get('/api/genres', (req,res) =>{
        res.send(genres);
});

//Display a single genre endpoint
app.get('/api/genres/:id', (req,res) =>{
        const genre = genres.find(c => c.id === parseInt(req.params.id));
        if (!genre) res.status(404).send('The genre was not found...');

        res.send(genre);
});

//Create genre endpoint
app.post('/api/genres', (req, res) =>{
        const schema = {
                name: Joi.string().min(3).required()
        };
        const result = Joi.validate(req.body, schema);
        if (result.error){
                res.status(404).send(result.error.details[0].message);
                return; 
        }
        const genre = {
                id: genres.length + 1,
                name: req.body.name
};
genres.push(genre);
res.send(genres);
});

//Update genre endpoint
app.put('/api/genres/:id', (req, res) => {
       const genre = genres.find(c => c.id === parseInt(req.params.id));
       if(!genre) return res.status(404).send("The genre was not found");
       const { error } = validateGenre(req.body);
       if (error) return res.status(400).send(error.details[0].message);
       genre.name = req.body.name;
       res.send(genre);

});

//Delete genre endpoint
app.delete('/api/genres/:id', (req, res) => {
        const genre = genres.find(c => c.id === parseInt(req.params.id));
        if (!genre) return res.status(404).send('The genre with the given ID was not found.');
      
        const index = genres.indexOf(genre);
        genres.splice(index, 1);
      
        res.send(genre);
      });

//Set PORT envVariable
const port = process.env.PORT || 3000;
console.log(process.env.PORT);

//Function for Genre validation
function validateGenre(genre){
        const schema = {
                name: Joi.string().min(3).required()};
        return Joi.validate(genre, schema);
}

//Start server
app.listen(port, () => console.log(`Listening on port ${port}....`));