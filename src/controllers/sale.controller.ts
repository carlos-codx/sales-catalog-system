import { Request, Response } from 'express';
import { SaleService } from '../services/sale.service';
import { CreateSaleSchema } from '../utils/validators/sale.validators';
import { ClientService } from '../services/client.service';

const saleService = new SaleService();
const clientService = new ClientService();

export const createSale = async (req: Request, res: Response): Promise<void> => {

  try {

    const parsed = CreateSaleSchema.parse(req.body);
    const productIds = parsed.products.map((item) => item.productId);

    const allProductsExists = await saleService.checkProductsExistence(productIds);

    if (!allProductsExists) {
      res.status(400).json({
        success: false,
        message: 'No se encontraron todos los productos proporcionados',
      });
      return;
    }

    const isCF = parsed.clientNIT === 'CF';
    const clientId = parsed.clientId ?? 0;
    const client = isCF ? null : await clientService.getClientById(clientId);

    if (!isCF && !client) {
      res.status(400).json({
        success: false,
        message: 'No se encontró el cliente proporcionado',
      });
      return;
    }

    const registeredSale = await saleService.registerSale(
      isCF ? null : clientId,
      parsed.paymentMethod,
      parsed.products
    );

    if (!registeredSale.success) {
      res.status(400).json({
        success: false,
        message: registeredSale?.message ?? 'No se pudo registrar la venta',
      });
      return;
    }

    res.status(201).json({
      status: 201,
      message: 'Venta registrada correctamente',
      result: registeredSale.sale,
    });

  } catch (error) {

    if (error instanceof Error) {
      console.error('Validation error:', error);
      res.status(500).json({
        message: 'Ha ocurrido un error inesperado al registrar la venta',
        status: 500,
        error: true,
      });
    } else {
      res.status(500).json({
        message: 'Ha ocurrido un error inesperado al registrar la venta',
        status: 500,
        error: true,
      });
    }

  }
};