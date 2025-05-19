import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterSchema } from '../utils/validators/auth.validators';

const authService = new AuthService();

export const registerUser = async (req: Request, res: Response): Promise<void> => {

  try {

    const parsed = RegisterSchema.parse(req.body);
    const { email, password } = parsed;

    const user = await authService.register(email, password);

    if (!user.success) {
      res.status(user.status).json({
        success: false,
        message: user.message,
      });
      return;
    }

    res.status(201).json({
      status: 201,
      message: 'Usuario registrado correctamente',
      result: user.result,
    });


  } catch (error) {

    console.error('Error en el registro de usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });

  }
  
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {

  try {

    const { email, password } = req.body;
    const token = await authService.login(email, password);

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas, intenta nuevamente',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      result: {
        token,
        email: email,
      },
    });


  } catch (error) {

    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });

  }

};