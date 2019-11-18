from flaskr import app
from flask import jsonify

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'resource not found'
    }), 404

@app.errorhandler(400)
def bad_requests(error):
    return jsonify({
        'success': False,
        'message': 'bad request'
    }), 400

@app.errorhandler(422)
def unprocessable(error):
    return jsonify({
        'success': False,
        'message': 'unable to process request'
    })
