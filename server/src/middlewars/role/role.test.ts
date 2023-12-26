/* eslint-disable @typescript-eslint/unbound-method */
import { buildNext, buildRes, getNewUser } from '@/utils/generate'
import { type Request } from 'express'
import withRole, { isAdmin, type Role } from './role'

describe('Role middlewars', () => {
  const mockRequest = {} as unknown as Request
  const mockResponse = buildRes()
  const mockNext = buildNext()

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('withRole', () => {
    it('should call next() if user has the specified role', () => {
      const role: Role = 'admin'
      const user = getNewUser(role)
      mockRequest.user = user
      const middleware = withRole(role)
      middleware(mockRequest, mockResponse, mockNext)
      expect(mockNext).toHaveBeenCalled()
      expect(mockResponse.sendStatus).not.toHaveBeenCalled()
    })

    it('should send 403 status if user does not have the specified role', () => {
      const role: Role = 'admin'
      const user = getNewUser('user')
      mockRequest.user = user
      const middleware = withRole(role)
      middleware(mockRequest, mockResponse, mockNext)
      expect(mockNext).not.toHaveBeenCalled()
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(403)
    })
  })

  describe('isAmin', () => {
    it('should call next() if user has the specified role', () => {
      const admin = getNewUser('admin')
      mockRequest.user = admin
      isAdmin(mockRequest, mockResponse, mockNext)
      expect(mockNext).toHaveBeenCalled()
      expect(mockResponse.sendStatus).not.toHaveBeenCalled()
    })

    it('should send 403 status if user does not have the specified role', () => {
      const user = getNewUser('user')
      mockRequest.user = user
      isAdmin(mockRequest, mockResponse, mockNext)
      expect(mockNext).not.toHaveBeenCalled()
      expect(mockResponse.sendStatus).toHaveBeenCalledWith(403)
    })
  })
})
