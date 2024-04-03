import * as Yup from "yup";
import Product from "../models/Product";
import Category from "../models/Category";
import User from "../models/User";

class ProductController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        price: Yup.number().required(),
        category_id: Yup.number().required(),
        offer: Yup.boolean(),
      });

      try {
        await schema.validateSync(request.body, { abortEarly: false });
      } catch (error) {
        return response.status(400).json({ error: error.errors });
      }

      const { admin: isAdmin } = await User.findByPk(request.userId);

      if (!isAdmin) {
        return response.status(401).json();
      }

      const { filename: path } = request.file;
      const { name, price, category_id, offer } = request.body;

      const product = await Product.create({
        name,
        price,
        category_id,
        path,
        offer,
      });

      return response.json({ product });
    } catch (error) {
      console.log(error);
    }
  }

  async index(request, response) {
    try {
      const products = await Product.findAll({
        include: [
          { model: Category, as: "category", attributes: ["id", "name"] },
        ],
      });
      console.log(request.userId);
      return response.json(products);
    } catch (error) {
      console.log(error);
    }
  }

  async update(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        price: Yup.number(),
        category_id: Yup.number(),
        offer: Yup.boolean(),
      });

      try {
        await schema.validateSync(request.body, { abortEarly: false });
      } catch (error) {
        return response.status(400).json({ error: error.errors });
      }

      const { admin: isAdmin } = await User.findByPk(request.userId);

      if (!isAdmin) {
        return response.status(401).json();
      }

      const { id } = request.params;

      const product = await Product.findByPk(id);

      if (!product) {
        return response
          .status(401)
          .json({ error: "Make sure your product ID is correct" });
      }

      let path;
      if (request.file) {
        path = request.file.filename;
      }

      const { name, price, category_id, offer } = request.body;

      await Product.update(
        {
          name,
          price,
          category_id,
          path,
          offer,
        },
        {
          where: { id },
        },
      );

      return response.status(200).json();
    } catch (error) {
      console.log(error);
    }
  }
}

export default new ProductController();
