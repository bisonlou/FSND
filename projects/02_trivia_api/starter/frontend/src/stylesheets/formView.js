import { green } from "@material-ui/core/colors";
import { ArrowRight } from "@material-ui/icons";

const formViewStyles = {
  
  popper: {
    width: 600,
    padding: 30,
    marginTop: 70,
    marginLeft: 500,
  },

  modalContainer: {
    outline: 'none',
  },

  header: {
    paddingTop: 20,
    marginLeft: 30,
  },

  success: {
    paddingTop: 20,
    marginLeft: 30,
    color: 'green',
  },

  fail: {
    paddingTop: 20,
    marginLeft: 30,
    color: 'red',
  },

  answer: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 30,
    float: 'right',
  },
  
  input: {
    width: 500,
    marginLeft: 30,
  },

  difficulty: {
    width: 220,
    marginLeft: 30,
  },

  category: {
    width: 220,
    marginLeft: 10,
  },

  cancelButton: {
    width: 100,
  },

  submitButton: {
    width: 100,
    marginLeft: 30,
  },
}

export default formViewStyles;
