from os import environ
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

database_path = environ.get('URI')

db = SQLAlchemy()

'''
setup_db(app)
    binds a flask application and a SQLAlchemy service
'''
def setup_db(app, database_path=database_path):
    app.config["SQLALCHEMY_DATABASE_URI"] = database_path
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.app = app
    
    migrate = Migrate(app, db)