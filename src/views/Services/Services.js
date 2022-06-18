import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Modal,
  ModalBody, ModalFooter, ModalHeader,
} from 'reactstrap';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';
import axios from 'axios';
// const gateway = 'undefined' !== process ? process.env.REACT_APP_GATEWAY_SERVER : null

const propTypes = {
  header: PropTypes.string,
  mainText: PropTypes.string,
  smallText: PropTypes.string,
  color: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  variant: PropTypes.string,
};

const defaultProps = {
  header: '89.9%',
  mainText: 'Lorem ipsum...',
  smallText: 'Lorem ipsum dolor sit amet enim.',
  // color: '',
  value: '25',
  variant: '',
};

class Services extends Component {
  // static getInitialProps () {
  //   return { gateway }
  // }
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      large: false,
      file: null,
      name: '',
      description: '',
      services: [],
      fileName: '',
    };
  }

  componentDidMount() {
    const {services} = this.state;

    axios.get(`http://${process.env.REACT_APP_GATEWAY_SERVER}:4000/api/services`).then((response) => {
      this.setState({services: response.data});
    }).catch((error) => { throw error; });

  }

  toggleLarge() {
    this.setState({large: !this.state.large});
  }

  submit() {

    axios.post(`http://${process.env.REACT_APP_GATEWAY_SERVER}:4000/api/services`, {
      name: this.state.name,
      description: this.state.description,
      swagger:  this.state.swagger,
      parentId: "tenants/g1zig4Hmg1WMvW9YQAjM",
    }).then((response) => {
        this.setState({ apiResponse: response.data });
        // console.log(response.data);
      }).catch((error) => { throw error; });


    this.setState({large: !this.state.large});
  }
  onChangeInputFiles(e) {
    const file = e.target.files[0];
    this.setState({file: e.target.files[0], fileName: e.target.files[0].name});
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt) => {
        this.setState({swagger: evt.target.result});
      }
      reader.onerror = (evt) => {console.log(evt)}
    }
  }
  handleChange(e) {
    if (e.target.name === 'name') {
      this.setState({name: e.target.value})
    } else {
      this.setState({description: e.target.value})
    }
  }

  isSubmitReady() {
    const { fileName, name } = this.state;
    return fileName !== '' && name != '';
  }

  edit(service) {
    debugger;
    this.setState({large: !this.state.large, name: service.name, description: service.description});

  }

  renderModal() {
    const submitReady = !this.isSubmitReady();
    return  (
      <Modal isOpen={this.state.large} toggle={this.toggleLarge} className={'modal-lg ' + this.props.className}>
        <ModalHeader toggle={this.toggleLarge}>New Service</ModalHeader>
        <ModalBody>
          <Row>
            <Col xs="12" md="5">
              <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                <FormGroup row>
                  <Col md="4"><Label htmlFor="text-input">Name</Label></Col>
                  <Col xs="12" md="8">
                    <Input type="text" id="text-input" name="name" placeholder="Name" value={this.state.name} onChange={this.handleChange}/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="4"><Label htmlFor="text-input">Description</Label></Col>
                  <Col xs="12" md="8">
                    <Input type="text" id="text-input" name="description" placeholder="Description" value={this.state.description} onChange={this.handleChange}/>
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="4"><Label htmlFor="file-input">Swagger Input</Label></Col>
                  <Col xs="12" md="8"><Input type="file" id="file-input" name="file-input" onChange={this.onChangeInputFiles} /></Col>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.submit} disabled={submitReady} >Submit</Button>{' '}
          <Button color="secondary" onClick={this.toggleLarge}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }

  render() {
    const { className, cssModule, mainText, smallText, color, value, children, variant, ...attributes } = this.props;
    const { services} = this.state;
    // demo purposes only
    const progress = { style: '', color: color, value: value };
    const card = { style: '', bgColor: '' };

    if (variant === 'inverse') {
      progress.style = 'progress-white';
      progress.color = '';
      card.style = 'text-white';
      card.bgColor = 'bg-' + color;
    }

    const classes = mapToCssModules(classNames(className, card.style, card.bgColor), cssModule);
    progress.style = classNames('progress-xs my-3', progress.style);

    return (
      <div>
        {this.renderModal()}
        <Row className="margin-bottom-30">
          <Col sm={{ size: 12}}  xl="3" md={{ size: 3, offset: 9 }}>
            <Button onClick={this.toggleLarge}  block color="primary">+ Create</Button>
          </Col>
        </Row>
        <Row/>
        <Row>
          {services.length > 0 && services.map((service) => {
            return (
              <Col xs="12" sm="6" md="4">
                <Card>
                  <CardHeader>
                    {service.data.name}
                    <div className="card-header-actions">
                      <a className="card-header-action btn btn-close" onClick={this.edit.bind(this, service)}><i className="icon-pencil"/></a>
                    </div>
                  </CardHeader>
                  <CardBody>{service.data.description}</CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}

Services.propTypes = propTypes;
Services.defaultProps = defaultProps;

export default Services;
