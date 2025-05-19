import { Request, Response } from 'express';
import { createProductSchema } from '../utils/validators/product.validator';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export const createProduct = async (req: Request, res: Response): Promise<void> => {

  try {

    const alreadyExistsByName = await productService.getProductByName(req.body.name);

    if (alreadyExistsByName) {
      res.status(409).json({
        message: `Ya existe un producto con el nombre '${req.body.name}'`,
        status: 409,
        error: true,
      });
      return;
    }

    const alreadyExistsByCode = await productService.getProductByName(req.body.code);

    if (alreadyExistsByCode) {
      res.status(409).json({
        message: `Ya existe un producto con el código '${req.body.code}'`,
        status: 409,
        error: true,
      });
      return;
    }

    const parsed = createProductSchema.parse(req.body);
    const product = await productService.createProduct(parsed);

    res.status(201).json({
      message: 'Producto creado correctamente',
      status: 201,
      error: false,
      result: product,
    });

  } catch (err) {

    console.error('Validation error:', err);
    res.status(500).json({
      message: 'Ha ocurrido un error inesperado al crear el producto',
      status: 500,
      error: true,
    });
      
  }

};