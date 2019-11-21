import React, { Component } from 'react';
import { Paper, Button, Typography, IconButton } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import DeleteIcon from '@material-ui/icons/Delete';
import '../stylesheets/Question.css';

class Question extends Component {
  constructor() {
    super();
    this.state = {
      visibleAnswer: false
    }
  }

  flipVisibility() {
    this.setState({ visibleAnswer: !this.state.visibleAnswer });
  }

  render() {
    const { question, answer, category, difficulty } = this.props;
    return (
      <Paper className="Question-holder">
        <Typography className="Question">{question}</Typography>
        <div className="Question-status">
          <img className="category" src={`${category[0].type}.svg`} />
          <Rating
            className="difficulty"
            name="simple-controlled"
            value={difficulty}
            disabled
          />
          <IconButton
            onClick={() => this.props.questionAction('DELETE')}
          >
            <DeleteIcon />
          </IconButton>
        </div>
        {!this.state.visibleAnswer && (
          <Button
            variant="contained"
            color="primary"
            className="show-answer button"
            onClick={() => this.flipVisibility()}
          >
            Answer
          </Button>
        )}

        <div className="answer-holder">
          <Typography style={{ "visibility": this.state.visibleAnswer ? 'visible' : 'hidden' }}>Answer: {answer}</Typography>
        </div>
      </Paper>
    );
  }
}

export default Question;
