import './Panel.scss'
import React, { Component } from 'react';
import rectangle from './images/rectangle03.png';
import axios from 'axios';


class Panel extends Component {

    constructor(props) {
        super(props);
        this.state = { 
          valueX: 0,
          valueY: 0,
          records: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.showResults = this.showResults.bind(this);
    }   
    
    async handleSubmit(event){
        
        event.preventDefault();
        var response = await axios.post('/api', {param1: this.state.valueX, param2: this.state.valueY},  { validateStatus: false });
        this.setState({result: response.data.out});

    }
    async showResults(event){
        
        event.preventDefault();
        var response = await axios.get('api/results');
        
        // response.data.forEach(element => { 
        //     console.log(element.area);

        // }); 
        this.setState({records: response.data});        
        // this.setState({records: response.data[0].area});        

    }
    

    handleChange(event) {
        const target = event.target;
        const value =  target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });     
    }

    render() {
        return (
            <div className='Panel'>
                <div className='Panel__title'>Calculate the area of ​​a rectangle</div>
                <img src={rectangle}/> 
                <form onSubmit={this.handleSubmit}>
                    <div className='Panel__box'>
                        <label>
                        Length x
                        </label>
                        <input name="valueX" type="number" value={this.state.valueX} onChange={this.handleChange} />
                    </div>
                   
                    <div className='Panel__box'>
                        <label>
                        Length y
                        </label>
                        <input name="valueY"type="number" value={this.state.valueY} onChange={this.handleChange} />
                    </div>
                    
                    <div className='Panel__box'>
                        <label>
                            Answer: 
                        </label>
                        <div className='Panel__answer'>
                            {this.state.result}
                        </div>
                    </div> 
                    
                    <input type="submit" value='Calculate'/>
                </form>
                <div className='Panel__records'>
                    Show all records
                    <i class="fas fa-angle-double-down" onClick={this.showResults}></i>
                    <div className="Panel__allRecords"> {this.state.records.map(item => <div>{item["area"]}</div>)}
                    
                    </div>
                </div>    
            </div>
        );
      }
    }
  
export default Panel;
