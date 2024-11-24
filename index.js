const express = require('express');
const { resolve } = require('path');
let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());

let db;

(async () => {
	db = await open({
        filename: "./database.sqlite", 
        driver: sqlite3.Database,
    });
})();

async function fetchAllRestaurants() {
    let query = "SELECT * FROM restaurants"; 
    let response = await db.all(query, []);
    return { movies: response };
}

async function fetchRestaurantbyID(detailID) {
    let query = `SELECT * FROM restaurants where id = ${detailID}`; 
    let response = await db.all(query, []);
    return { movies: response };
}

async function fetchRestaurantbyCountryName(cuisineName) {
    let query = `SELECT * FROM restaurants where cuisine = '${cuisineName}'`; 
    let response = await db.all(query, []);
    return { movies: response };
}

async function filterRestaurantbyparams(isVeg, hasOutdoorSeating, isLuxury) {
    console.log(isVeg, hasOutdoorSeating, isLuxury);
    let query = `SELECT * FROM restaurants where isVeg = '${isVeg}' and hasOutdoorSeating = '${hasOutdoorSeating}' and isLuxury = '${isLuxury}'`; 
    let response = await db.all(query, []);
    return { movies: response };
}

async function getRestOrderRatingbydesc() {
    let query = `SELECT * FROM restaurants order by rating desc`; 
    let response = await db.all(query, []);
    return { movies: response };
}

async function getAlldishes() {
    let query = `SELECT * FROM dishes`; 
    let response = await db.all(query, []);
    return { movies: response };
}

async function fetchDishByID(dishID) {
    let query = `SELECT * FROM dishes where id = ${dishID}`; 
    let response = await db.all(query, []);
    return { movies: response };
}

async function fewtchAllDish() {
    let query = `SELECT * FROM dishes order by price asc`; 
    let response = await db.all(query, []);
    return { movies: response };
}

app.get("/restaurants", async (req, res) => { 
    let results = await fetchAllRestaurants();
    res.status(200).json(results);
});

// /restaurants/details/1
app.get("/restaurants/details/:id", async (req, res) => { 
    let detailID = parseInt(req.params.id);
    let results = await fetchRestaurantbyID(detailID);
    res.status(200).json(results);
});

// /restaurants/cuisine/Indian
app.get("/restaurants/cuisine/:cuisineName", async (req, res) => { 
    let cuisineName = String(req.params.cuisineName);
    let results = await fetchRestaurantbyCountryName(cuisineName);
    res.status(200).json(results);
});

// /restaurants/filter?isVeg=true&hasOutdoorSeating=true&isLuxury=false
app.get("/restaurants/filter", async (req, res) => { 
    let isVeg = String(req.query.isVeg).toLowerCase();
    let hasOutdoorSeating = String(req.query.hasOutdoorSeating).toLowerCase();
    let isLuxury = String(req.query.isLuxury).toLowerCase();
    let results = await filterRestaurantbyparams(isVeg, hasOutdoorSeating, isLuxury);
    res.status(200).json(results);
});

// /restaurants/sort-by-rating
app.get("/restaurants/sort-by-rating", async (req, res) => { 
    let results = await getRestOrderRatingbydesc();
    res.status(200).json(results);
});

// /dishes
app.get("/dishes", async (req, res) => { 
    let results = await getAlldishes();
    res.status(200).json(results);
});

// /dishes/details/1
app.get("/dishes/details/:dish_id", async (req, res) => { 
    let dish_id = parseInt(req.params.dish_id);
    let results = await fetchDishByID(dish_id);
    res.status(200).json(results);
});


// /dishes/sort-by-price
app.get("/dishes/sort-by-price", async (req, res) => { 
    let results = await fewtchAllDish();
    res.status(200).json(results);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
