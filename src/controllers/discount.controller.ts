import { Request, Response } from 'express';
import { DiscountService } from '../services/discount.service';
import { ProductService } from '../services/product.service';
import { CreateDiscountSchema } from '../utils/validators/discount.validators';

const discountService = new DiscountService();
const productService = new ProductService();

export const createDiscount = async (req: Request, res: Response): Promise<void> => {

  try {
    const parsed = CreateDiscountSchema.parse(req.body);
    const productId = parsed.productId;
    const existsProduct = await productService.getProductById(productId);

    if (!existsProduct) {
      res.status(404).json({
        message: `El producto con id '${productId}' no existe`,
        status: 404,
        error: true,
      });
      return;
    }

    const existsDiscount = await discountService.getDiscountByProductId(parsed.productId);
    if (existsDiscount) {
      res.status(409).json({
        message: 'Ya existe un descuento para este producto',
        status: 409,
        error: true,
      });
      return;
    }

    await discountService.createDiscount(req.body);
    res.status(201).json({
      message: 'Descuento creado correctamente',
      status: 201,
      error: false,
    });

  } catch (error) {

    console.error('Validation error:', error);
    res.status(500).json({
      message: 'Ha ocurrido un error inesperado al crear el descuento',
      status: 500,
      error: true,
    });

  }

};

export const activateDiscount = async (req: Request, res: Response): Promise<void> => {

  try {

    const id = parseInt(req.params.id);
    const discount = await discountService.activateDiscount(id);

    if (!discount) {
      res.status(404).json({
        message: 'Descuento no encontrado',
        status: 404,
        error: true,
      });
      return;
    }

    res.status(200).json({
      message: 'Descuento activado correctamente',
      status: 200,
      error: false,
    });

  } catch (error) {

    console.error('Validation error:', error);
    res.status(500).json({
      message: 'Ha ocurrido un error inesperado al activar el descuento',
      status: 500,
      error: true,
    });

  }

};

export const deactivateDiscount = async (req: Request, res: Response): Promise<void> => {

  try {

    const id = parseInt(req.params.id);
    const discount = await discountService.deactivateDiscount(id);

    if (!discount) {
      res.status(404).json({
        message: 'Descuento no encontrado',
        status: 404,
        error: true,
      });
      return;
    }

    res.status(200).json({
      message: 'Descuento desactivado correctamente',
      status: 200,
      error: false,
    });

  } catch (error) {

    console.error('Validation error:', error);
    res.status(500).json({
      message: 'Ha ocurrido un error inesperado al desactivar el descuento',
      status: 500,
      error: true,
    });

  }
};