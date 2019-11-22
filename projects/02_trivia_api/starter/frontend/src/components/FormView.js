import React, { Component } from 'react';
import {
  Paper, Typography, Grid, TextField, Modal,
  FormControl, InputLabel, Select, Button, MenuItem, withStyles
} from '@material-ui/core';
import { BASE_URL } from '../utility';
import $ from 'jquery';

import '../stylesheets/formView.js';
import formViewStyles from '../stylesheets/formView.js';

class FormView extends Component {
  constructor(props) {
    super();
    this.state = {
      question: "",
      answer: "",
      difficulty: 1,
      category: 1,
      categories: [],
      isSubmitDisabled: true,
    }
  }

  componentDidMount() {
        $.ajax({
      url: `${BASE_URL}/categories`,
      type: "GET",
      success: (result) => {
        this.setState({ categories: result.categories })
        return;
      },
      error: (error) => {
        alert('Unable to load categories. Please try your request again')
        return;
      }
    })
  }


  submitQuestion = (event) => {
    event.preventDefault();
    $.ajax({
      url: `${BASE_URL}/questions`,
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        question: this.state.question,
        answer: this.state.answer,
        difficulty: this.state.difficulty,
        category: this.state.category
      }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        this.props.toggleShowAddForm()
        this.setState({ answer: "", question: "", isSubmitDisabled: true})
        return;
      },
      error: (error) => {
        alert('Unable to add question. Please try your request again')
        return;
      }
    })
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () => this.activateSubimt())
  }

  activateSubimt = () => {
    const { question, answer } = this.state;
    if ( question !== "" && answer !== "") {
      this.setState({ isSubmitDisabled: false })
    } else {
      this.setState({ isSubmitDisabled: true })
    }
  }

  closeForm = () => {
    this.props.toggleShowAddForm()
    this.setState({ answer: "", question: "", isSubmitDisabled: true})
  }

  render() {
    const { open, classes } = this.props;
    const { difficulty, category, isSubmitDisabled } = this.state;

    return (
      <Modal
        disableAutoFocus={true}
        className={classes.popper}
        open={open}
      >
        <Paper className={classes.modalContainer}>
          <Typography variant="h6" className={classes.header}>Add a New Trivia Question</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                className={classes.input}
                label="Question"
                name="question"
                type="text"
                onChange={this.handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                className={classes.input}
                label="Answer"
                type="text"
                name="answer"
                onChange={this.handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl
                className={classes.difficulty}
              >
                <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
                <Select
                  name="difficulty"
                  value={difficulty}
                  onChange={this.handleChange}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl
                className={classes.category}
              >
                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                <Select
                  name="category"
                  value={category}
                  onChange={this.handleChange}
                >
                  {this.state.categories.map(category => (
                    <MenuItem
                      key={category.id}
                      value={category.id}
                    >
                      {category.type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                    Cancel
                  </Button>

                  <Button
                    className={classes.submitButton}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitDisabled}
                    onClick={this.submitQuestion}
                  >
                    Add
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper >
      </Modal>
    );
  }
}

export default withStyles(formViewStyles)(FormView);
