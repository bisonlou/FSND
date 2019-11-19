from flaskr.models import db

'''
Category

'''
class Category(db.Model):  
  __tablename__ = 'categories'

  id = db.Column(db.Integer, primary_key=True)
  type = db.Column(db.String)
  questions = db.relationship('Question', backref='category')

  def __init__(self, type):
    self.type = type

  def format(self):
    return {
      'id': self.id,
      'type': self.type
    }