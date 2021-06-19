import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'
import SummaryCard from './SummaryCard'
import StateWiseTable from './StateWiseTable'

function App() {
  const [covidData, setCovidData] = useState([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    const fethData = async () => {
      const { data } = await axios.get(
        'https://api.rootnet.in/covid19-in/stats/latest'
      )
      setCovidData(data)
      setLoading(false)
    }

    fethData()
  }, [])

  const { data, lastOriginUpdate } = covidData

  const dateTime = new Date(lastOriginUpdate)
    .toLocaleString('en-US', {
      hour12: true,
    })
    .split(',')

  const filterQuery = (items) => {
    return items.filter((item) => item.loc.toLowerCase().indexOf(query) > -1)
  }

  if (loading) {
    return (
      <div className='d-flex justify-content-center my-5 text-primary'>
        <div className='spinner-border width-height' role='status'></div>
      </div>
    )
  }

  return (
    <div className='container-md text-center'>
      <div className='container-fluid justify-content-center bg-secondary text-white display-6 my-2 p-2 rounded-3'>
        Last Updated : {`${dateTime[0]} @ ${dateTime[1]}`}
      </div>

      <div>{data && data.summary && <SummaryCard data={data.summary} />}</div>

      <div className='p-3 m-auto d-flex justify-content-center'>
        <input
          className='form-control input-lg '
          type='text'
          placeholder="Search by state name e.g 'tamilnadu'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {data && data.regional && (
        <StateWiseTable
          data={filterQuery(data.regional)}
          queryKeyword={query}
        />
      )}

      <div className='bg-secondary text-white rounded-3 my-2 p-2'>
        <h1>#StayHomeStaySafe</h1>
      </div>
    </div>
  )
}

export default App
