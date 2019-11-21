import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Typography, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

import '../stylesheets/App.css';
import questionViewStyles from '../stylesheets/questionView'
import Question from './Question';
import Header from './Header'
import Search from './Search';
import FormView from './FormView'
import QuizView from './QuizView'
import $ from 'jquery';
import { BASE_URL } from './utility'

class QuestionView extends Component {
  constructor() {
    super();
    this.state = {
      questions: [],
      page: 1,
      totalQuestions: 0,
      categories: [],
      currentCategory: null,
      showAddForm: false,
      showQuiz: false,
    }
  }

  componentDidMount() {
    this.getQuestions();
  }

  toggleShowAddForm = () => {
    this.setState(({ showAddForm }) => (
      {
        showAddForm: !showAddForm,
        showQuiz: false
      }
    ));
  }

  togglePlayQuiz = () => {
    this.setState(({ showQuiz }) => (
      {
        showQuiz: !showQuiz,
        showAddForm: false
      }
    ))
  }

  getQuestions = () => {
    $.ajax({
      url: `${BASE_URL}/questions?page=${this.state.page}`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          categories: result.categories,
        })
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again')
        return;
      }
    })
  }

  selectPage(num) {
    this.setState({ page: num }, () => this.getQuestions());
  }

  createPagination() {
    let pageNumbers = [];
    let maxPage = Math.ceil(this.state.totalQuestions / 10)
    for (let i = 1; i <= maxPage; i++) {
      pageNumbers.push(
        <span
          key={i}
          className={`page-num ${i === this.state.page ? 'active' : ''}`}
          onClick={() => { this.selectPage(i) }}>{i}
        </span>)
    }
    return pageNumbers;
  }

  getByCategory = (id) => {
    $.ajax({
      url: `${BASE_URL}/categories/${id}/questions`, //TODO: update request URL
      type: "GET",
      success: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions,
          currentCategory: id
        })
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again')
        return;
      }
    })
  }

  submitSearch = (searchTerm) => {
    $.ajax({
      url: `${BASE_URL}/questions`, //TODO: update request URL
      type: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({ searchTerm: searchTerm }),
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: (result) => {
        this.setState({
          questions: result.questions,
          totalQuestions: result.total_questions
        })
        return;
      },
      error: (error) => {
        alert('Unable to load questions. Please try your request again')
        return;
      }
    })
  }

  questionAction = (id) => (action) => {
    if (action === 'DELETE') {
      if (window.confirm('are you sure you want to delete the question?')) {
        $.ajax({
          url: `${BASE_URL}/questions/${id}`, //TODO: update request URL
          type: "DELETE",
          success: (result) => {
            this.getQuestions();
          },
          error: (error) => {
            alert('Unable to load questions. Please try your request again')
            return;
          }
        })
      }
    }
  }

  render() {
    const { classes } = this.props;
    const { showAddForm, showQuiz, categories } = this.state;
    return (
      <div>
        <Header
          onAddClick={this.toggleShowAddForm}
          onPlayClick={this.togglePlayQuiz}
        />
        <div className="question-view">
          <div>
            <List
              className={classes.categoryList}
              component="nav">
              {this.state.categories.map(category => (
                <ListItem button onClick={() => this.getByCategory(category.id)}>
                  <ListItemIcon>
                    <img className="category" src={`${category.type}.svg`} />
                  </ListItemIcon>
                  <ListItemText primary={category.type} />
                </ListItem>
              ))}
            </List>

            <Search
              submitSearch={this.submitSearch}
              classes={classes}
            />

          </div>
          <div className="questions-list">
            <Typography variant="h4">Questions</Typography>
            {this.state.questions.map(q => (
              <Question
                key={q.id}
                question={q.question}
                answer={q.answer}
                category={this.state.categories.filter(cat => cat.id === q.category_id)}
                difficulty={q.difficulty}
                questionAction={this.questionAction(q.id)}
              />
            ))}
            <div className="pagination-menu">
              {this.createPagination()}
            </div>
          </div>
          <FormView
            open={showAddForm}
            toggleShowAddForm={this.toggleShowAddForm}
          />

          <QuizView
            open={showQuiz}
            categories={categories}
            toggleShowQuiz={this.togglePlayQuiz}
          />
        </div>
      </div >
    );
  }
}

export default withStyles(questionViewStyles)(QuestionView);
