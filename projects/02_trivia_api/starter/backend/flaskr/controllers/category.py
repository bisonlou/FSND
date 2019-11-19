from flaskr import app
from flask import jsonify, abort
from flaskr.models.category import Category
from flaskr.models.question import Question

@app.route('/api/v1/categories')
def category_listing():
    categories = Category.query.all()

    return jsonify({
        'success': True,
        'categories': [category.format() for category in categories]
    }), 200

@app.route('/api/v1/categories/<int:category_id>/questions')
def category_questions(category_id):
    category_questions = Question.query.filter(Question.category_id==category_id).all()

    if not category_questions:
        abort(404)

    return jsonify({
        'success': True,
        'questions': [question.format() for question in category_questions]
    }), 200