function sanitize(obj) { 
   if(!obj || typeof obj !== 'object') return obj;
   for(const key in obj) {
     if(key.startsWith('$') || key.includes('.')) {
       delete obj[key];
     } else {
       sanitize(obj[key]);
     }
   }
}

module.exports = (req, res, next) => {
  //console.log("Before:",req.body);
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  //console.log("After:",req.body);

  next();
}