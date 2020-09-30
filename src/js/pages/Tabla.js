import React from "react";
import { Table, Navbar, Form, Container, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faCartPlus } from '@fortawesome/free-solid-svg-icons'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import _ from 'lodash';

export default class Tabla extends React.Component {
    constructor(props)
      {
        super();
        this.state = {
          orders: [],
          newOrderItems : [],
          newSku : '',
          newName : '',
          newQuantity : '',
          newPrice : '',
          isLoaded: false
        }
      }
    
      componentDidMount() {
        fetch('https://eshop-deve.herokuapp.com/api/v2/orders', {
          method: 'GET',
          headers: new Headers({
            Authorization: `eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkM2NIVUVibVJoc1EzeXhNbzV2VnliSTFzaDZCSDJZRCIsImlhdCI6MTU4NTkzMjYzNDU0OH0.tMSht_M3ryQl5IqCirhYR1gb8j3FQ26vILT4Qpx4XrdFz-zUmqbgFYiKTaZHPpB85etRIMhxVoZf6tOrHy0fnA`,
          })
        })
          .then(response => response.json())
          .then(json => {
            this.setState({
              isLoaded : true,
              orders: json.orders,
            })
          })
      }

    onOrderRowClickHandler = (e) => {
        const hiddenElement = e.currentTarget.nextSibling;
        hiddenElement.className.indexOf("collapse show") > -1 ?
                hiddenElement.classList.remove("show") :
                hiddenElement.classList.add("show");
        
    };

    updateNewSku(evt) {
      this.setState({
        newSku : evt.target.value
      });
    }

    updateNewName(evt) {
      this.setState({
        newName : evt.target.value
      });
    }

    updateNewQuantity(evt) {
      this.setState({
        newQuantity : evt.target.value
      });
    }

    updateNewPrice(evt) {
      this.setState({
        newPrice : evt.target.value
      });
    }

    onNewItemClickHandler = (e) => {
      var newItem = {
        id: _.uniqueId('NUEVA_'),
        sku: this.state.newSku,
        name: this.state.newName,
        quantity : this.state.newQuantity,
        price : this.state.newPrice
      }
      
      this.setState(prevState => ({
        ...prevState,
        newOrderItems : [...prevState.newOrderItems, newItem]
      }));
    }

    onAddOrderClickHandler = (e) => {
      var newOrder = {
        id: _.uniqueId('NUEVA_'),
        items: this.state.newOrderItems
      }

      this.setState(prevState => ({
        ...prevState,
        newOrderItems: [],
        orders : [...prevState.orders, newOrder]
      }))
    }
    
      render() {
    
        var { isLoaded, orders} = this.state;
        
        const orderRowstyle = {
          padding: '3px',
          lineHeight: '12px'
        };

        const orderDetailStyle = {
          padding: '4px',
          lineHeight: '12px'
        }

        const orderHeaderRow = (
            <tr>
                <th>SKU</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio</th>
            </tr>);    

        let itemRow = item => (
          <tr style={orderDetailStyle} key ={item.id}>
            <td> {item.sku} </td>
            <td> {item.name} </td>
            <td> {item.quantity} </td>
            <td> ${item.price} </td>
          </tr>
        )

        let orderRows = orders.map(order => (
            <>
                <tr style={orderRowstyle} onClick={this.onOrderRowClickHandler} key ={order.id}>
                  <td colSpan="4">
                    <FontAwesomeIcon icon={faClipboardList}/> Orden #{order.id}
                  </td>
                </tr>
                <tr className="collapse">
                  <td colSpan ="4">
                    <table className="w-100">
                      <tbody>
                        {orderHeaderRow}
                        {order.items.map(item => itemRow(item))}
                      </tbody>
                    </table>
                  </td>
                </tr>
            </>
        ));
        const navbarHeader = (
            <Navbar variant="secondary">
              <Navbar.Brand href="#">Ordenes de Compra</Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Navbar.Text className="font-italic">
                    (Examen de José Rosales para Tendency Innovations)
                </Navbar.Text>
              </Navbar.Collapse>
            </Navbar>
        )
    
        if (!isLoaded) {
          return <div>Cargando datos...</div>
        } else {
          return(
            <>
                {navbarHeader}
                <Container className="mt-5 mb-5">
                <Row>
                  <Col className="h4 text-center">
                    Haga click en cualquier orden para expandirla.
                  </Col>
                </Row>
                <Row>
                  <Col className="h5 text-center">
                    Puede ir al final de la pagina para agregar productos y ordenes nuevas.
                  </Col>
                </Row>
                <Table striped bordered hover>
                  <thead>
                  </thead>
                  <tbody>
                    {orderRows}
                  </tbody>
                </Table>
                <Form>
                  <Row>
                    <Col className="h3">
                      Nueva Orden
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Table striped bordered hover variant="secondary" className="w-100 text-center">
                        <thead>
                        </thead>
                        <tbody>
                          {this.state.newOrderItems.length > 0 ? orderHeaderRow : null}
                          {this.state.newOrderItems.map(item => itemRow(item))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="newSKU">
                        <Form.Label> SKU </Form.Label>
                        <Form.Control type="text" pattern="[0-9]*"
                            onChange={evt => this.updateNewSku(evt)}>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="newName">
                        <Form.Label> Nombre </Form.Label>
                        <Form.Control type="text"
                            onChange={evt => this.updateNewName(evt)}>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="newQuantity">
                        <Form.Label> Cantidad </Form.Label>
                        <Form.Control type="text" pattern="[0-9]*"
                            onChange={evt => this.updateNewQuantity(evt)}>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="newPrice">
                        <Form.Label> Precio </Form.Label>
                        <Form.Control type="number"
                            onChange={evt => this.updateNewPrice(evt)}>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button onClick={this.onNewItemClickHandler} size="sm">
                      <FontAwesomeIcon icon={faPlus} /> Agregar Producto
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button variant="success" className="float-right"
                          onClick={this.onAddOrderClickHandler} size="bg">
                      <FontAwesomeIcon icon={faCartPlus} /> Agregar Orden
                      </Button>
                    </Col>
                  </Row>
                </Form>
                </Container>
            </>
        )
        }
    }
}