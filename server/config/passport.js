import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';

// Setup work and export for the JWT passport strategy
export default function(passport, User) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
  opts.secretOrKey = process.env.PASSPORT_SECRET;

  passport.use(new JwtStrategy(opts, function(jwt_payload, cb) {
    User.findOne({id: jwt_payload.id}, function(err, user) {
      if (err) {
        return cb(err, false);
      }
      if (user) {
        cb(null, user);
      } else {
        cb(null, false);
      }
    });
  }));
}
