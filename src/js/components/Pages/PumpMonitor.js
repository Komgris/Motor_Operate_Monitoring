import React, { Component } from 'react'
import Panel from './PumpPanel'
import './PumpMonitor.css'
import Remote from './Remote'
import { withRouter } from 'react-router-dom';
import Axios from 'axios';
import txt from '!!raw-loader!../config/Config.txt';
import Flowswitch from './Flowswitch'
import Alarmnoti from './Alarmnoti';

 class PumpMonitor extends Component {
    intervalID = 0;
    constructor(props) {
        super(props);
        this.sendTable = this.sendTable.bind(this);
        this.state ={
            pump1:"",
            Remote1:"",
            Fsw1:"",
            Rundry1:"",
            pump2:"",
            Remote2:"",
            Fsw2:"",
            Rundry2:"",
            accessToken:"",
            API:txt,
            Fault2S1:"",
            Fault2S2:"",
            Alarm:"",
            Mode1:"",
            Mode2:"",
            timeStart1:"",
            timeStop1:"",
            timeStart2:"",
            timeStop2:"",
        }
    }

    componentDidMount()
    {   
        //if (localStorage.getItem('userToken') === null || localStorage.getItem('userToken') === "")
        //console.log(localStorage["userToken"])
       
        if (localStorage.getItem('userToken') === null)//(localStorage.getItem('userToken') === null)
        {   
            //console.log('no localstorage')
            this.props.history.push(`/`);
        }
        else{
            this.checkToken();
            this.loadData();
            this.intervalID = setInterval(this.loadData.bind(this), 2000);    
        }
    }
    componentWillUnmount(){
        clearInterval(this.intervalID);
    }
    checkToken =()=>{
        var token;

        if(this.props.keytoapi === "")
        {
           token =  localStorage.getItem('userToken');
         
        }
        else
        {
           token =  this.props.keytoapi;
        }
        console.log(token)
        this.setState((state) => ({ accessToken : token}));
    }

    sendTable =()=>{
        this.props.confirm(this.state.Alarm);
    }
    SplitText=(text)=>{
        if(text.includes('o'))
        {
            return "null"
        }
        else{
            return text.substring(0, 2) + ":" + text.substring(2);
        }
    }

    async loadData() {
            {
                Axios.get(`${this.state.API}/Pump/WebUpdateStatus/${this.state.accessToken}`)
                //Axios.get(`http://192.168.10.36/skapi/SystemAPI/Pump/RestAPI`)
                .then(res => { const result = JSON.parse(res.data);
                        if(result.Value === "Access denied!")
                            {
                              //localStorage.setItem('userToken', "");
                              //localStorage.setItem('userToken', "");
                              localStorage.removeItem('userToken');
                              this.props.history.push(`/`);
                            }
                            else
                            { 
                                if(result.IsSuccess)
                                {
                                    //console.log(this.state.accessToken)
                                    var update_status =  JSON.parse(result.Value);
                                    var update_alarm =  JSON.parse(result.Alarm);
                                    console.log( "status"+ update_status.Mode1 + update_status.Mode2);

                                    this.sendTable(this);
                                    this.setState({
                                        Remote1 : update_status.RemoteLocal1,
                                        Fsw1 : update_status.Fsw1,
                                        Rundry1  : update_status.Rundry1,
                                        pump1  : update_status.PumpStatus1,
                                        Fault2S1 : update_status.sFault1,
                                        Mode1 : update_status.Mode1,
                                        Mode2 : update_status.Mode2,

                                        timeStart1 : this.SplitText(update_status.TimeStart1),
                                        timeStop1 : this.SplitText(update_status.TimeStop1),
                                        timeStart2 : this.SplitText(update_status.TimeStart2),
                                        timeStop2 : this.SplitText(update_status.TimeStop2),
                                        

                                        Remote2 : update_status.RemoteLocal2,
                                        Fsw2 : update_status.Fsw2,
                                        Rundry2  : update_status.Rundry2,
                                        pump2  : update_status.PumpStatus2,
                                        Fault2S2 : update_status.sFault2,
                                        Alarm :  update_alarm

                                      });
                                }
                            }
                })
              }
         }
   
  
    render() {
       
        return (
            
            <div class = "background">
    
            <div class = "container">
                <div class = "container-n">
                   
                    <h1>Pump Station</h1>
              
                        
                        
                 
                    <div class = "container-s">
                        <div class = "panel-1">
                        <Panel pumpNum = "1" keyAPI ={this.state.accessToken} status = {this.state.pump1}  runDry = {this.state.Rundry1} remote = {this.state.Remote1} F2S = {this.state.Fault2S1}  Pmode = {this.state.Mode1} timestart = {this.state.timeStart1} timestop = {this.state.timeStop1} />                    
                        </div>
                        <div class = "panel-2"> 
                        <Panel pumpNum = "2" keyAPI ={this.state.accessToken}  status = {this.state.pump2} runDry = {this.state.Rundry2} remote = {this.state.Remote2} F2S = {this.state.Fault2S2}  Pmode = {this.state.Mode2} timestart = {this.state.timeStart2} timestop = {this.state.timeStop2} />
                        </div>
                    </div> 
                    </div>       
            </div>
            <div class = "symbol">   
            <div class = "container-pump-status">
             <div class = "border-pump" ><Remote   status = {this.state.pump1}></Remote> </div>
            <div class = "border-pump-2" ><Remote   status = {this.state.pump2}></Remote> </div> 
            </div>
            <div class = "container-pump-flow">
            <div class = "border-flow-panel" ><Flowswitch flow = {this.state.Fsw1}></Flowswitch></div>
            <div class = "border-flow-panel2" ><Flowswitch flow = {this.state.Fsw2}></Flowswitch></div>
            </div>    
            </div>
            </div>
        )
    }
}


export default withRouter(PumpMonitor)



