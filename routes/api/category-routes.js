const router = require('express').Router();
const { Category, Product, ProductTag } = require('../../models');
// const { json } = require('sequelize/types');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  Category.findAll({
    // be sure to include its associated Products
    attributes: ['id', 'category_name'],
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      },
    ],
  })
    .then((dbCategoryData) => res.json(dbCategoryData))
    .catch((err) => {
      console.log('FIND ALL CATEGORIES =>', err);
      res.status(500).json(err);
    });
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  Category.findOne({
    where: {
      id: req.params.id,
    },
    // be sure to include its associated Products
    attributes: ['id', 'category_name'],
    include: [
      {
        model: Product,
        attributes: ['id', 'product_name', 'price', 'stock', 'category_id'],
      },
    ],
  })
    .then((dbCategoryData) => {
      if (!dbCategoryData) {
        res.status(404).json({ message: 'no category found with this id' });
        return;
      }
      res.json(dbCategoryData);
    })
    .catch((err) => {
      console.log('FINE ONE CATEGORY =>', err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // create a new category, expecting id and category_name
  Category.create({
    category_name: req.body.category_name,
  })
    .then((dbCategoryData) => {
      res.json(dbCategoryData);
    })
    .catch((err) => {
      console.log('CREATE NEW CATEGORY =>', err);
      res.status(500).json(err);
    });
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value, expecting id and category_name
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((dbCategoryData) => {
      if (!dbCategoryData[0]) {
        res.status(404).json({ message: 'No Category found with this id' });
        return;
      }
      res.json(dbCategoryData);
    })
    .catch((err) => {
      console.log('UPDATE CATEGORY =>', err);
      res.status(500).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  await ProductTag.destroy({
    where: {
      product_id: req.params.id,
    },
  });
  const result = await Product.destroy({
    where: {
      id: req.params.id,
    },
  });
  // return res.json(result);
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbCategoryData) => {
      if (!dbCategoryData) {
        res.status(404).json({ message: 'No Category found with this id' });
        return;
      }
      res.json(dbCategoryData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
