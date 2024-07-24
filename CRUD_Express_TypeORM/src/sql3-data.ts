import { AppDataSource } from "./data-source";
import { Request, Response, NextFunction } from "express";
import { User } from "./User";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export const ERROR_MESSAGES = {
    VALIDATION_FAILED: () => ({
        message: 'Validation failed!'
    }),
    USER_NOT_FOUND: (id: number) => ({
        message: `Object with ID ${id} not found`
    }),
    USER_NOT_DELETED: () => ({
        message: `Failed to delete object.`
    }),
};

const userRepository = AppDataSource.getRepository(User);

const getUsers = async (req: Request, res: Response) => {
    const users = await userRepository.find()
    res.json(users)
}

const getUserById = async (req: Request, res: Response) => {
    const results = await userRepository.findOneBy({
        id: Number(req.params.id),
    })
    if (!results) {
        return res.status(404).send(ERROR_MESSAGES.USER_NOT_FOUND(Number(req.params.id)));
    }
    return res.send(results)
}

const addUser = async (req: Request, res: Response) => {
    // const user = userRepository.create(req.body);
    const user = plainToClass(User, req.body);
    const errors = await validate(user);
    if (errors.length > 0) {
        return res.status(400).send(ERROR_MESSAGES.VALIDATION_FAILED());
    }
    const results = await userRepository.save(user);
    return res.send(results);
    
}

const updateUser = async (req: Request, res: Response) => {
    let user = await userRepository.findOneBy({
        id: Number(req.params.id),
    })
    if (!user) {
        return res.status(400).send(ERROR_MESSAGES.USER_NOT_FOUND(Number(req.params.id)));
    }
    userRepository.merge(user, plainToClass(User, req.body));
    // Валидируем обновленный объект
    const errors = await validate(user);
    if (errors.length > 0) {
        return res.status(400).send(ERROR_MESSAGES.VALIDATION_FAILED());
    }
    return res.send(await userRepository.save(user));
}

const deleteUser = async (req: Request, res: Response) => {
    const results = await userRepository.delete(req.params.id)
    if ((results.affected ?? 0) > 0) {
        return res.status(204).end();
    }
    return res.status(404).send(ERROR_MESSAGES.USER_NOT_DELETED());
}

export {
    getUsers,
    addUser,
    getUserById,
    updateUser,
    deleteUser
};