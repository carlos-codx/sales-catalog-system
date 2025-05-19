import { Request, Response } from 'express';
import { CreateProductSchema } from '../utils/validators/product.validator';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export const createProduct = async (req: Request, res: Response): Promise<void> => {

  try {

    const parsed = CreateProductSchema.parse(req.body);
    const alreadyExistsByName = await productService.getProductByName(parsed.name);

    if (alreadyExistsByName) {
      res.status(409).json({
        message: `Ya existe un producto con el nombre '${req.body.name}'`,
        status: 409,
        error: true,
      });
      return;
    }

    const alreadyExistsByCode = await productService.getProductByName(parsed.code);

    if (alreadyExistsByCode) {
      res.status(409).json({
        message: `Ya existe un producto con el código '${parsed.code}'`,
        status: 409,
        error: true,
      });
      return;
    }


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

export const getProducts = async (req: Request, res: Response): Promise<void> => {

  try {

    const { code, name, limit, offset } = req.query;
    const result = await productService.getAllProducts(
      {
        code: typeof code === 'string' ? code : undefined,
        name: typeof name === 'string' ? name : undefined,
      },
      limit ? parseInt(limit as string) : undefined,
      offset ? parseInt(offset as string) : undefined
    );

    res.status(200).json({
      message: 'Productos obtenidos correctamente',
      status: 200,
      error: false,
      result: {
        count: result.count,
        rows: result.rows.map((product) => ({
          id: product.id,
          code: product.code,
          name: product.name,
          description: product.description,
          price: product.price,
          unitId: product.unitId,
          unitName: product.unit?.name,
        })),
      },
    })

  } catch (error) {
    console.error('Error al obtener los productos:', error);
    res.status(500).json({
      message: 'Ha ocurrido un error inesperado al obtener los productos',
      status: 500,
      error: true,
    });

  }

};


export const updateProduct = async (req: Request, res: Response): Promise<void> => {

  try {

    const id = parseInt(req.params.id);
    const updated = await productService.updateProduct(id, req.body);
    res.status(200).json({
      message: 'Producto actualizado correctamente',
      status: 200,
      error: false,
      result: updated,
    });

  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(404).json({
      message: 'No se ha encontrado el producto',
      status: 404,
      error: true,
    });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {

  try {

    const id = parseInt(req.params.id);
    const deleted = await productService.deleteProduct(id);

    if (!deleted) {
      res.status(404).json({
        message: 'No se ha encontrado el producto',
        status: 404,
        error: true,
      });
      return;
    }

    res.status(204).send();

  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({
      message: 'Ha ocurrido un error inesperado al eliminar el producto',
      status: 500,
      error: true,
    });
  }
};