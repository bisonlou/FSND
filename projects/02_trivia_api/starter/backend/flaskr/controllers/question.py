from flaskr import app
from flask import jsonify
from flaskr.models.question import Question

@app.route('/questions')
def question_listing():
    questions = Question.query.all()

    return jsonify({
        'succcess': True,
        'questions': [question.format() for question in questions]
    })
