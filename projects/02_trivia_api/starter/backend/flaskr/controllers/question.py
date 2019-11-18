from flaskr import app
from flask import jsonify, request
from flaskr.utilities import Utility
from flaskr.models.question import Question
from flaskr.models.category import Category


@app.route('/api/v1/questions')
def question_listing():
    questions = Question.query.all()
    categories = Category.query.all()

    utility = Utility()
    paginated_questions = utility.paginate_questions(
        request=request, selection=questions)

    formated_categories = [category.format() for category in categories]

    return jsonify({
        'succcess': True,
        'questions': paginated_questions,
        'totalQuestions': len(questions),
        'categories': formated_categories,
        'current_category': 'null'
    }), 200
