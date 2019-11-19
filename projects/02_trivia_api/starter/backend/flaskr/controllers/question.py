import sys
import random
from flaskr import app
from sqlalchemy import and_
from flask import jsonify, request, abort
from flaskr.utilities import Utility
from flaskr.models.question import Question
from flaskr.models.category import Category


@app.route('/api/v1/questions')
def question_listing():
    """
    Endpoint for listing all questions
    The questions will be paginated in groupings of 10
    The endpoint also returns a list of all categories
    """

    questions = Question.query.all()
    categories = Category.query.all()

    utility = Utility()
    paginated_questions = utility.paginate_questions(
        request=request, selection=questions)

    formated_categories = [category.format() for category in categories]

    return jsonify({
        'success': True,
        'questions': paginated_questions,
        'total_questions': len(questions),
        'categories': formated_categories
    }), 200


@app.route('/api/v1/questions/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    """
    Endpoint for deleting a specified question
    """

    question = Question.query.get(question_id)

    if not question:
        abort(404)

    try:
        question.delete()
        return jsonify({
            'success': True,
            'message': 'question successfuly deleted'
        }), 200
    except:
        abort(400)


@app.route('/api/v1/questions', methods=['POST'])
def create_question():
    """
    Endpoint for adding a question.
    The endpoint will instead seach for questions
    if a searchTerm is specified int the request body
    """

    if not request.json:
        abort(400)

    question = request.json.get('question', None)
    answer = request.json.get('answer', None)
    category = request.json.get('category', None)
    difficulty = request.json.get('difficulty', None)
    searchTerm = request.json.get('searchTerm', None)

    if searchTerm:
        questions = Question.query.filter(
            Question.question.ilike("%{}%".format(searchTerm))).all()

        formated_questions = [question.format() for question in questions]

        return jsonify({
            'questions': formated_questions,
            'totalQuestions': len(questions)
        })

    if question and answer and category and difficulty:
        question = Question(
            question=question,
            answer=answer,
            category_id=category,
            difficulty=difficulty
        )
    else:
        abort(400)

    try:
        question.insert()
        return jsonify({
            'success': True,
            'message': 'question successfuly added'
        }), 200
    except:
        print(sys.exc_info())
        abort(422)


@app.route('/api/v1/quizzes', methods=['POST'])
def quiz():
    """
    Endpoint for getting a random question from the provided category.
    The endpoint will return a random question from a random category if
    the type of 'ALL' is specified in the quiz_category dictionary
    """

    previous_questions = request.json.get('previous_questions', None)
    quiz_category = request.json.get('quiz_category', None)

    if previous_questions is not None and quiz_category is not None:
        questions = []

        if quiz_category['type'] == 'ALL':
            questions = Question.query.filter(
                Question.id.notin_(previous_questions)
            ).all()
        else:
            questions = Question.query.filter(and_(
                Question.id.notin_(previous_questions),
                Question.category_id == quiz_category['id']
            )).all()

        if len(questions) > 0:
            formated_questions = [question.format() for question in questions]
            quiz_question = random.choice(formated_questions)

            return jsonify({
                'success': True,
                'question': quiz_question
            })
        return jsonify({
            'success': True
        })
    else:
        abort(400)
