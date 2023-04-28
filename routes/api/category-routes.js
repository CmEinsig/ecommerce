const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
//Get All categories
router.get('/', (req, res) => {
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
  // update a category by its `id` value
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
