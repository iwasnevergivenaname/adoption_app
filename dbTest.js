const db = require("./models");
//
db.profile.create({
  likes: 'fluffy animals the enjoy cuddling, the color pink',
  dislikes: 'animals that are picky eaters',
  bio: 'i miss my german shepherd',
  userId: 2
}).then(response => {
  // console.log(`was this profile created? ${created}`);
  console.log(response.get());
}).catch(error =>{
  console.log(error);
})


//   let formData = req.body;
//   db.fave.findOrCreate({
//     // where looks in db
//     where: {title: formData.title},
//     defaults: {imdbid: formData.imdbid}
//   })
//   .then(([response, created]) => {
//     console.log(`was it created? ${created}`);
//     res.redirect("faves");
//   })
//   .catch(err => {
//     console.log("i make em do eeeeet");
//   });
// });


//
// <input hidden type="text" name="name" value="<%=movieDetails.name%>">
//   <input hidden type="text" name="type" value="<%=movieDetails.type%>">
//   <input hidden type="text" name="gender" value="<%=movieDetails.gender%>">
//   <input hidden type="text" name="age" value="<%=movieDetails.age%>">
//   <input type="hidden" name="userId" value="<%= user.id %>">