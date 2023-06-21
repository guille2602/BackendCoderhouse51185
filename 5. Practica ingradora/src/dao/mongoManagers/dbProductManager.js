import productsModel from "../models/products.model.js";

export default class MongoProductManager {
    async readProducts(limit = null) {
        let prodsList = null;
        try {
            if (!limit) {
                prodsList = await productsModel.find().lean();
            } else {
                prodsList = await productsModel.find().limit(limit).lean();
            }
            return prodsList;
        } catch (error) {
            console.log("Error al leer la base de datos de MongoDB" + error);
        }
    }

    async readProduct(id) {
        let product = null;
        let status;
        let description;

        //Validacion de formato
        const regEx = /^[0-9a-fA-F]{24}$/;
        const validIdFormat = regEx.test(id);

        if (validIdFormat) {
            try {
                product = await productsModel.findOne({ _id: id });
                if (product) {
                    status = 200;
                    description = "Sucess";
                } else {
                    console.log("Error: El id de producto ingresado no existe");
                    description =
                        "Error: El id de producto ingresado no existe";
                    status = 400;
                }
            } catch (error) {
                console.log(
                    "Error al leer la base de datos de MongoDB" + error
                );
                description = "Error al leer la base de datos de MongoDB";
                status = 500;
            }
        } else {
            status = 400;
            description = "Error: El formato de id es incorrecto";
            console.log("Error: El formato de id es incorrecto");
        }

        return {
            status,
            description,
            product,
        };
    }

    async addProduct(newProduct) {
        let resStatus;
        let resDescription;
        let payload = null;

        const { title, description, code, price, stock, category, thumbnail } =
            newProduct;

        if (!title || !description || !code || !price || !stock || !category) {
            resStatus = 400;
            resDescription = "Error: Datos incompletos";
        }

        const status = true;
        const product = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnail,
        };

        try {
            payload = await productsModel.create(product);
            let prodsList = await productsModel.find();

            resStatus = 200;
            resDescription = "Sucess";
        } catch (error) {
            console.log("Error al leer la base de datos de MongoDB" + error);
            resStatus = 500;
            resDescription = "Error al leer la base de datos de MongoDB";
        }

        return {
            status: resStatus,
            description: resDescription,
            payload,
        };
    }

    async updateProduct(id, updProduct) {
        let resStatus;
        let resDescription;
        let payload = null;

        //Validacion de formato
        const regEx = /^[0-9a-fA-F]{24}$/;
        const validIdFormat = regEx.test(id);

        if (validIdFormat) {
            const {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail,
            } = updProduct;

            if (
                !title ||
                !description ||
                !code ||
                !price ||
                !status ||
                !stock ||
                !category
            ) {
                resStatus = 400;
                resDescription =
                    "Falló al actualizar, datos de producto incompletos";
            }

            const prodToUpdate = {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnail,
            };
            try {
                payload = await productsModel.updateOne(
                    { _id: id },
                    prodToUpdate
                );
                if (payload?.modifiedCount >= 1) {
                    resStatus = 200;
                    resDescription = "Sucess";
                } else {
                    if (payload?.matchedCount >= 1) {
                        resStatus = 200;
                        resDescription =
                            "No se detectaron modificaciones en el producto";
                    } else {
                        resStatus = 400;
                        resDescription =
                            "Error: No se encontró ningún producto con el id enviado";
                    }
                }
            } catch (error) {
                console.log(
                    "Error al actualizar la base de datos de MongoDB" + error
                );
                resStatus = 500;
                resDescription =
                    "Error al actualizar la base de datos de MongoDB";
            }
        } else {
            resStatus = 400;
            resDescription = "Error: El formato de id es incorrecto";
            console.log("Error: El formato de id es incorrecto");
        }

        return {
            status: resStatus,
            description: resDescription,
            payload,
        };
    }

    //CodeExist - Validador de código repetido (Por implementar)

    async deleteProduct(id) {
        let resStatus;
        let resDescription;
        let payload = null;

        const regEx = /^[0-9a-fA-F]{24}$/;
        const validIdFormat = regEx.test(id);

        if (validIdFormat) {
            try {
                const payload = await productsModel.deleteOne({ _id: id });
                if (payload?.deletedCount >= 1) {
                    resStatus = 200;
                    resDescription = "Sucess";
                } else {
                    resStatus = 400;
                    resDescription =
                        "Error: No se encontró ningún producto con el id enviado";
                }
            } catch (error) {
                console.log("Error al eliminar el elemento" + error);
                resStatus = 500;
                resDescription =
                    "Error al actualizar la base de datos de MongoDB";
            }
        } else {
            console.log("Error: El formato de id es incorrecto");
            resStatus = 400;
            resDescription = "Error: El formato de id es incorrecto";
        }

        return {
            status: resStatus,
            description: resDescription,
            payload,
        };
    }

    async paginateContent ( limit, sort, page , query ) {

        const parsedQuery = query && query.split("_");
        let searchKey = null;
        let searchValue = null;
        if (parsedQuery?.length == 2) {
            searchKey = parsedQuery[0];
            searchValue = parsedQuery[1];
            if (searchKey == "price" || searchKey == "stock") {
                searchValue = parseInt(searchValue);
            } else if (searchKey === "status") {
                searchValue = searchValue == "true" ? true : false;
            }
        }

        try {
            const {
                docs,
                totalPages,
                prevPage,
                nextPage,
                hasPrevPage,
                hasNextPage,
            } = await productsModel.paginate(
                { [searchKey]: searchValue },
                {
                    limit: limit,
                    page: page,
                    sort: sort == 1 || sort == -1 ? { price: sort } : null,
                }
            )
            let parsedProdsList = docs.map((item) => ({
                id: item._id,
                title: item.title,
                description: item.description,
                code: item.code,
                price: item.price,
                status: item.status,
                stock: item.stock,
                category: item.category,
            }));
            const prevLink = `?page=${
                hasPrevPage ? prevPage : null
            }&limit=${limit ? limit : null}&${
                query ? query : null
            }&sort=${sort}`;
            const nextLink = `?page=${
                hasNextPage ? nextPage : null
            }&limit=${limit ? limit : null}&${
                query ? query : null
            }&sort=${sort}`;
            return {
                code: 200,
                status: "sucess",
                payload: parsedProdsList,
                totalPages,
                prevPage,
                nextPage,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink,
                nextLink,
            };
        } catch (error) {
            console.log("Error al leer la base de datos de MongoDB", +error);
            return {
                code: 400,
                status: "Error al leer la base de datos de MongoDB",
                payload: null,
                totalPages: null,
                prevPage: null,
                nextPage: null,
                page: null,
                hasPrevPage: null,
                hasNextPage: null,
                prevLink: null,
                nextLink: null,
            };
        }
    }
}
