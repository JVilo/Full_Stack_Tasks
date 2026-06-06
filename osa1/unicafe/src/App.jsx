import { useState } from 'react'

const Header = ({ title }) => {
  return <h1>{title}</h1>
}

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({ text, value, symbol = '' }) => (
  <tr>
    <td>{text}</td>
    <td>{value} {symbol}</td>
  </tr>
)

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad

  if (total === 0) {
    return (
      <div>
        <Header title="statistics" />
        <div>No feedbck given</div>
      </div>
    )
  }

  const average = (good - bad) / total
  const positiv = (good / total) * 100

  return (
    <div>
      <Header title="statistics" />
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average.toFixed(2)} />
          <StatisticLine text="positive" value={positiv.toFixed(2)} symbol="%" />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const title = 'give feedback'
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => {
    setGood(good + 1)
  }

  const increaseNeutral = () => {
    setNeutral(neutral + 1)
  }

  const increaseBad = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <Header title={title} />
      <Button onClick={increaseGood} text="good" />
      <Button onClick={increaseNeutral} text="neutral" />
      <Button onClick={increaseBad} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
