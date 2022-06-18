import React from 'react';
import axios from 'axios';
import autoBind from 'react-autobind';
import _ from 'lodash';

import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  CardTitle,
  CardHeader,
  CardFooter,
  Badge,
  ListGroupItem,
  ListGroup,
  UncontrolledButtonDropdown,
  CardBody,
  Card,
  Table,
  TabPane,
  TabContent,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from 'reactstrap';
// const gateway = 'undefined' !== process ? process.env.REACT_APP_GATEWAY_SERVER : null
class Apis extends React.Component {
  // static getInitialProps () {
  //   return { gateway }
  // }
  constructor(props) {
    super(props);
    autoBind(this);

    this.state = {
      services: [],
      service: 'Select Service',
      basePath: '',
      host: [],
      paths: [],
      apiResponse: [],
      activeTab: 1,
    };
  }

  componentDidMount() {
    const services = [];
    axios.get(`http://${process.env.REACT_APP_GATEWAY_SERVER}:4000/api/services`).then((response) => {
      this.setState({services: response.data});
    }).catch((error) => { throw error; });

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

  executeApi(path) {
    axios.get(`http://${process.env.REACT_APP_GATEWAY_SERVER}:4000/middle/gate?host=${this.state.host}&basePath=${this.state.basePath}&path=${path}`)
      .then((response) => {
        this.setState({ apiResponse: response.data });
      }).catch((error) => { throw error; });
  }

  render() {
    const {services, paths, apiResponse, service} = this.state;
    return (
      <div>
        <Row>
          {/* selects */}
          <Col lg="12" md={12}>
            <Form>
              <FormGroup row>
                <Label md="4" for="simple-select">Service</Label>
                <Col md="8">
                  <UncontrolledButtonDropdown>
                    <DropdownToggle caret color="secondary" className="dropdown-toggle-split mr-xs w">{service.name ? service.name : 'Select Service'}</DropdownToggle>
                    <DropdownMenu md="12" sm="12" xl="12">
                      {services.map((service, index) => {
                        return (<DropdownItem key={index} onClick={this.selectService.bind(this, service.data)}>{service.data.name}</DropdownItem>)
                      })}
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                </Col>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col md="12">
            {paths.length > 0 &&
            <Card>
              <Col sm="5"><CardTitle className="mb-0 margin-top-15">Api Avaliable</CardTitle></Col>


                <CardBody>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Path</th>
                      <th></th>
                      <th>Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {paths.map((row, index) => {
                      return (
                        <tr key={index}>
                          <td>{row}</td>
                          <td></td>
                          <td className="">
                            <Button  className="btn-ghost-info .col-sm-3"  block color="dark" onClick={this.executeApi.bind(this, row)}>Exec</Button>
                          </td>
                        </tr>
                      )
                    })
                  }
                  </tbody>
                </Table>
                </CardBody>
            </Card>
            }
          </Col>
        </Row>
        <Row>
          {apiResponse.length > 0 &&
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <i className="fa fa-align-justify"></i><strong>Api Result List Group</strong>
                  <div className="card-header-actions">
                    <Badge>NEW</Badge>
                  </div>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xs="4">
                      <ListGroup id="list-tab" role="tablist">
                        {apiResponse.map((row, index) => {
                          return (
                            <ListGroupItem key={`${row.name}-item`} onClick={() => this.toggle(index)} action active={this.state.activeTab === index} >{row.name}</ListGroupItem>
                          );
                        } )}
                      </ListGroup>
                    </Col>
                    <Col xs="8">
                      <TabContent activeTab={this.state.activeTab}>
                        {apiResponse.map((row, index) => {
                          return (
                            <TabPane key={`${index}-pane`} tabId={index} >
                              <p>
                                {Object.keys(row).map((key) => {
                                  return <div>{`${key}: ${row[key]}`}</div>
                                })}
                              </p>
                            </TabPane>
                          );
                        })}
                      </TabContent>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          }
        </Row>
      </div>
    );
  }
}

export default Apis;
