import React, { Component } from 'react';
import './App.css';
import moment from 'moment';

const distList = ['kannur', 'idukki', 'calicut', 'wayanad', 'malapuram'];
const nameList = ['Basith', 'Rinoy', 'Roshan', 'Shunmu', 'Sidharth', 'Mayank', 'Vijay', 'Arun', 'Ram', 'Seetha', 'Anjali']

class App extends Component {

  processData =data=> {
    return data.map(i=>{
      i.filterStr = JSON.stringify(i).toLocaleLowerCase();
      return i;
    })
  }


  state = {
    tabIndex: 0,
    stateIndex: 0,
    searchStr: '',
    data: this.processData([
      ...(()=>{
        let data = [];
        for(let idx=0; idx<100; idx++) {
          data.push({
            id:idx, 
            name: nameList[Math.floor(Math.random() * nameList.length)] + ' ' + nameList[Math.floor(Math.random() * nameList.length)], 
            contactno: '9896344556', 
            district: distList[Math.floor(Math.random() * distList.length)], 
            lat: 12.123123, 
            lng: 12.323334,
            issues: []
          })
        }
        return data;
      })()
    ])
  };

  setTab =(tabIndex, stateIndex)=> {
    this.setState({tabIndex, stateIndex})
  };

  filterData =(item, index)=> {
    if(this.state.searchStr && this.state.searchStr.length > 2) {
      return item.filterStr.indexOf(this.state.searchStr) !== -1;
    }
    return true;
  };

  onInputChange =()=> {
    clearTimeout(this.searchDeBound);
    this.searchDeBound = setTimeout(()=>{
      let searchStr = (this.refs.inputStr.value || '').toLocaleLowerCase();
      this.setState({searchStr});
    }, 500)
  }

  getLocation(callback) {
    if (navigator.geolocation) {
      navigator.permissions.query({name:'geolocation'}).then((result)=> {
        this.setState({coords: result.state})
        navigator.geolocation.getCurrentPosition(callback, callback, {enableHighAccuracy: true, maximumAge: 10000});
      });
    } else {
      callback(null);
    }
  }

  quickHelp =()=> {
    this.getLocation(location=>{
      if(location && location.coords) {
        this.openInNewTab('https://www.google.com/maps?q='+location.coords.latitude+','+location.coords.longitude);
      }
    });
  }

  openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
  }

  render() {
    return (
      <div className="App">
        {this.state.tabIndex === 0 ? (
          <div className="tab">
            
            <div className="t1-buttonSet">
              <div className='t1bs-button'><span onClick={()=>this.setTab(1, 0)}>GIVE HELP</span></div>
              <div className='t1bs-button'><span onClick={()=>this.setTab(1, 1)}>GET HELP</span></div>
            </div>
            <div className="t1-quickHelp" onClick={this.quickHelp}>{this.state.coords}</div>
          </div>
        ) : this.state.tabIndex === 1 ? (
          <div className="tab">
            <div className='t2-header'>
              <input onChange={this.onInputChange} ref='inputStr' placeholder="Click here to Search | Filter | Area | Person"/>
            </div>
            <div className='t2-body'>
              {this.state.data.filter(this.filterData).map((item, index)=> {
                return (
                  <div className="t2b-item" key={index}>
                    <div className='t2bi-col'>{item.name}</div>
                    <div className='t2bi-col'>{item.district}</div>
                    <div className='t2bi-col'>{item.contactno}</div>
                    <div className='t2bi-col'>{moment(item.date).format('DD-MMM, hh:mm a')}</div>
                  </div>
                )                
              })}
            </div>
          </div>
        ) : ''}
      </div>
    );
  }
}

export default App;
