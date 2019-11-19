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
    }), 422

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({
        'success': False,
        'message': 'method not allowed'
    }), 405

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'message': 'internal server error'
    }), 500
