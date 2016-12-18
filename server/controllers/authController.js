const authController = function(User) {
  const signIn = function(req, res) {
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;

      if (user && user.password === req.body.password) {
        res.json({ success: true, token: '0u812'});
      } else {
        res.status(401);
        res.json({ success: false, message: 'Authentication failed. Email and password did not match.' });
      }
    });
  };

  return {
    signIn: signIn
  };
};

export default authController;
