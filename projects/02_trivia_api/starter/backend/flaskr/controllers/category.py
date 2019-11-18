from flaskr import app
from flask import jsonify
from flaskr.models.category import Category

@app.route('/categories')
def category_listing():
    categories = Category.query.all()

    return jsonify({
        'succcess': True,
        'categories': [category.format() for category in categories]
    })