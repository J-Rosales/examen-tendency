import { render } from '@testing-library/react';
import React, { Component } from 'react';

class App extends Component {
  
  constructor(props) {
    super();
    this.state = {
      orders: [],
      isLoaded: false,
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

  render() {

    var { isLoaded, orders} = this.state;

    if (!isLoaded) {
      return <div>Cargando datos...</div>
    } else {
      return (
        <div className="App">
          <ul>
            {orders.map(order => (
              <li key={order.id}>
                <ul>
                  {order.items.map(item => (
                    <li key ={item.id}>
                      sku: {item.sku} | nombre: {item.name} | cantidad: {item.quantity} | precio: {item.price}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
        );
      }
    };
  }
  
  export default App;
  