const express = require('express');
const axios = require('axios');

const itemsRouter = express.Router();

// Create product
itemsRouter.get('/', async (req, res) => {
  const apiQuery = req.query.q;
  // Return empty array if no query is provided
  if (!apiQuery) {
    const response = {
      author: {
        name: 'Wencel',
        lastname: 'Santos',
      },
      categories: [],
      items: [],
    };
    res.status(200).send(response);
    return;
  }
  try {
    const { data } = await axios.get(
      `https://api.mercadolibre.com/sites/MLA/search?q=${apiQuery}`
    );
    const categories =
      data.filters
        .find(filter => filter.id === 'category')
        ?.values[0].path_from_root.map(item => item.name) ||
      data.available_filters
        .find(filter => filter.id === 'category')
        ?.values.reduce((prev, next) =>
          prev.results > next.results ? prev : next
        );

    const response = {
      author: {
        name: 'Wencel',
        lastname: 'Santos',
      },
      categories: categories.name ? [categories.name] : categories,
      items: data.results.slice(0, 4).map(item => ({
        id: item.id,
        title: item.title,
        price: {
          currency: item.prices.prices[0].currency_id,
          amount: item.prices.prices[0].amount,
          decimals: '00',
        },
        picture: item.thumbnail,
        condition: item.condition,
        free_shipping: item.shipping.free_shipping,
        state: item.address.state_name,
      })),
    };
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error.toString() });
  }
});

itemsRouter.get('/:id', async (req, res) => {
  const itemId = req.params.id;
  try {
    const { data: item } = await axios.get(
      `https://api.mercadolibre.com/items/${itemId}`
    );

    const { data: description } = await axios.get(
      `https://api.mercadolibre.com/items/${itemId}/description`
    );

    const response = {
      author: {
        name: 'Wencel',
        lastname: 'Santos',
      },
      item: {
        id: item.id,
        title: item.title,
        price: {
          currency: item.currency_id,
          amount: item.price,
          decimals: '00',
        },
        picture: item.thumbnail,
        condition: item.condition,
        free_shipping: item.shipping.free_shipping,
        sold_quantity: item.sold_quantity,
        description: description.plain_text,
      },
    };
    res.status(200).send(response);
  } catch (error) {
    res.status(400).send({ error: error.toString() });
  }
});

module.exports = itemsRouter;
