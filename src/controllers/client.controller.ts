import { Request, Response } from 'express';
import { ClientService } from '../services/client.service';

const clientService = new ClientService();

export const createClient = async (req: Request, res: Response): Promise<void> => {

  try {

    const existsByCode = await clientService.getClientByCode(req.body.code);
    if (existsByCode) {
      res.status(409).json({
        message: `Ya existe un cliente con el código '${req.body.code}'`,
        status: 409,
        error: true,
      });
      return;
    }

    const existsByNit = await clientService.getClientByNit(req.body.nit);
    if (existsByNit) {
      res.status(409).json({
        message: `Ya existe un cliente con el NIT '${req.body.nit}'`,
        status: 409,
        error: true,
      });
      return;
    }

    const client = await clientService.createClient(req.body);

    res.status(201).json({
      message: 'Client created successfully',
      status: 201,
      error: false,
      result: client,
    });

  } catch (error) {

    console.error('Validation error:', error);

    res.status(500).json({
      message: 'An unexpected error occurred while creating the client',
      status: 500,
      error: true,
    });

  }

};

export const getClients = async (req: Request, res: Response): Promise<void> => {

  try {

    const { nit, limit, offset } = req.query;

    const result = await clientService.getAllClients(
      typeof nit === 'string' ? nit : undefined,
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );

    res.status(200).json({
      message: 'Clients retrieved successfully',
      status: 200,
      error: false,
      result: {
        count: result.count,
        rows: result.rows,
      },
    });

  } catch (error) {

    console.error('Validation error:', error);
    
    res.status(500).json({
      message: 'An unexpected error occurred while retrieving the clients',
      status: 500,
      error: true,
    });

  }

};