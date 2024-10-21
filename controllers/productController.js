import productModel from "../models/productModel.js";

export const getAllProductsController = async (req, res) => {
    try {
        const products = await productModel.find()
        res.status(200).json({
            success : true,
            message : "got all produts",
            products : products
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            message: "error while getting all products",
            error : error.message
        })
    }
};

export const getSingleProductController = async (req, res) => {
    try {
        const oneProduct = await productModel.findById(req.params.id);
        if(!oneProduct) {
            return res.status(404).json({
                success : false,
                message : "Product not found"
            })
        }

        res.status(200).json({
            success : true,
            message : "one product got",
            product : oneProduct
        })
    } catch (error) {
        // cast error || object ID
        if (error.name === "CastError") {
            return res.status(500).json({
                success : false,
                message : "Invalid id"
            })
        }
        res.status(500).json({
            success : false,
            message : "error while getting single products",
            error : error.message
        })
    }
}