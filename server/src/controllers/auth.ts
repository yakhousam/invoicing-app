import UserModel, { zodUserShema, type UserType } from '@/model/user'
import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { Strategy as JwtStrategy, type VerifiedCallback } from 'passport-jwt'
import { Strategy as LocalStrategy, type IVerifyOptions } from 'passport-local'

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

export type AuthSignupRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserType
>

const signup = async (
  req: AuthSignupRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    zodUserShema.parse(req.body)
    const { name, email, password } = req.body
    const user = new UserModel({ name, email, password })
    const newUser = await user.save()
    const { password: pwd, ...userWithoutPassword } = newUser.toJSON()
    const token = generateToken({ sub: newUser._id })
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
    res.status(201).json({ user: userWithoutPassword })
  } catch (error) {
    next(error)
  }
}

const signin = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const user = req.user as UserType & { _id: string }
    const token = generateToken({ sub: user._id })
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    })
    res.status(200).json({ user })
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
      done(null, user)
    }
  } catch (error) {
    done(error, false)
  }
}

async function localStrategyVerifyFunction(
  name: string,
  password: string,
  done: (
    error: any,
    user?: false | Express.User | undefined,
    options?: IVerifyOptions | undefined
  ) => void
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
    const { password: pwd, ...userWithoutPassword } = user.toJSON()
    done(null, userWithoutPassword, { message: 'Logged in Successfully' })
  } catch (error) {
    done(error)
  }
}

const authController = {
  signin,
  signup
}

export default authController
