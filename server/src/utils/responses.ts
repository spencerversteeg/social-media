import { response, Response } from 'express';

const responses = {
  success(res: Response, data?: unknown): void {
    res.status(200).json({
      status: 'success',
      data: data || null
    });
  },
  invalidAuthentication(res: Response, data?: unknown): void {
    res.status(401).json({
      status: 'error',
      data: data || 'Not authenticated'
    });
  },
  invalidFields(res: Response, data?: unknown, fields?: unknown) {
    res.status(400).json({
      status: 'error',
      data: data || 'Invalid request',
      fields: fields || {}
    });
  },
  invalidCredentials(res: Response, data?: unknown) {
    res.status(401).json({
      status: 'error',
      data: data || 'Invalid username or password'
    });
  },
  invalidToken(res: Response, data?: unknown) {
    res.status(401).json({
      status: 'error',
      data: data || 'Session expired, please login again.'
    });
  },
  missingToken(res: Response, data?: unknown) {
    res.status(401).json({
      status: 'error',
      data: data || 'Session expired, please login again.'
    });
  },
  notFound(res: Response, data?: unknown) {
    res.status(404).json({
      status: 'error',
      data: data || 'The resource requested is not available.'
    });
  },
  notVerified(res: Response, data?: unknown) {
    res.status(403).json({
      status: 'error',
      data: data || 'You must verify your account.'
    });
  },
  passwordMismatch(res: Response, data?: unknown) {
    res.status(400).json({
      status: 'error',
      data: data || 'The provided passwords do not match.'
    });
  },
  resetUsed(res: Response, data?: unknown) {
    res.status(400).json({
      status: 'error',
      data: data || 'This password reset has already been used.'
    });
  },
  unauthorized(res: Response, data?: unknown) {
    res.status(401).json({
      status: 'error',
      data: data || 'You are unable to access this resource.'
    });
  },
  alreadyExists(res: Response, data?: unknown) {
    res.status(401).json({
      status: 'error',
      data: data || 'This resource already exists.'
    });
  },
  internal(res: Response, data?: unknown) {
    res.status(500).json({
      status: 'error',
      data: data || 'Something went wrong. If this error continues to happen please reach out to support.'
    });
  }
};

export default responses;
