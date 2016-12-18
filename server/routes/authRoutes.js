import express from 'express';

const routes = function(User) {
  const authRouter = express.Router();

  authRouter.route('/')
    .post(function(req, res) {
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;
// console.log(user);
// console.log(user.password);
// console.log(req.body.password);
// console.log(user.password === req.body.password);

      if (user && user.password === req.body.password) {
        res.json({ success: true, token: '0u812'});
      } else {
        res.status(401);
        res.json({ success: false, message: 'Authentication failed. Email and password did not match.' });
      }
    });
  });

  return authRouter;
};

export default routes;
