import React, { Component } from 'react';
import {
  Paper, Typography, Grid, TextField, Modal, List,
  ListItemIcon, ListItemText, Select, Button, ListItem, withStyles, IconButton
} from '@material-ui/core';
import { DoneAll, ClearOutlined, DoneOutline } from '@material-ui/icons';
import $ from 'jquery';

import formViewStyles from '../stylesheets/formView';
import { BASE_URL } from './utility';

const questionsPerPlay = 5;

class QuizView extends Component {
  constructor(props) {
    super();
    this.state = {
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      forceEnd: false,
      isSubmitDisabled: true,
    }
  }

  selectCategory = ({ type, id = 0 }) => {
    this.setState({ quizCategory: { type, id } }, () => this.getNextQuestion())
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () => this.activateSubimt())
  }

  activateSubimt = () => {
    const { question, answer } = this.state;
    if (question !== "" && answer !== "") {
      this.setState({ isSubmitDisabled: false })
    } else {
      this.setState({ isSubmitDisabled: true })
    }
  }

  getNextQuestion = () => {
    const previousQuestions = [...this.state.previousQuestions]
    if (this.state.currentQuestion.id) { previousQuestions.push(this.state.currentQuestion.id) }

    $.ajax({
      url: `${BASE_URL}/quizzes`, //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        previous_questions: previousQuestions,
        quiz_category: this.state.quizCategory
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        this.setState({
          showAnswer: false,
          previousQuestions: previousQuestions,
          currentQuestion: result.question,
          guess: '',
          forceEnd: result.question ? false : true
        })
        return;
      },
      error: (error) => {
        alert('Unable to load question. Please try your request again')
        return;
      }
    })
  }

  submitGuess = (event) => {
    event.preventDefault();
    const formatGuess = this.state.guess.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase()
    let evaluate = this.evaluateAnswer()
    this.setState({
      numCorrect: !evaluate ? this.state.numCorrect : this.state.numCorrect + 1,
      showAnswer: true,
    })
  }

  restartGame = () => {
    this.setState({
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      forceEnd: false
    })
  }

  closeForm = () => {
    this.props.toggleShowQuiz()
    this.setState({
      quizCategory: null,
      previousQuestions: [],
      showAnswer: false,
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      forceEnd: false,
      isSubmitDisabled: true,
     })
  }

  renderPrePlay() {
    const { open, classes, categories } = this.props;

    return (
      <Modal
        className={classes.popper}
        open={open}
      >
        <Paper className={classes.modalContainer}>
          <List
            component="nav"
          >
            <ListItem button onClick={() => this.selectCategory({ 'type': 'ALL', 'id': 0 })}>
              <ListItemIcon>
                <DoneAll />
              </ListItemIcon>
              <ListItemText primary={"ALL"} />
            </ListItem>
            {categories.map(category => (
              <ListItem button onClick={() => this.selectCategory(category)}>
                <ListItemIcon>
                  <img className="category" src={`${category.type}.svg`} />
                </ListItemIcon>
                <ListItemText primary={category.type} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Modal>
    )
  }

  renderFinalScore() {
    const { open, classes } = this.props;

    return (
      <Modal
        disableAutoFocus={true}
        className={classes.popper}
        open={open}
      >
        <Paper className={classes.modalContainer}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" className={classes.header}>Your Final Score is {this.state.numCorrect}</Typography>
            </Grid>


            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                justify="flex-end"
                alignItems="center"
              >
                <Grid
                  item
                  xs={6}
                >
                </Grid>

                <Grid
                  item
                  xs={6}
                >
                  <Button
                    className={classes.cancelButton}
                    variant="contained"
                    color="default"
                    onClick={this.closeForm}
                  >
                    Quit
                     </Button>

                  <Button
                    className={classes.submitButton}
                    variant="contained"
                    color="primary"
                    onClick={this.restartGame}
                  >
                    Re-play
                     </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    )
  }

  evaluateAnswer = () => {
    const formatGuess = this.state.guess.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase()
    const answerArray = this.state.currentQuestion.answer.toLowerCase().split(' ');
    return answerArray.includes(formatGuess)
  }

  renderCorrectAnswer() {
    const { open, classes } = this.props;
    let evaluate = this.evaluateAnswer()

    return (
      <Modal
        disableAutoFocus={true}
        className={classes.popper}
        open={open}
      >
        <Paper className={classes.modalContainer}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" className={classes.header}>{this.state.currentQuestion.question}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="h6" className={classes.answer}>{this.state.currentQuestion.answer}</Typography>
            </Grid>

            <Grid item xs={6} style={{ marginTop: -10 }}>
              {
                evaluate ? <DoneOutline className={classes.success} /> : <ClearOutlined className={classes.fail} />
              }
            </Grid>


            <Grid item xs={12}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Button
                  className={classes.submitButton}
                  variant="contained"
                  color="primary"
                  onClick={this.getNextQuestion}
                >
                  Next
              </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    )
  }

  renderPlay() {
    const { open, classes } = this.props;
    const { isSubmitDisabled, forceEnd, previousQuestions, showAnswer, currentQuestion } = this.state;

    return previousQuestions.length === questionsPerPlay || forceEnd
      ? this.renderFinalScore()
      : showAnswer
        ? this.renderCorrectAnswer()
        : (
          <Modal
            disableAutoFocus={true}
            className={classes.popper}
            open={open}
          >
            <Paper className={classes.modalContainer}>
              <Typography variant="h6" className={classes.header}>{currentQuestion.question}</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    className={classes.input}
                    label="Guess"
                    name="guess"
                    type="text"
                    onChange={this.handleChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Grid
                    container
                    direction="row"
                    justify="flex-end"
                    alignItems="center"
                  >
                    <Grid
                      item
                      xs={6}
                    >

                    </Grid>
                    <Grid
                      item
                      xs={6}
                    >
                      <Button
                        className={classes.cancelButton}
                        variant="contained"
                        color="default"
                        onClick={this.closeForm}
                      >
                        Quit
                     </Button>

                      <Button
                        className={classes.submitButton}
                        variant="contained"
                        color="primary"
                        disabled={isSubmitDisabled}
                        onClick={this.submitGuess}
                      >
                        Guess
                     </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper >
          </Modal>
        )
  }


  render() {
    return this.state.quizCategory
      ? this.renderPlay()
      : this.renderPrePlay()
  }
}

export default withStyles(formViewStyles)(QuizView);
