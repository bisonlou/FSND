import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from flaskr import app
from flaskr.models import setup_db, db
from flaskr.models.category import Category
from flaskr.models.question import Question


class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """
        Define test variables and initialize app.
        Create two test questions and two categories
        """

        self.app = app
        self.client = self.app.test_client
        self.database_path = os.environ.get('URI_TEST')
        setup_db(self.app, self.database_path)


        self.sports_category = Category(type="sports")
        self.science_category = Category(type="science")

        db.session.add(self.sports_category)
        db.session.add(self.science_category)
        db.session.commit()

        self.sports_question = Question(question="Who is the GOAT of footbal",
                                        answer="Messi", difficulty=2, category_id=self.sports_category.id)
        self.science_question = Question(question="Who invented peniciline",
                                         answer="Fleming", difficulty=2, category_id=self.science_category.id)

        db.session.add(self.sports_question)
        db.session.add(self.science_question)
        db.session.commit()

    def tearDown(self):
        """Executed after reach test"""
        db.session.remove()
        db.drop_all()

    def test_retrieve_questions(self):
        """
        Test the successful retrieval of questions
        Expect 200
        """

        response = self.client().get('/api/v1/questions?page=1')
        message = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(message['questions']), 2)
        self.assertTrue(message['success'])

    def test_retrieve_category_questions(self):
        """
        Test the successful retrieval of one questions
        from a given category
        Expect 200
        """

        response = self.client().get('/api/v1/categories/' +
                                     str(self.sports_category.id) + '/questions')
        message = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(message['questions']), 1)

    def test_get_non_existent_category(self):
        """
        Test the unsuccessful retrieval of category questions
        because the specified category id does not exixt
        Expect 200
        """

        response = self.client().get('/api/v1/categories/0/questions')
        message = response.get_json()

        self.assertEqual(response.status_code, 404)
        self.assertFalse(message['success'])
        self.assertEqual(message['message'], 'resource not found')

    def test_retrieve_categories(self):
        """
        Test the successful retrieval of categories
        Expect 200
        """

        response = self.client().get('/api/v1/categories')
        message = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(message['categories']), 2)

    def test_delete_question(self):
        """
        Test the successful deletion of questions
        Expect 200
        """

        self.client().delete('/api/v1/questions/' + str(self.science_question.id))
        response = self.client().get('/api/v1/questions')
        message = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(message['questions']), 1)

    def test_delete_non_existent_question(self):
        """
        Test the unsuccessful deletion of a question
        because the specified question id doesn't exist
        Expect 404
        """

        response = self.client().delete('/api/v1/questions/0')
        self.assertEqual(response.status_code, 404)

    def test_posting_question(self):
        """
        Test the successful posting of a question
        Expect 200
        """

        body = {
            'question': 'What I am doing',
            'answer': 'testing',
            'category': self.sports_category.id,
            'difficulty': 1
        }
        response = self.client().post(
            'api/v1/questions',
            content_type='application/json',
            data=json.dumps(body)
        )

        message = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(message['success'])
        self.assertEqual(message['message'], 'question successfuly added')

    def test_question_search(self):
        """
        Test the successful search of a question
        Expect 200
        """

        body = {
            'searchTerm': 'GOAT',
        }
        response = self.client().post(
            'api/v1/questions',
            content_type='application/json',
            data=json.dumps(body)
        )

        message = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(message['totalQuestions'], 1)
        self.assertEqual(message['questions'][0]
                         ['id'], self.sports_question.id)

    def test_quiz(self):
        """
        Test the successful return of a quiz question
        Expect 200
        """

        body = {
            'previous_questions': [],
            'quiz_category': {'type': self.sports_category.type, 'id': self.sports_category.id},
            'difficulty': 5
        }
        response = self.client().post(
            '/api/v1/quizzes',
            content_type='application/json',
            data=json.dumps(body)
        )

        message = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(message['success'])
        self.assertTrue(message['question'])

    def test_quiz_with_all_categories_selected(self):
        """
        Test the successful return of questions
        even when no category is specified
        Expect 200
        """

        body = {
            'previous_questions': [self.sports_category.id],
            'quiz_category': {'type': 'ALL', 'id': 0},
            'difficulty': 5
        }
        response = self.client().post(
            '/api/v1/quizzes',
            content_type='application/json',
            data=json.dumps(body)
        )

        message = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(message['success'])
        self.assertTrue(message['question'])

    def test_quiz_with_no_more_questions(self):
        """
        Test the successful return of no question
        because the there are no more questions to randomly
        choose from
        Expect 200
        """
        body = {
            'previous_questions': [self.sports_category.id],
            'quiz_category': {'type': self.sports_category.type, 'id': self.sports_category.id},
            'difficulty': 5
        }
        response = self.client().post(
            '/api/v1/quizzes',
            content_type='application/json',
            data=json.dumps(body)
        )

        message = response.get_json()

        self.assertEqual(response.status_code, 200)
        self.assertTrue(message['success'])


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
