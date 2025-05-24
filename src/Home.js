// CurrencyConverter.js
import React from 'react';
import currencies from './utils/currencies';
import { checkStatus, json } from './utils/fetchUtils';

class Home extends React.Component {
  constructor(props) {
    super(props);

    const params = new URLSearchParams(props.location.search);

    this.state = {
      rate: 0,
      baseAcronym: params.get('base') || 'USD',
      baseValue: 0,
      quoteAcronym: params.get('quote') || 'JPY',
      quoteValue: 0,
      loading: false,
    };

    this.chartRef = React.createRef();
  }

  componentDidMount() {
    const { baseAcronym, quoteAcronym } = this.state;
    this.getRate(baseAcronym, quoteAcronym);
  }

  getRate = (base, quote) => {
    this.setState({ loading: true });
    fetch(`https://api.frankfurter.app/latest?from=${base}&to=${quote}`)
      .then(checkStatus)
      .then(json)
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }

        const rate = data.rates[quote];

        this.setState({
          rate,
          baseValue: 1,
          quoteValue: Number((1 * rate).toFixed(3)),
          loading: false,
        });
      })
      .catch(error => console.error(error.message));
  }

  

  toBase(amount, rate) {
    return amount * (1 / rate);
  }

  toQuote(amount, rate) {
    return amount * rate;
  }

  convert(amount, rate, equation) {
    const input = parseFloat(amount);
    if (Number.isNaN(input)) {
      return '';
    }
    return equation(input, rate).toFixed(3);
  }

  changeBaseAcronym = (event) => {
    const baseAcronym = event.target.value;
    this.setState({ baseAcronym });
    this.getRate(baseAcronym, this.state.quoteAcronym);
  }

  changeBaseValue = (event) => {
    const quoteValue = this.convert(event.target.value, this.state.rate, this.toQuote);
    this.setState({
      baseValue: event.target.value,
      quoteValue,
    });
  }

  changeQuoteAcronym = (event) => {
    const quoteAcronym = event.target.value;
    this.setState({ quoteAcronym });
    this.getRate(this.state.baseAcronym, quoteAcronym);
  
  }

  changeQuoteValue = (event) => {
    const baseValue = this.convert(event.target.value, this.state.rate, this.toBase);
    this.setState({
      quoteValue: event.target.value,
      baseValue,
    });
  }

  render() {
    const { rate, baseAcronym, baseValue, quoteAcronym, quoteValue, loading } = this.state;
    const currencyOptions = Object.keys(currencies).map(currencyAcronym => <option key={currencyAcronym} value={currencyAcronym}>{currencyAcronym}</option>);

    return (
      <React.Fragment>
        <div className="text-center p-3">
          <h2 className="mb-2" id="title">Currency Converter</h2>
        </div>
        
        <form className="row p-3 mb-12 main">
          <div className="col-md-4 mb-0">
            <div className="input-group">
              <input id="base" className="form-control form-control-lg" value={baseValue} onChange={this.changeBaseValue} type="number" />
              <div className="input-group-text">{currencies[baseAcronym].symbol}</div>
            </div>
            </div>

          <div className="col-md-4 mb-0"> 
            <select value={baseAcronym} onChange={this.changeBaseAcronym} 
            className="form-control form-control-lg mb-2" disabled={loading}>
              {currencyOptions}
            </select>
            <small className="text-secondary">{currencies[baseAcronym].name}</small>
          </div>

          <div className=" col-md-4 mb-0">
            <select value={quoteAcronym} onChange={this.changeQuoteAcronym} 
            className="form-control form-control-lg mb-2" disabled={loading}>
              {currencyOptions}
            </select>  
            <small className="text-secondary">{currencies[quoteAcronym].name}</small>
          </div>

  
          <div class="result">
            <h1>{currencies[quoteAcronym].symbol}{quoteValue} {currencies[quoteAcronym].name}</h1>
            <h4>1 {baseAcronym}  = {rate.toFixed(4)} {quoteAcronym}</h4>
          </div>
        </form>
        
      
   
      </React.Fragment>
    )
  }
}

export default Home