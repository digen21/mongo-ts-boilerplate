import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { User } from '../models';
import { CommonService } from '../services';
import { IUser } from '../types';
import { ServerError } from '../utils';

const userService = new CommonService<IUser>(User);

export const createUser = async (req: Request, res: Response) => {
  const user = await userService.create(req.body);
  return res.status(httpStatus.CREATED).send({
    message: 'User created successfully',
    result: user,
    httpStatus: httpStatus.CREATED,
  });
};

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await userService.findAll();
  return res.status(httpStatus.OK).send({ result: users });
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.findById(req.params.id);
  if (!user) {
    throw new ServerError(httpStatus.NOT_FOUND, 'User not found');
  }

  return res.status(httpStatus.OK).send({ result: user });
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await userService.findById(req.params.id);
  if (!user) {
    throw new ServerError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updatedUser = await userService.update(req.params.id, req.body);
  res.status(httpStatus.OK).send({
    message: 'User updated successfully',
    result: updatedUser,
    httpStatus: httpStatus.OK,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  await userService.delete(req.params.id);
  return res.status(httpStatus.OK).send({
    message: 'User deleted successfully',
    result: null,
    httpStatus: httpStatus.OK,
  });
};
