import React, { Component } from 'react'

import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

class Search extends Component {
  state = {
    query: '',
  }

  getInfo = (event) => {
    event.preventDefault();
    this.props.submitSearch(this.state.query)
  }

  handleInputChange = (event) => {
    const { value } = event.target;

    this.setState({
      query: value
    })
  }

  render() {
    const { classes } = this.props

    return (
      <Paper component="form" className={classes.questionSearch}>
        <InputBase
          className={classes.input}
          placeholder="Search Questions"
          inputProps={{ 'aria-label': 'search questions' }}
          onChange={this.handleInputChange}
        />
        <IconButton
          type="submit"
          className={classes.iconButton}
          aria-label="search"
          onClick={this.getInfo} 
        >
          <SearchIcon/>
        </IconButton>
      </Paper>
    )
  }
}

export default Search
