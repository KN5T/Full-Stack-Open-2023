import { useState } from "react"

const Button = ({ name, handleClick }) => {
  return (
    <>
      <button onClick={handleClick}>{name}</button>
    </>
  )
}

const Feedback = (props) => {
  return (
    <div>
      <h1>give feedback</h1>
      <Button name="good" handleClick={props.setGood} />
      <Button name="neutral" handleClick={props.setNeutral} />
      <Button name="bad" handleClick={props.setBad} />
    </div>
  )
}

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>
        {value} {text === "positive" ? "%" : ""}
      </td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const all = () => good + neutral + bad
  const avg = () =>
    all() === 0 ? 0 : (good * 1 + neutral * 0 + bad * -1) / all()
  const positivePercent = () => (all() === 0 ? 0 : (good / all()) * 100)

  if (all() === 0)
    return (
      <div>
        <h1>statistics</h1>
        <div>No feedback given</div>
      </div>
    )

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all()} />
          <StatisticLine text="average" value={avg()} />
          <StatisticLine text="positive" value={positivePercent()} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Feedback
        setGood={() => setGood(good + 1)}
        setNeutral={() => setNeutral(neutral + 1)}
        setBad={() => setBad(bad + 1)}
      />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App

