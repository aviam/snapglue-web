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
// const gateway = 'undefined' !== process ? process.env.REACT_APP_GATEWAY_SERVER : null

class MyApis extends React.Component {
  // static getInitialProps () {
  //   return { gateway }
  // }
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      services: [],
      userResponse: {},
      basePath: '',
      host: [],
      primary: false,
      paths: [],
      apiResponse: [],
      activeTab: 1,
      accordion: [true, false, false, false, false],
      margeApis: [],
      userApis: [],
    };
  }

  componentWillMount() {
    axios.get(`http://${process.env.REACT_APP_GATEWAY_SERVER}:4000/api/userapis`).then((response) => {
      this.setState({userApis: response.data});
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


  selectService(service) {
    this.setState({ service });
    const swagger = JSON.parse(service.data.swagger);
    this.setState({paths: _.keys(swagger.paths), basePath: swagger.basePath, host: swagger.host});
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  save() {
    axios.post(`http://${process.env.REACT_APP_GATEWAY_SERVER}:4000/api/userapis`, {services_apis: this.state.margeApis, name: this.state.apiName}).then((response) => {
      console.log(response);
      this.togglePrimary();
    }).catch((error) => { throw error; });
  }



  handleCheck(service, path) {
    const {margeApis} = this.state;
    const indexApi = _.findIndex(margeApis, (o) =>  o.id === service.id );
    if (indexApi === -1) {
      const swagger = JSON.parse(service.data.swagger);

      margeApis.push({apis: [path], base: `${swagger.host}${swagger.basePath}`});
    } else {
      margeApis[indexApi].apis.push(path);
    }
    this.setState({ margeApis });
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
    const {services, paths, apiResponse, userApis, primary, apiName} = this.state;
    return (
      <div>
        <Row className="margin-bottom-30">
          <Col xs="12" sm="6" md="4">
            <Button color="primary" onClick={this.togglePrimary} className="mr-1">Create new Api</Button>
          </Col>
        </Row>
        <Modal isOpen={this.state.primary} toggle={this.togglePrimary} className={' modal-lg ' + this.props.className}>
          <ModalHeader toggle={this.togglePrimary}>Create new api</ModalHeader>
          <ModalBody>
            <Row>
              <Col xs="12">
                <FormGroup>
                  <Label htmlFor="name">Api Name</Label>
                  <Input type="text" id="api-name" name="apiName" placeholder="Enter your api name" required value={this.state.apiName} onChange={this.handleChange}/>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xl="12">

                <h6 className="margin-bottom-30">Select Merged Urls</h6>
                    <div id="accordion">
                      {services.map((service, index) => {
                        const swagger = JSON.parse(service.data.swagger);
                        const paths = _.keys(swagger.paths);
                        return(
                          <Card key={`ser-${service.data.name}-${index}`}>
                            <CardHeader id="headingOne">
                              <Button block color="link" className="text-left m-0 p-0" onClick={() => this.toggleAccordion(index)} aria-expanded={this.state.accordion[index]} aria-controls="collapseOne">
                                <h5 className="m-0 p-0">{service.data.name}</h5>
                              </Button>
                            </CardHeader>
                            <Collapse isOpen={this.state.accordion[index]} data-parent="#accordion" id="collapseOne" aria-labelledby="headingOne">
                              <CardBody>
                                {paths.map((path, index) => {
                                  return (
                                    <FormGroup key={`${service.data.name.replace(' ', '_')}-${index}`} check className="checkbox">
                                      <Input className="form-check-input" type="checkbox" id={`${service.data.name.replace(' ', '_')}-${index}`}
                                             onClick={this.handleCheck.bind(this, service, path)}/>
                                      <Label check className="form-check-label" htmlFor={`${service.data.name}-${index}`} >{path}</Label>
                                    </FormGroup>

                                  );
                                })}
                              </CardBody>
                            </Collapse>
                          </Card>
                        );
                      })}
                    </div>
                  {/*</CardBody>*/}
                {/*</Card>*/}
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.save}>save</Button>{' '}
            <Button color="secondary" onClick={this.togglePrimary}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <Row>
          {userApis.length > 0 && userApis.map((u) => {
            return (
              <Col xs="12" sm="6" md="4">
                <Card>
                  <CardHeader>
                    {u.name}
                    <div className="card-header-actions">
                      {/*<a className="card-header-action btn btn-close" onClick={this.edit.bind(this, u)}><i className="icon-pencil"/></a>*/}
                    </div>
                  </CardHeader>
                  <CardBody>{JSON.stringify(u.services_apis)}</CardBody>
                  <CardFooter><div color="primary" onClick={this.execute.bind(this,u.name)}>execute</div></CardFooter>
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

export default MyApis;
