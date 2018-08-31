const http = require('http');

const server = http.createServer((req,res)=>{
    if(req.url === '/'){
           console.log('this is base:path\'');
           
    }
    if (req.url === '/api/courses'){
        console.log('this is base:path /api/courses');
    }
});

server.listen(3000);
console.log("Listening on port 3000.....");