import './Ipset.css';
import axios from "axios";
import {useEffect, useState} from "react";


function Ipset() {
  let [ipsets, setIpsets] = useState([]);
  let [ip, setIp] = useState('');
  let [freshClickable, setFreshClickable] = useState(true);
  useEffect(() => {
    axios.get("/api/status").then(r => {
      setIpsets(r.data.sets)
      setIp(r.data.ip)
    })
  }, [setIpsets])
  let removeIp = function (set, ip) {
    console.log("delete", ip, "from", set)
    axios.post("/api/remove", {
      ip: ip,
      set: set
    })
      .then(r => axios.get("/api/status"))
      .then(r => setIpsets(r.data.sets))
  }
  let addIp = function (set, ip) {
    console.log("add", ip, "to", set)
    axios.post("/api/add", {
      ip: ip,
      set: set
    })
      .then(r => axios.get("/api/status"))
      .then(r => setIpsets(r.data.sets))
  }
  let refreshCHN = function () {
    setFreshClickable(false)
    axios.get("/api/refresh-route")
      .then(r => {
        if (r.status === 200) {
          alert("Refresh Success")
        }
      })
      .finally(() => {
        setFreshClickable(true)
      })
  }
  let cards = ipsets.map(it => {
    return (<div className="card" key={it.name}>
      <header className="fix-header">{it.name}</header>
      <div className="content">
        <table>
          <tbody>
          {/*<tr>*/}
          {/*  <td>Type</td>*/}
          {/*  <td>{it.SetType}</td>*/}
          {/*</tr>*/}
          {/*<tr>*/}
          {/*  <td>Header</td>*/}
          {/*  <td>{it.Header}</td>*/}
          {/*</tr>*/}
          </tbody>
        </table>
        <div className="ips">
          {
            (it.ip ?? []).map(e => (<span key={e} onClick={function (event) {
              removeIp(it.name, e)
            }}>{e}</span>))
          }
          <span><input onKeyDown={function (event) {
            if (event.key === 'Enter') {
              addIp(it.name, event.target.value)
              event.target.value = ''
            }
          }}/></span>
        </div>
      </div>
    </div>)
  });
  return (
    <div className="ipset">
      <div className="operation">
        <span>Your IP: <b>{ip}</b></span>
        <button disabled={!freshClickable} onClick={refreshCHN}>Update CHNRoute</button>
      </div>
      <div className="container">
        {cards}
      </div>
    </div>
  );
}

export default Ipset;