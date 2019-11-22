import React, { Component } from 'react';
import {
  Paper, Typography, Grid, TextField, Modal, List,
  ListItemIcon, ListItemText, Button, ListItem, withStyles, Slider
} from '@material-ui/core';
import { DoneAll, ClearOutlined, DoneOutline } from '@material-ui/icons';
import $ from 'jquery';

import formViewStyles from '../stylesheets/formView';
import { BASE_URL } from '../utility';



class QuizView extends Component {
  constructor(props) {
    super();
    this.state = {
      quizCategory: null,
      difficulty: 3,
      questionsPerPlay: 5,
      previousQuestions: [],
      showAnswer: false,
      numCorrect: 0,
      currentQuestion: {},
      guess: '',
      forceEnd: false,
      isSubmitDisabled: true,
    }
  }

  handleSliderChange = (_, value) => {
    this.setState({ difficulty: value });
  }

  handleQuestionNumberChange = ({ target: { value } }) => {
    if (value < 5) value = 5;
    if (value > 20) value = 20;
    
    this.setState({ questionsPerPlay: parseInt(value) });
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
      url: `${BASE_URL}/quizzes`,
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        previous_questions: previousQuestions,
        quiz_category: this.state.quizCategory,
        difficulty: this.state.difficulty,
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
    const { questionsPerPlay } = this.state;

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
              <ListItem
                key={category.id}
                button
                onClick={() => this.selectCategory(category)}
              >
                <ListItemIcon>
                  <img className="category" alt="category" src={`${category.type}.svg`} />
                </ListItemIcon>
                <ListItemText primary={category.type} />
              </ListItem>
            ))}
          </List>

          <Grid
            container
            spacing={3}
            className={classes.slider}
            justify="center"
          >
            <Grid item xs={12}>
              <Typography id="discrete-slider-always" gutterBottom>
                Difficulty
              </Typography>
              <Slider
                defaultValue={3}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={5}
                onChangeCommitted={(event, value) => this.handleSliderChange(event, value)}
              />
            </Grid>

            <grid item xs={12}>
              <TextField
                id="outlined-number"
                label="Questions"
                type="number"
                inputProps={{ min: "5", max: "20", step: "1" }}
                value={questionsPerPlay}
                onChange={this.handleQuestionNumberChange}
                margin="normal"
                variant="outlined"
              />
            </grid>

          </Grid>
        </Paper>
      </Modal>
    )
  }

  renderFinalScore() {
    const { open, classes } = this.props;
    const { numCorrect, questionsPerPlay } = this.state;
    const finalScore = (numCorrect * 100) / questionsPerPlay;

    return (
      <Modal
        disableAutoFocus={true}
        className={classes.popper}
        open={open}
      >
        <Paper className={classes.modalContainer}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h6" className={classes.header}>Your Final Score is {finalScore}%</Typography>
            </Grid>


            <Grid item xs={12}>
              <Grid
                container
                spacing={2}
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
    const { questionsPerPlay, forceEnd, previousQuestions, showAnswer, currentQuestion } = this.state;

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
    const { quizCategory } = this.state;
    return quizCategory
      ? this.renderPlay()
      : this.renderPrePlay()
  }
}

export default withStyles(formViewStyles)(QuizView);
