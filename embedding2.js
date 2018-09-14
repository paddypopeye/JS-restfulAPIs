const mongoose  = require('mongoose');


mongoose.connect('mongodb://localhost/playground')
.then(() => console.log('Connected to the Mongodb Playground'))
.catch(error => console.log('Failed to connect to MongoDB'));


const Author = mongoose.model('Author', new mongoose.Schema({
    name: String,
    bio: String,
    website: String 
}));

const Course = mongoose.model('Course', new mongoose.Schema({
    name: String
}));


async function createAuthor(name, bio, website) {
    const author = new Author({
        name,
        bio,
        website
    })    

    const result = await author.save();
    console.log(result);
};

async function createCourse(author, name){ 
    const course = new Course({
        name,
        author
    })
};

async function listCourses(){
  const courses = await Course.find();
  console.log(courses);
};