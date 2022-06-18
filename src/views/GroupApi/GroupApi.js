import React from 'react';
import axios from 'axios';
import autoBind from 'react-autobind';
import _ from 'lodash';

import {
  Row,
  Col,
  Button,
  Collapse,
  FormGroup,
  Label,
  CardHeader,
  CardBody,
  CardFooter,
  Card,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
} from 'reactstrap';

class GroupApi extends React.Component {

  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      services: [],
      userResponse: {},
      primary: false,
      groupServices: [],
      groupsApi: [],
    };
  }

  componentWillMount() {
    axios.get(`http://${process.env.REACT_APP_GATEWAY_SERVER}:4000/api/divisions`).then((response) => {
      this.setState({groupsApi: response.data});
    }).catch((error) => { throw error; });

    const services = [];
    axios.get(`http://${process.env.REACT_APP_GATEWAY_SERVER}:4000/api/services`).then((response) => {
      this.setState({services: response.data, accordion: Array(response.data.length).fill(false)});
    }).catch((error) => { throw error; });
  }

  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index ? !x : false);

    this.setState({
      accordion: state,
    });
  }


  handleCheck(serviceName) {
    const {groupServices} = this.state;
    const i = groupServices.indexOf(serviceName);
    if (i !== -1) {
      groupServices.splice(i,1);
    } else {
      groupServices.push(serviceName);
    }
    this.setState({groupServices});
  }

  save() {
    axios.post(`http://${process.env.REACT_APP_GATEWAY_SERVER}:4000/api/divisions`, {services: this.state.groupServices, name: this.state.apiName}).then((response) => {
      console.log(response);
      this.togglePrimary();
    }).catch((error) => { throw error; });
  }

  togglePrimary() {
    this.setState({
      primary: !this.state.primary,
    });
  }

  handleChange(e) {
    if (e.target.name === 'apiName') {
      this.setState({apiName: e.target.value})
    } else {
      this.setState({description: e.target.value})
    }
  }

  execute(userApi) {
    axios.get(`http://${process.env.REACT_APP_GATEWAY_SERVER}:4000/middle/snapi/${userApi}`).then((response) => {
      this.setState({userResponse: response.data});
    }).catch((error) => { throw error; });
  }

  render() {
    const {services, groupsApi} = this.state;
    return (
      <div>
        <Row className="margin-bottom-30">
          <Col xs="12" sm="6" md="4">
            <Button color="primary" onClick={this.togglePrimary} className="mr-1">Create new Api Group</Button>
          </Col>
        </Row>
        <Modal isOpen={this.state.primary} toggle={this.togglePrimary} className={' modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.togglePrimary}>Create new group api</ModalHeader>
          <ModalBody>
            <Row>
              <Col xs="12">
                <FormGroup>
                  <Label htmlFor="name">Group Api Name</Label>
                  <Input type="text" id="api-name" name="apiName" placeholder="Enter your api name" required value={this.state.apiName} onChange={this.handleChange}/>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xl="12">

                <h6 className="margin-bottom-30">Select Services</h6>
                <div id="accordion">
                  {services.map((service, index) => {
                    return(
                      <FormGroup check className="checkbox" >
                        <Input className="form-check-input" type="checkbox" id={service.data} name={service.data.name}
                               value={service.data.name} onClick={this.handleCheck.bind(this, service.data.name)} />
                        <Label check className="form-check-label" htmlFor={service.data.name}>{service.data.name}</Label>
                      </FormGroup>
                    );
                  })}
                </div>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.save}>save</Button>{' '}
            <Button color="secondary" onClick={this.togglePrimary}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Row>
          {groupsApi.length > 0 && groupsApi.map((u) => {
            return (
              <Col xs="12" sm="6" md="4">
                <Card>
                  <CardHeader>
                    {u.name}
                    <div className="card-header-actions">
                      {/*<a className="card-header-action btn btn-close" onClick={this.edit.bind(this, u)}><i className="icon-pencil"/></a>*/}
                    </div>
                  </CardHeader>
                  <CardBody>{u.services.map((s) => {
                    return (<div>{s}</div>)
                  })}</CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>
        <Row>
          {JSON.stringify(this.state.userResponse)}
        </Row>
      </div>
    );
  }
}

export default GroupApi;
