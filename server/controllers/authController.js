const authController = function(User, jwt) {
  const signIn = function(req, res) {
    const errors = [];

    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) {
        console.log(`Error in User.findOne: ${err}`);

        errors.push(err.detail);
        sendErrorResponse(res, 500, errors);
      }

      if (user) {
        User.comparePassword(req.body.password, user.password, function(err, hashResponse) {
          if (err || !hashResponse) {
            console.log(`Error in comparing passwords: ${err}`);

            errors.push('Authentication failed. Email and password did not match.' );
            sendErrorResponse(res, 401, errors);
          } else {
            // simplify so passport can use user object as JSON
            const userObj = JSON.parse(JSON.stringify(user));

            const token = jwt.sign(userObj, process.env.PASSPORT_SECRET, {
              expiresIn: 10080 // in seconds
            });

            res.status(201);
            res.json({ token: `JWT ${token}` });
          }
        });
      } else {
        console.log(`Error in finding User: user with that email not found`);

        errors.push('Authentication failed. Email and password did not match.' );
        sendErrorResponse(res, 401, errors);
      }
    });
  };

  const register = function(req, res) {
    const errors = [];

    if (!validateEmail(req.body.email)) {
      errors.push('Invalid email');
    }

    if (!validatePassword(req.body.password)) {
      errors.push('Invalid password. Password must contain at least 8 characters, at least one UPPERCASE letter, at least one lowercase letter, at least 1 number, and at least 1 symbol.');
    }

    if (req.body.password !== req.body.passwordConfirmation) {
      errors.push('Passwords must match.');
    }

    if (errors.length) {
      sendErrorResponse(res, 400, errors);
    } else {
      User.save(req.body, function(err, user) {
        if (err) {
          errors.push(err.detail);
          sendErrorResponse(res, 500, errors);
        } else if (user && user.id) {
          res.json({ user: user });
        } else {
          errors.push('Failed to register user. Please check your request and try again.');
          sendErrorResponse(res, 500, errors);
        }
      });
    }
  };

  return {
    signIn: signIn,
    register: register
  };

  function sendErrorResponse(res, status, errors) {
    res.status(status);
    res.json({ success: false, errors: errors });
  }

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function validatePassword(password) {
    // at least 8 characters, at least one UPPERCASE letter, at least one lowercase letter, at least 1 number, at least 1 symbol
    var re = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,}$/;
    return re.test(password);
  }
};

export default authController;
