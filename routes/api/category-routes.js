const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
//Get All categories
router.get('/', (req, res) => async {
    try {
      const catAll = await Category.findAll();
      res.status(200).json(catAll);
    } catch (err) {
      res.status(500).json(err);
    }
});

//Find category by id value
router.get('/:id', (req, res) => {
  try {
    const catAll = await Category.findByPk(req.params.id, {
      include: [{ category: Shirts, Shorts, Music, Hats, Shoes  ,as: 'category_name' }]
    });

    if (!catAll) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }  
    res.status(200).json(catAll);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Creates new category
router.post('/', (req, res) => {
  try {
    const catAll = await Category.create(req.body);
    res.status(200).json(catAll);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
    // update product data
    Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
      .then((product) => {
        // find all associated tags from ProductTag
        return ProductTag.findAll({ where: { product_id: req.params.id } });
      })
      .then((productTags) => {
        // get list of current tag_ids
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
        // figure out which ones to remove
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
  
        // run both actions
        return Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      })
      .then((updatedProductTags) => res.json(updatedProductTags))
      .catch((err) => {
        // console.log(err);
        res.status(400).json(err);
      });
});

//Delete category by id value
router.delete('/:id', (req, res) => {
  try {
    const catAll = await Category.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!catAll) {
      res.status(404).json({ message: 'No category found with this id!' });
      return;
    }

    res.status(200).json(catAll);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
