const mongoose = require('mongoose');

// Define the category schema
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    }
});

// Create the Category model based on the schema
const Category = mongoose.model('Category', categorySchema);

// Export the Category model
module.exports = Category;
