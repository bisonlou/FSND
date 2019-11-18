
class Utility():
    questions_per_page = 10

    def paginate_questions(self, request, selection):
        page = request.args.get('page', 1, type=int)
        start =  (page - 1) * self.questions_per_page
        end = start + self.questions_per_page

        questions = [question.format() for question in selection]
        current_questions = questions[start:end]

        return current_questions