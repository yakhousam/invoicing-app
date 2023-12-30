import UserModel from '@/model/user'
import { createUserSchema, parseUserSchema } from '@/validation/user'
import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Strategy as JwtStrategy, type VerifiedCallback } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'

const JWT_SECRET =
  process.env.JWT_SECRET ?? 'rNgc3v7NxYenUVFoI1AbqH82AIDItLpSPWcmXeC4qPo='

function generateToken(payload: string | Record<string, unknown>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1y'
  })
}
const cookieExtractor = (req: {
  cookies: { token?: string }
}): string | null => {
  let token = null
  if (req?.cookies?.token !== undefined) {
    token = req.cookies.token
  }
  return token
}

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const parsedUser = createUserSchema.parse(req.body)
    const user = new UserModel(parsedUser)
    const newUser = await user.save()
    const token = generateToken({ sub: newUser._id })
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
    const returnedUser = parseUserSchema.parse(newUser.toJSON())
    res.status(201).json(returnedUser)
  } catch (error) {
    next(error)
  }
}

const signin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const user = parseUserSchema.parse(req.user)
    const token = generateToken({ sub: user._id })
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
    res.status(200).json(user)
  } catch (error) {
    next(error)
  }
}

// Local Strategy for username/password authentication
passport.use(
  new LocalStrategy(
    {
      usernameField: 'name',
      passwordField: 'password'
    },
    function (name, password, done) {
      void localStrategyVerifyFunction(name, password, done)
    }
  )
)

// jwt strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: JWT_SECRET
    },
    function (jwtPayload, done) {
      void jwtStrategyVerifyFunction(jwtPayload, done)
    }
  )
)

async function jwtStrategyVerifyFunction(
  jwtPayload: { sub: string },
  done: VerifiedCallback
): Promise<void> {
  try {
    const user = await UserModel.findById(jwtPayload.sub)
    if (user === null) {
      done(null, false)
    } else {
      const returnedUser = parseUserSchema.parse(user.toJSON())
      done(null, returnedUser)
    }
  } catch (error) {
    done(error, false)
  }
}

async function localStrategyVerifyFunction(
  name: string,
  password: string,
  done: VerifiedCallback
): Promise<void> {
  try {
    const user = await UserModel.findOne({ name })
    if (user === null) {
      done(null, false, { message: 'Incorrect credentials.' })
      return
    }
    const validate = await user.isValidPassword(password)
    if (!validate) {
      done(null, false, { message: 'Incorrect password.' })
      return
    }
    const returnedUser = parseUserSchema.parse(user.toJSON())
    done(null, returnedUser, { message: 'Logged in Successfully' })
  } catch (error) {
    done(error)
  }
}

const authController = {
  signin,
  signup
}

export default authController
